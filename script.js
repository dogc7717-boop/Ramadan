let count = 0;
window.lastAzanTime = "";

// بصمة ISKAR
console.log("%cDeveloped by ISKAR", "color:gold; font-size:20px; font-weight:bold;");

// 1. وظيفة التسبيح (إصلاح الكود ليعمل على الموبايل)
function addCount() { 
    count++; 
    const counterDisplay = document.getElementById('counter');
    if(counterDisplay) counterDisplay.innerText = count; 
    
    // اهتزاز الموبايل
    if(navigator.vibrate) navigator.vibrate(40); 

    // صوت تكة (تم إصلاح المتغير context ليصبح audioCtx)
    try {
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 1000;
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } catch(e) { console.log("الصوت يحتاج لمسة"); }
}

// 2. وظيفة تشغيل الأذان (تعديل الأسماء لتطابق الصورة)
function playAzan() {
    // الأسماء هنا مطابقة تماماً للصورة التي أرسلتها
    const azanFiles = ["اذان مصر.mp3", "اذان مصر 1.mp3", "اذان مصر 2.mp3", "اذان مصر 3.mp3"];
    
    // نختار صوت عشوائي أو الأول
    const randomAzan = azanFiles[Math.floor(Math.random() * azanFiles.length)];
    const audio = new Audio(randomAzan);
    
    audio.play().catch(err => {
        console.log("المتصفح يطلب لمسة شاشة أولاً");
    });
}

// 3. مراقبة الوقت
function monitorTimes() {
    const now = new Date();
    const hr = now.getHours().toString().padStart(2, '0');
    const min = now.getMinutes().toString().padStart(2, '0');
    const currentTime = hr + ":" + min;

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

// فحص كل 15 ثانية
setInterval(monitorTimes, 15000);

// 4. وظائف التنقل
function showPage(p) {
    const subha = document.getElementById('subhaPage');
    const prayer = document.getElementById('prayerPage');
    if(subha && prayer) {
        subha.style.display = (p === 'subha') ? 'block' : 'none';
        prayer.style.display = (p === 'prayer') ? 'block' : 'none';
    }
}

function resetCounter() { 
    count = 0; 
    document.getElementById('counter').innerText = 0; 
        }
