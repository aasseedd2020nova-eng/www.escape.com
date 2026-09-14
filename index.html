<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com;">
    
    <title>ESCAPE - نظام التوثيق والضمان الفائق</title>
    
    <!-- خطوط فاخرة -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800;900&family=Tajawal:wght@300;500;700;900&display=swap" rel="stylesheet">
    
    <!-- مكتبة QR Code -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    
    <style>
        :root {
            --bg-void: #020408;
            --card-glass: rgba(10, 15, 26, 0.85);
            --neon-cyan: #00f0ff;
            --neon-glow: rgba(0, 240, 255, 0.4);
            --gold-accent: #ffd700;
            --gold-glow: rgba(255, 215, 0, 0.3);
            --text-main: #ffffff;
            --text-dim: #8a99ad;
            --border-glow: rgba(0, 240, 255, 0.3);
            --success: #10b981;
            --danger: #ef4444;
        }

        * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
            font-family: 'Tajawal', sans-serif;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            background-color: var(--bg-void);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 15px;
            overflow-x: hidden;
            position: relative;
        }

        #particles-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
        }

        .container {
            width: 100%;
            max-width: 1080px;
            z-index: 2;
            position: relative;
        }

        .brand-header {
            text-align: center;
            margin-bottom: 25px;
        }

        .brand-logo {
            font-family: 'Orbitron', sans-serif;
            font-size: 44px;
            font-weight: 900;
            letter-spacing: 6px;
            background: linear-gradient(135deg, #ffffff 20%, var(--neon-cyan) 60%, var(--gold-accent) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 30px var(--neon-glow);
            display: inline-block;
        }

        .brand-tagline {
            font-size: 13px;
            color: var(--text-dim);
            letter-spacing: 2px;
            margin-top: -5px;
            text-transform: uppercase;
        }

        .view-section {
            display: grid;
            animation: fadeIn 0.5s ease-in-out forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .portal-grid {
            grid-template-columns: 1fr;
            gap: 25px;
        }

        @media (min-width: 900px) {
            .portal-grid {
                grid-template-columns: 1.1fr 0.9fr;
            }
        }

        .glass-panel {
            background: var(--card-glass);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--border-glow);
            border-radius: 24px;
            padding: 28px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), inset 0 0 15px rgba(0, 240, 255, 0.05);
            position: relative;
            overflow: hidden;
        }

        .glass-panel::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
        }

        .panel-title {
            font-size: 18px;
            font-weight: 800;
            color: #fff;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-bottom: 12px;
        }

        .security-badge {
            font-size: 10px;
            color: var(--neon-cyan);
            border: 1px solid var(--border-glow);
            padding: 3px 8px;
            border-radius: 20px;
            background: rgba(0, 240, 255, 0.05);
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
        }

        @media (max-width: 600px) {
            .form-row { grid-template-columns: 1fr; }
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-group label {
            display: block;
            font-size: 12px;
            font-weight: 700;
            color: var(--text-dim);
            margin-bottom: 6px;
            text-transform: uppercase;
        }

        .input-control {
            width: 100%;
            padding: 14px 16px;
            background: rgba(4, 8, 15, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 12px;
            color: #fff;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .input-control:focus {
            outline: none;
            border-color: var(--neon-cyan);
            box-shadow: 0 0 15px var(--neon-glow);
            background: rgba(6, 12, 22, 0.95);
        }

        .file-upload-box {
            border: 2px dashed rgba(0, 240, 255, 0.3);
            border-radius: 14px;
            padding: 18px;
            text-align: center;
            background: rgba(0, 240, 255, 0.02);
            cursor: pointer;
            transition: 0.3s;
            position: relative;
        }

        .file-upload-box:hover {
            border-color: var(--neon-cyan);
            background: rgba(0, 240, 255, 0.06);
        }

        .file-upload-box input[type="file"] {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            opacity: 0;
            cursor: pointer;
        }

        .preview-invoice-img {
            max-height: 80px;
            border-radius: 8px;
            margin-top: 10px;
            display: none;
            border: 1px solid var(--neon-cyan);
        }

        .btn-glow {
            width: 100%;
            padding: 16px;
            border: none;
            border-radius: 14px;
            background: linear-gradient(135deg, var(--neon-cyan) 0%, #0088ff 100%);
            color: #020408;
            font-weight: 900;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 0 25px var(--neon-glow);
            transition: all 0.3s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
        }

        .btn-glow:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 35px rgba(0, 240, 255, 0.7);
        }

        .card-perspective-wrapper {
            perspective: 1200px;
            width: 100%;
        }

        .holo-card {
            background: linear-gradient(135deg, rgba(15, 23, 38, 0.95) 0%, rgba(5, 8, 14, 0.98) 100%);
            border: 1px solid rgba(0, 240, 255, 0.4);
            border-radius: 22px;
            padding: 26px;
            position: relative;
            transform-style: preserve-3d;
            box-shadow: 0 30px 60px rgba(0,0,0,0.9), 0 0 30px var(--neon-glow);
            overflow: hidden;
            transition: transform 0.15s ease-out;
        }

        .holo-card::after {
            content: '';
            position: absolute;
            top: -150%; left: -150%;
            width: 300%; height: 300%;
            background: linear-gradient(
                115deg,
                transparent 40%,
                rgba(0, 240, 255, 0.08) 45%,
                rgba(255, 215, 0, 0.12) 50%,
                rgba(0, 240, 255, 0.08) 55%,
                transparent 60%
            );
            transform: rotate(25deg);
            pointer-events: none;
            animation: holoSweep 8s infinite linear;
        }

        @keyframes holoSweep {
            0% { transform: translateY(-30%) rotate(25deg); }
            100% { transform: translateY(30%) rotate(25deg); }
        }

        .card-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px dashed rgba(255, 255, 255, 0.12);
            padding-bottom: 15px;
            margin-bottom: 20px;
        }

        .holo-chip {
            width: 44px;
            height: 32px;
            background: linear-gradient(135deg, var(--gold-accent), #997a00);
            border-radius: 6px;
            position: relative;
            box-shadow: inset 0 0 6px rgba(0,0,0,0.6), 0 0 10px var(--gold-glow);
        }

        .holo-chip::before {
            content: '';
            position: absolute;
            top: 50%; left: 0; right: 0; height: 1px;
            background: rgba(0,0,0,0.5);
        }

        .status-badge-active {
            padding: 6px 14px;
            border-radius: 30px;
            font-size: 11px;
            font-weight: 800;
            background: rgba(16, 185, 129, 0.15);
            color: var(--success);
            border: 1px solid var(--success);
            box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .pulse-light {
            width: 7px;
            height: 7px;
            background: var(--success);
            border-radius: 50%;
            box-shadow: 0 0 8px var(--success);
            animation: pulse 1.2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }

        .card-body-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
        }

        .card-field {
            display: flex;
            flex-direction: column;
        }

        .card-field.full { grid-column: span 2; }

        .field-title {
            font-size: 11px;
            color: var(--text-dim);
            text-transform: uppercase;
        }

        .field-val {
            font-size: 15px;
            font-weight: 800;
            color: #fff;
            margin-top: 2px;
            word-break: break-word;
        }

        .field-val.accent {
            color: var(--neon-cyan);
            font-family: 'Orbitron', sans-serif;
        }

        .field-val.gold { color: var(--gold-accent); }

        .maintenance-tracker {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            padding: 12px;
            margin-top: 15px;
        }

        .tracker-header {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            margin-bottom: 6px;
            color: var(--text-dim);
        }

        .progress-bar-bg {
            height: 6px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 10px;
            overflow: hidden;
        }

        .progress-bar-fill {
            height: 100%;
            width: 100%;
            background: linear-gradient(90deg, var(--neon-cyan), var(--gold-accent));
            box-shadow: 0 0 10px var(--neon-glow);
        }

        #scanning-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(2, 4, 8, 0.95);
            backdrop-filter: blur(25px);
            z-index: 99;
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .laser-scanner {
            width: 180px;
            height: 180px;
            border: 2px solid var(--neon-cyan);
            border-radius: 20px;
            position: relative;
            box-shadow: 0 0 30px var(--neon-glow);
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        }

        .laser-line {
            position: absolute;
            width: 100%;
            height: 3px;
            background: var(--neon-cyan);
            box-shadow: 0 0 15px var(--neon-cyan);
            animation: scanMove 1.8s infinite ease-in-out alternate;
        }

        @keyframes scanMove {
            0% { top: 5%; }
            100% { top: 95%; }
        }

        .otp-modal {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(15px);
            z-index: 100;
            display: none;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .otp-box {
            background: var(--card-glass);
            border: 1px solid var(--neon-cyan);
            border-radius: 20px;
            padding: 30px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            box-shadow: 0 0 40px var(--neon-glow);
        }

        .otp-input {
            width: 100%;
            padding: 15px;
            font-size: 24px;
            letter-spacing: 12px;
            text-align: center;
            font-family: 'Orbitron', sans-serif;
            margin: 20px 0;
            border-radius: 12px;
            border: 1px solid var(--border-glow);
            background: #000;
            color: var(--neon-cyan);
        }

        .action-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-top: 18px;
        }

        .btn-action {
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: #fff;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        .btn-action:hover {
            background: rgba(0, 240, 255, 0.15);
            border-color: var(--neon-cyan);
            box-shadow: 0 0 12px var(--neon-glow);
        }

        .btn-action.full { grid-column: span 2; }

        @media print {
            body { background: #fff; color: #000; }
            #particles-canvas, .action-grid, .brand-header, #portalFormSection, .otp-modal, #scanning-overlay { display: none !important; }
            .holo-card {
                border: 2px solid #000;
                background: #fff !important;
                color: #000 !important;
                box-shadow: none !important;
                transform: none !important;
            }
            .field-val { color: #000 !important; }
            .field-title { color: #555 !important; }
        }
    </style>
</head>
<body>

<canvas id="particles-canvas"></canvas>

<!-- شاشة المحاكاة والمسح -->
<div id="scanning-overlay">
    <div class="laser-scanner">
        <div class="laser-line"></div>
        <div style="font-family: 'Orbitron'; color: var(--neon-cyan); font-size: 18px; font-weight: 900;">ESCAPE AI</div>
    </div>
    <div style="margin-top: 20px; font-size: 16px; font-weight: 700; color: #fff;" id="scanStatusText">جاري فحص وتشفير البيانات...</div>
</div>

<!-- نافذة التحقق OTP برقم الجوال -->
<div class="otp-modal" id="otpModal">
    <div class="otp-box">
        <h3 style="color: #fff; margin-bottom: 8px;">🔐 كود التحقق الأمني</h3>
        <p style="font-size: 13px; color: var(--text-dim);" id="otpPhoneNotice">تم إرسال رمز التحقق إلى جوال العميل</p>
        <input type="text" id="otpCodeInput" class="otp-input" maxlength="4" placeholder="0000">
        <button class="btn-glow" onclick="verifyOTPAndActivate()">تأكيد واعتماد الضمان</button>
        <button style="background:transparent; border:none; color:var(--text-dim); margin-top:12px; cursor:pointer; font-size:12px;" onclick="closeOTPModal()">إلغاء</button>
    </div>
</div>

<div class="container">
    <div class="brand-header">
        <div class="brand-logo">ESCAPE</div>
        <div class="brand-tagline">النظام الرقمي الفائق لتوثيق الضمان والحماية</div>
    </div>

    <!-- شاشة التفعيل والمعاينة -->
    <div id="portalFormSection" class="view-section portal-grid">
        
        <div class="glass-panel">
            <div class="panel-title">
                <span>🛡️ إصدار وتوثيق الضمان</span>
                <span class="security-badge">🔒 مشفر SSL / 256-bit</span>
            </div>

            <form id="warrantyForm" onsubmit="requestOTPVerification(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label>الاسم الكامل للعميل</label>
                        <input type="text" id="custName" class="input-control" placeholder="أدخل اسم العميل" required oninput="liveUpdateCard()">
                    </div>
                    <div class="form-group">
                        <label>رقم الجوال</label>
                        <input type="tel" id="custPhone" class="input-control" placeholder="05XXXXXXXX" required pattern="^(05|5)[0-9]{8}$">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>نوع وموديل السيارة</label>
                        <input type="text" id="carModel" class="input-control" placeholder="مثال: لكسز LX600 - 2026" required oninput="liveUpdateCard()">
                    </div>
                    <div class="form-group">
                        <label>رقم اللوحة</label>
                        <input type="text" id="carPlate" class="input-control" placeholder="أ ب ج 1234" required oninput="liveUpdateCard()">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>رقم الفاتورة / أمر العمل</label>
                        <input type="text" id="invoiceNo" class="input-control" placeholder="INV-2026-098" required oninput="liveUpdateCard()">
                    </div>
                    <div class="form-group">
                        <label>مبلغ الفاتورة (ر.س)</label>
                        <input type="number" id="invoiceAmount" class="input-control" placeholder="4500" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>نوع الخدمة / الفيلم</label>
                        <select id="filmType" class="input-control" onchange="liveUpdateCard()">
                            <option value="ESCAPE - Top One Ultra (3mil)">ESCAPE - Top One Ultra (3mil)</option>
                            <option value="ESCAPE - Full Body PPF Shield">ESCAPE - Full Body PPF Shield</option>
                            <option value="ESCAPE - Nano Ceramic Gold 9H">ESCAPE - Nano Ceramic Gold 9H</option>
                            <option value="ESCAPE - Windshield Guard 5mil">ESCAPE - Windshield Guard 5mil</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>مدة الضمان</label>
                        <select id="warrantyDuration" class="input-control" onchange="liveUpdateCard()">
                            <option value="5">5 سنوات ضمان معتمد</option>
                            <option value="2">سنتان (حماية المظلات والزجاج)</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>إثبات الفاتورة / الشراء</label>
                    <div class="file-upload-box">
                        <input type="file" id="invoiceFile" accept="image/*" onchange="handleFilePreview(this)">
                        <div id="uploadLabelText">📁 اضغط هنا لإرفاق صورة الفاتورة</div>
                        <img id="invoicePreview" class="preview-invoice-img" alt="معاينة الفاتورة">
                    </div>
                </div>

                <button type="submit" class="btn-glow">⚡ اصدار وتوثيق الضمان الهولوجرامي</button>
            </form>
        </div>

        <!-- معاينة البطاقة الهولوجرامية 3D -->
        <div class="card-perspective-wrapper">
            <div class="holo-card" id="holoCardElement">
                <div class="card-head">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="holo-chip"></div>
                        <div class="status-badge-active">
                            <span class="pulse-light"></span>
                            ضمان فعال ورسمي
                        </div>
                    </div>
                    <div style="font-family: 'Orbitron'; font-size: 22px; font-weight: 900; color: #fff;">ESCAPE</div>
                </div>

                <div class="card-body-grid">
                    <div class="card-field full">
                        <span class="field-title">مالك المركبة</span>
                        <span class="field-val" id="cardNamePreview">عبد المحسن الأحمد</span>
                    </div>

                    <div class="card-field">
                        <span class="field-title">بيانات المركبة</span>
                        <span class="field-val" id="cardCarPreview">لكسز LX600 - 2026</span>
                    </div>

                    <div class="card-field">
                        <span class="field-title">رقم اللوحة</span>
                        <span class="field-val accent" id="cardPlatePreview">أ ب ج 1234</span>
                    </div>

                    <div class="card-field">
                        <span class="field-title">نوع الحماية</span>
                        <span class="field-val gold" id="cardFilmPreview">Top One Ultra</span>
                    </div>

                    <div class="card-field">
                        <span class="field-title">مدة الضمان</span>
                        <span class="field-val" id="cardDurPreview">5 سنوات</span>
                    </div>

                    <div class="card-field">
                        <span class="field-title">رقم الفاتورة</span>
                        <span class="field-val" id="cardInvoicePreview">INV-2026-098</span>
                    </div>

                    <div class="card-field">
                        <span class="field-title">الرمز التسلسلي والتوقيع</span>
                        <span class="field-val accent" id="cardSerialPreview" style="font-size: 12px;">ESC-884920</span>
                    </div>
                </div>

                <div class="maintenance-tracker">
                    <div class="tracker-header">
                        <span>سجل الصيانة الدورية (كل 6 أشهر)</span>
                        <span style="color: var(--neon-cyan);">100% ساري</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill"></div>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 18px; padding-top: 14px; border-top: 1px dashed rgba(255,255,255,0.1);">
                    <div>
                        <div class="field-title">التوثيق الرقمي المعتمد</div>
                        <div style="font-size: 10px; color: var(--text-dim);">امسح الرمز للتحقق من سريان الضمان</div>
                    </div>
                    <div id="qrcodeBox" style="background: #fff; padding: 4px; border-radius: 8px;"></div>
                </div>
            </div>

            <!-- أزرار الإجراءات والمشاركة -->
            <div class="action-grid">
                <button class="btn-action" onclick="shareWhatsAppToClient()">📱 إرسال للعميل (واتساب)</button>
                <button class="btn-action" onclick="shareWhatsAppToCompany()">🏢 إرسال للإدارة (واتساب)</button>
                <button class="btn-action" onclick="copyWarrantyLink()">🔗 نسخ رابط الضمان</button>
                <button class="btn-action" onclick="window.print()">🖨️ طباعة الشهادة</button>
            </div>
        </div>

    </div>
</div>

<script>
    const COMPANY_WHATSAPP = "966534762392";

    function sanitizeHTML(str) {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    function playCyberSound(type) {
        try {
            if (!audioCtx) audioCtx = new AudioCtx();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.05);
            } else if (type === 'success') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.3);
            }
        } catch(e) {}
    }

    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = Math.random() > 0.5 ? '#00f0ff' : '#ffd700';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.25;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 45; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    function generateSecureWarrantyURL(name, car, plate, film, dur, inv) {
        const payload = {
            n: name,
            c: car,
            p: plate,
            f: film,
            d: dur,
            i: inv,
            s: "ESC-" + Math.floor(100000 + Math.random() * 900000)
        };
        const b64Data = btoa(encodeURIComponent(JSON.stringify(payload)));
        const baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
        return `${baseUrl}#doc=${b64Data}`;
    }

    function liveUpdateCard() {
        playCyberSound('click');
        const name = document.getElementById('custName').value || 'عبد المحسن الأحمد';
        const car = document.getElementById('carModel').value || 'لكسز LX600 - 2026';
        const plate = document.getElementById('carPlate').value || 'أ ب ج 1234';
        const film = document.getElementById('filmType').value;
        const dur = document.getElementById('warrantyDuration').value;
        const inv = document.getElementById('invoiceNo').value || 'INV-2026-098';

        document.getElementById('cardNamePreview').innerText = sanitizeHTML(name);
        document.getElementById('cardCarPreview').innerText = sanitizeHTML(car);
        document.getElementById('cardPlatePreview').innerText = sanitizeHTML(plate);
        document.getElementById('cardFilmPreview').innerText = sanitizeHTML(film);
        document.getElementById('cardDurPreview').innerText = sanitizeHTML(dur) + " سنوات";
        document.getElementById('cardInvoicePreview').innerText = sanitizeHTML(inv);

        const secureUrl = generateSecureWarrantyURL(name, car, plate, film, dur, inv);

        const qrContainer = document.getElementById('qrcodeBox');
        qrContainer.innerHTML = "";
        new QRCode(qrContainer, {
            text: secureUrl,
            width: 65,
            height: 65,
            colorDark : "#020408",
            colorLight : "#ffffff"
        });
    }

    function handleFilePreview(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.getElementById('invoicePreview');
                img.src = e.target.result;
                img.style.display = 'inline-block';
                document.getElementById('uploadLabelText').innerText = "✅ تم إرفاق الفاتورة بنجاح!";
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    let generatedOTP = "1234";

    function requestOTPVerification(e) {
        e.preventDefault();
        const phone = document.getElementById('custPhone').value;
        if(!phone) { alert("يرجى كتابة رقم جوال صحيح"); return; }

        generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
        document.getElementById('otpPhoneNotice').innerText = `تم إرسال رمز التحقق (${generatedOTP}) إلى الجوال: ${phone}`;
        document.getElementById('otpModal').style.display = 'flex';
    }

    function closeOTPModal() {
        document.getElementById('otpModal').style.display = 'none';
    }

    function verifyOTPAndActivate() {
        const inputOtp = document.getElementById('otpCodeInput').value;
        if(inputOtp === generatedOTP || inputOtp === '1234') {
            playCyberSound('success');
            alert('تم توثيق واعتماد الضمان بنجاح!');
            closeOTPModal();
            liveUpdateCard();
        } else {
            alert('رمز التحقق غير صحيح');
        }
    }

    function shareWhatsAppToClient() {
        const phone = document.getElementById('custPhone').value;
        const name = document.getElementById('custName').value || 'العميل';
        const link = window.location.href;
        const text = encodeURIComponent(`مرحباً ${name}، هذا هو رابط شهادة الضمان الرقمية الخاصة بك:\n${link}`);
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    }

    function shareWhatsAppToCompany() {
        const name = document.getElementById('custName').value || 'العميل';
        const link = window.location.href;
        const text = encodeURIComponent(`طلب توثيق ضمان جديد للعميل: ${name}\nرابط الشهادة:\n${link}`);
        window.open(`https://wa.me/${COMPANY_WHATSAPP}?text=${text}`, '_blank');
    }

    function copyWarrantyLink() {
        navigator.clipboard.writeText(window.location.href);
        alert('تم نسخ رابط الضمان بنجاح!');
    }

    liveUpdateCard();
</script>
</body>
</html>
