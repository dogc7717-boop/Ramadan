let count = 0;
window.lastAzanTime = "";

// بصمة ISKAR
console.log("%cDeveloped by ISKAR", "color:gold; font-size:20px; font-weight:bold;");

// --- وظيفة التسبيح ---
function addCount() { 
    count++; 
    document.getElementById('counter').innerText = count; 
    
    // اهتزاز
    if(navigator.vibrate) navigator.vibrate(40); 

    // تشغيل صوت التكة (نظام)
    let context = new (window.AudioContext || window.webkitAudioContext)();
    let osc = context.createOscillator();
    let gain = context.createGain();
    osc.connect(gain);
    gain.connect(context.destination);
    osc.frequency.value = 1000;
    gain.gain.setValueAtTime(0.1, context.currentTime);
    osc.start();
    osc.stop(context.currentTime + 0.05);
}

// --- وظيفة تشغيل الأذان ---
function playAzan() {
    // نجرب تشغيل "مصر.mp3" كاختبار أساسي
    const audio = new Audio("مصر.mp3");
    
    audio.play()
    .then(() => console.log("الأذان يعمل الآن"))
    .catch(err => {
        alert("المتصفح يمنع الصوت. اضغط في أي مكان في الصفحة أولاً ليتفعل الأذان.");
        console.error("خطأ في تشغيل الصوت:", err);
    });
}

// زر تجربة الصوت
function testAzanSound() {
    playAzan();
}

// --- مراقبة الوقت ---
function monitor() {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + 
                        now.getMinutes().toString().padStart(2, '0');

    // قراءة كل خانات الجدول
    const cells = document.querySelectorAll("td");
    cells.forEach(cell => {
        if (cell.innerText.trim() === currentTime) {
            if (window.lastAzanTime !== currentTime) {
                playAzan();
                window.lastAzanTime = currentTime;
            }
        }
    });
}
setInterval(monitor, 10000); // يفحص كل 10 ثواني لضمان الدقة

function showPage(p) {
    document.getElementById('subhaPage').style.display = p === 'subha' ? 'block' : 'none';
    document.getElementById('prayerPage').style.display = p === 'prayer' ? 'block' : 'none';
                  }
