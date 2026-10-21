'use strict';
const bcrypt=require('bcryptjs');
const tty=process.stdin.isTTY;
if(!tty){console.error('Run this script in an interactive terminal.');process.exit(1)}
process.stdout.write('Enter a strong admin password (hidden): ');
let password='';process.stdin.setRawMode(true);process.stdin.resume();process.stdin.setEncoding('utf8');
process.stdin.on('data',c=>{if(c==='\u0003'){process.stdout.write('\n');process.exit(1)}if(c==='\r'||c==='\n'){process.stdin.setRawMode(false);process.stdin.pause();process.stdout.write('\n');if(password.length<14){console.error('Use at least 14 characters.');process.exitCode=1;return}console.log('ADMIN_PASSWORD_HASH='+bcrypt.hashSync(password,12));password='';return}if(c==='\u007f')password=password.slice(0,-1);else password+=c});
