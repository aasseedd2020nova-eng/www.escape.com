-- ESCAPE Warranty Platform | PostgreSQL / Neon
-- Version 1.0 | Run ONCE on a NEW, EMPTY ESCAPE database.
-- Safe to rerun on this schema; it does not delete existing records.
-- IMPORTANT: Never place your DATABASE_URL or passwords in this SQL file.
BEGIN;

-- 1) Only the two product categories approved for ESCAPE.
CREATE TABLE IF NOT EXISTS public.products (
    product_key TEXT PRIMARY KEY,
    name_ar TEXT NOT NULL,
    warranty_months INTEGER NOT NULL CHECK (warranty_months BETWEEN 1 AND 120),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.products (product_key, name_ar, warranty_months)
VALUES
    ('thermal', 'عازل حراري', 60),
    ('glass', 'حماية الزجاج الأمامي', 12)
ON CONFLICT (product_key) DO NOTHING;

-- 2) Owner enters each code manually: A-1234, B-5678, Z-0001.
CREATE TABLE IF NOT EXISTS public.warranty_codes (
    code TEXT PRIMARY KEY CHECK (code ~ '^[A-Z]-[0-9]{4}$'),
    shop_letter TEXT GENERATED ALWAYS AS (LEFT(code, 1)) STORED,
    product_key TEXT NOT NULL REFERENCES public.products(product_key),
    status TEXT NOT NULL DEFAULT 'unused'
        CHECK (status IN ('unused', 'active', 'suspended', 'cancelled')),
    customer_phone TEXT CHECK (customer_phone ~ '^[+][1-9][0-9]{7,14}$'),
    activated_at TIMESTAMPTZ,
    installation_date DATE,
    expiry_date DATE,
    warranty_months_at_activation INTEGER
        CHECK (warranty_months_at_activation BETWEEN 1 AND 120),
    whatsapp_consent BOOLEAN NOT NULL DEFAULT FALSE,
    whatsapp_consent_at TIMESTAMPTZ,
    suspension_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT warranty_activation_consistency CHECK (
        (status IN ('unused', 'cancelled')
            AND customer_phone IS NULL AND activated_at IS NULL
            AND installation_date IS NULL AND expiry_date IS NULL
            AND warranty_months_at_activation IS NULL)
        OR
        (status IN ('active', 'suspended')
            AND customer_phone IS NOT NULL AND activated_at IS NOT NULL
            AND installation_date IS NOT NULL AND expiry_date IS NOT NULL
            AND warranty_months_at_activation IS NOT NULL
            AND expiry_date > installation_date)
    ),
    CONSTRAINT warranty_suspension_consistency CHECK (
        (status = 'suspended' AND NULLIF(BTRIM(suspension_reason), '') IS NOT NULL)
        OR (status <> 'suspended' AND suspension_reason IS NULL)
    ),
    CONSTRAINT warranty_whatsapp_consent_consistency CHECK (
        (whatsapp_consent AND whatsapp_consent_at IS NOT NULL)
        OR (NOT whatsapp_consent AND whatsapp_consent_at IS NULL)
    )
);

-- 3) Automatic WhatsApp PDF-delivery tracking.
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    warranty_code TEXT NOT NULL REFERENCES public.warranty_codes(code),
    recipient_phone TEXT NOT NULL CHECK (recipient_phone ~ '^[+][1-9][0-9]{7,14}$'),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'sent', 'delivered', 'read', 'failed')),
    provider_message_id TEXT UNIQUE,
    attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4) Phone verification for private warranty lookup.
-- Store only an OTP hash, never the actual verification code.
CREATE TABLE IF NOT EXISTS public.phone_verifications (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    phone TEXT NOT NULL CHECK (phone ~ '^[+][1-9][0-9]{7,14}$'),
    otp_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts BETWEEN 0 AND 5),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5) Audit trail. Never store API keys or passwords here.
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    action TEXT NOT NULL,
    warranty_code TEXT,
    details JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6) Non-secret application settings.
CREATE TABLE IF NOT EXISTS public.settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.settings (setting_key, setting_value)
VALUES ('support_whatsapp', '966561739836')
ON CONFLICT (setting_key) DO NOTHING;

-- 7) Fast lookup and grouped shop reports.
CREATE INDEX IF NOT EXISTS idx_warranty_shop_product_status
    ON public.warranty_codes (shop_letter, product_key, status);
CREATE INDEX IF NOT EXISTS idx_warranty_phone
    ON public.warranty_codes (customer_phone)
    WHERE customer_phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_warranty_activated
    ON public.warranty_codes (activated_at DESC)
    WHERE activated_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_whatsapp_warranty
    ON public.whatsapp_messages (warranty_code, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_phone
    ON public.phone_verifications (phone, created_at DESC);

CREATE OR REPLACE VIEW public.shop_warranty_summary AS
SELECT shop_letter, product_key,
       COUNT(*) FILTER (WHERE status = 'unused') AS unused_count,
       COUNT(*) FILTER (WHERE status = 'active') AS active_count,
       COUNT(*) FILTER (WHERE status = 'suspended') AS suspended_count,
       COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_count,
       COUNT(*) AS total_count
FROM public.warranty_codes
GROUP BY shop_letter, product_key;

-- 8) Prevent changing the identity or dates of an activated warranty.
CREATE OR REPLACE FUNCTION public.protect_warranty_record()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public, pg_temp AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        IF OLD.activated_at IS NOT NULL THEN
            RAISE EXCEPTION 'Activated warranties cannot be deleted';
        END IF;
        RETURN OLD;
    END IF;

    IF OLD.status = 'cancelled' AND NEW.status <> 'cancelled' THEN
        RAISE EXCEPTION 'Cancelled codes cannot be reactivated';
    END IF;
    IF OLD.activated_at IS NOT NULL AND (
        NEW.code IS DISTINCT FROM OLD.code OR
        NEW.product_key IS DISTINCT FROM OLD.product_key OR
        NEW.customer_phone IS DISTINCT FROM OLD.customer_phone OR
        NEW.activated_at IS DISTINCT FROM OLD.activated_at OR
        NEW.installation_date IS DISTINCT FROM OLD.installation_date OR
        NEW.expiry_date IS DISTINCT FROM OLD.expiry_date OR
        NEW.warranty_months_at_activation IS DISTINCT FROM OLD.warranty_months_at_activation
    ) THEN
        RAISE EXCEPTION 'Activated warranty identity and dates are immutable';
    END IF;
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_warranty_update ON public.warranty_codes;
CREATE TRIGGER trg_protect_warranty_update
BEFORE UPDATE ON public.warranty_codes
FOR EACH ROW EXECUTE FUNCTION public.protect_warranty_record();

DROP TRIGGER IF EXISTS trg_protect_warranty_delete ON public.warranty_codes;
CREATE TRIGGER trg_protect_warranty_delete
BEFORE DELETE ON public.warranty_codes
FOR EACH ROW EXECUTE FUNCTION public.protect_warranty_record();

-- 9) Atomic, single-use activation. Call only from the trusted server.
CREATE OR REPLACE FUNCTION public.activate_warranty(
    p_code TEXT,
    p_phone TEXT,
    p_whatsapp_consent BOOLEAN DEFAULT FALSE
)
RETURNS public.warranty_codes
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
    v_warranty public.warranty_codes%ROWTYPE;
    v_today DATE := (NOW() AT TIME ZONE 'Asia/Riyadh')::DATE;
BEGIN
    IF p_code IS NULL OR p_code !~ '^[A-Z]-[0-9]{4}$' THEN
        RAISE EXCEPTION 'Invalid warranty code format';
    END IF;
    IF p_phone IS NULL OR p_phone !~ '^[+][1-9][0-9]{7,14}$' THEN
        RAISE EXCEPTION 'Invalid phone format: use +9665XXXXXXXX';
    END IF;

    UPDATE public.warranty_codes AS w
       SET status = 'active',
           customer_phone = p_phone,
           activated_at = NOW(),
           installation_date = v_today,
           expiry_date = (v_today + MAKE_INTERVAL(months => p.warranty_months))::DATE,
           warranty_months_at_activation = p.warranty_months,
           whatsapp_consent = COALESCE(p_whatsapp_consent, FALSE),
           whatsapp_consent_at = CASE WHEN COALESCE(p_whatsapp_consent, FALSE) THEN NOW() ELSE NULL END
      FROM public.products AS p
     WHERE w.code = p_code
       AND w.product_key = p.product_key
       AND w.status = 'unused'
       AND p.is_active = TRUE
    RETURNING w.* INTO v_warranty;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Code unavailable, already activated, or product disabled';
    END IF;
    RETURN v_warranty;
END;
$$;

-- Prevent execution by arbitrary DB roles; server uses the database owner.
REVOKE ALL ON FUNCTION public.activate_warranty(TEXT, TEXT, BOOLEAN) FROM PUBLIC;

-- 10) Automatic code-creation and status-change audit.
CREATE OR REPLACE FUNCTION public.audit_warranty_changes()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public, pg_temp AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.admin_logs (action, warranty_code, details)
        VALUES ('code_created', NEW.code, JSONB_BUILD_OBJECT('product', NEW.product_key));
    ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
        INSERT INTO public.admin_logs (action, warranty_code, details)
        VALUES ('status_changed', NEW.code,
                JSONB_BUILD_OBJECT('from', OLD.status, 'to', NEW.status));
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_warranty ON public.warranty_codes;
CREATE TRIGGER trg_audit_warranty
AFTER INSERT OR UPDATE ON public.warranty_codes
FOR EACH ROW EXECUTE FUNCTION public.audit_warranty_changes();

COMMIT;

-- After successful execution, this read-only check must return 2 products.
SELECT product_key, name_ar, warranty_months FROM public.products ORDER BY product_key;
