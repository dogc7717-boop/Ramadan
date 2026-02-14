let count = 0;
window.lastAzanTime = "";

// بصمة ISKAR
console.log("%cDeveloped by ISKAR", "color:gold; font-size:20px; font-weight:bold;");

// 1. وظيفة التسبيح (تكة واهتزاز) - تم تبسيطها جداً للموبايل
function addCount() { 
    count++; 
    const counterDisplay = document.getElementById('counter');
    if(counterDisplay) counterDisplay.innerText = count; 
    
    // اهتزاز الموبايل
    if(navigator.vibrate) navigator.vibrate(40); 

    // صوت تكة بسيط جداً
    try {
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(context.destination);
        osc.frequency.value = 1000;
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } catch(e) {}
}

// 2. وظيفة تشغيل الأذان
function playAzan() {
    // جرب تشغيل الملف الأول مباشرة
    const audio = new Audio("مصر.mp3");
    audio.play().catch(err => {
        console.log("المتصفح يطلب لمسة شاشة أولاً");
    });
}

// 3. مراقبة الوقت (البحث في كل خلايا الجدول)
function monitorTimes() {
    const now = new Date();
    // الحصول على الوقت الحالي مثل 15:30
    const hr = now.getHours().toString().padStart(2, '0');
    const min = now.getMinutes().toString().padStart(2, '0');
    const currentTime = hr + ":" + min;

    // البحث عن أي خلية في الجدول تحتوي على هذا الوقت
    const allCells = document.getElementsByTagName('td');
    for (let i = 0; i < allCells.length; i++) {
        if (allCells[i].innerText.trim() === currentTime) {
            if (window.lastAzanTime !== currentTime) {
                playAzan();
                window.lastAzanTime = currentTime;
                break; 
            }
        }
    }
}

// تشغيل الفحص كل 10 ثوانٍ
setInterval(monitorTimes, 10000);

// 4. وظائف التنقل
function showPage(p) {
    if(p === 'subha') {
        document.getElementById('subhaPage').style.display = 'block';
        document.getElementById('prayerPage').style.display = 'none';
    } else {
        document.getElementById('subhaPage').style.display = 'none';
        document.getElementById('prayerPage').style.display = 'block';
    }
}

function resetCounter() { 
    count = 0; 
    document.getElementById('counter').innerText = 0; 
        }
