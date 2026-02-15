/**
 * ISKAR - Ramadan Application 2026
 * Developed by: ISKAR
 */

let count = 0;
window.lastAzanTime = "";
let audioCtx; 

console.log("%cDeveloped by ISKAR", "color:gold; font-size:25px; font-weight:bold; text-shadow: 2px 2px 5px black;");

// 1. وظيفة التسبيح (تكة + اهتزاز)
function addCount() { 
    count++; 
    const counterDisplay = document.getElementById('counter');
    if(counterDisplay) counterDisplay.innerText = count; 
    
    if(navigator.vibrate) navigator.vibrate(40); 

    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    try {
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } catch(e) {
        console.log("Audio Error: " + e);
    }
}

// 2. وظيفة الأذان (مطابقة لأسماء الملفات الجديدة بالإنجليزية)
function playAzan() {
    const azanFiles = ["Egypt.mp3", "Egypt_1.mp3", "Egypt_2.mp3", "Egypt_3.mp3"];
    const randomAzan = azanFiles[Math.floor(Math.random() * azanFiles.length)];
    const audio = new Audio(randomAzan);
    
    audio.play().then(() => {
        console.log("تم تشغيل الأذان بنجاح: " + randomAzan);
    }).catch(err => {
        console.log("المتصفح يمنع الصوت التلقائي، المس الشاشة (سبح) أولاً.");
    });
}

// 3. مراقبة الوقت ومقارنته بجدول المواعيد
function monitorPrayerTimes() {
    const now = new Date();
    const hr = now.getHours().toString().padStart(2, '0');
    const min = now.getMinutes().toString().padStart(2, '0');
    const currentTime = hr + ":" + min;

    const timeCells = document.querySelectorAll("td[contenteditable='true']");
    timeCells.forEach(cell => {
        const prayerTime = cell.innerText.trim();
        if (prayerTime === currentTime) {
            if (window.lastAzanTime !== currentTime) {
                playAzan();
                window.lastAzanTime = currentTime;
                console.log("حان الآن موعد الأذان: " + currentTime);
            }
        }
    });
}

setInterval(monitorPrayerTimes, 20000);

// 4. وظائف التنقل بين الصفحات
function showPage(pageId) {
    const subhaPage = document.getElementById('subhaPage');
    const prayerPage = document.getElementById('prayerPage');
    
    if (pageId === 'subha') {
        if(subhaPage) subhaPage.style.display = 'block';
        if(prayerPage) prayerPage.style.display = 'none';
    } else {
        if(subhaPage) subhaPage.style.display = 'none';
        if(prayerPage) prayerPage.style.display = 'block';
    }
}

function resetCounter() { 
    count = 0; 
    const counterDisplay = document.getElementById('counter');
    if(counterDisplay) counterDisplay.innerText = 0; 
}

document.addEventListener('contextmenu', e => e.preventDefault());

window.onload = function() {
    console.log("ISKAR Application is ready!");
};
