let count = 0;
let isSound = true;
let isVibrate = true;
let lastAzan = "";
const azanAudios = {
    azan1: new Audio('https://www.islamcan.com/audio/adan/azan1.mp3'),
    azan2: new Audio('https://www.islamcan.com/audio/adan/azan2.mp3'),
    azan3: new Audio('https://www.islamcan.com/audio/adan/azan3.mp3')
};

// 1. نظام المسبحة والسجل
function increment() {
    count++;
    document.getElementById('mainCounter').innerText = count;
    if (isSound) new Audio('https://www.soundjay.com/buttons/button-16.mp3').play().catch(()=>{});
    if (isVibrate && navigator.vibrate) navigator.vibrate(50);
    
    if (count % 33 === 0) {
        let thikr = document.getElementById('thikrSelect').value;
        let logList = document.getElementById('logList');
        let li = document.createElement('li');
        li.innerText = `✔️ ${thikr}: تم إكمال 33 (${new Date().toLocaleTimeString('ar-EG')})`;
        logList.prepend(li);
    }
}

function resetCounter() {
    count = 0;
    document.getElementById('mainCounter').innerText = count;
}

function toggleSound() { isSound = !isSound; document.getElementById('soundToggle').innerText = isSound ? "🔊 صوت" : "🔇 صامت"; }
function toggleVibrate() { isVibrate = !isVibrate; document.getElementById('vibrateToggle').innerText = isVibrate ? "📳 اهتزاز" : "📵 إيقاف"; }

// 2. مواقيت الصلاة والأوفلاين
async function updatePrayerTimes() {
    const country = document.getElementById('countrySelect').value;
    const API = `https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=${country}&method=5`;
    
    try {
        const res = await fetch(API);
        const data = await res.json();
        const timings = data.data.timings;
        localStorage.setItem("prayer_timings", JSON.stringify(timings));
        displayTimings(timings);
    } catch (e) {
        const saved = localStorage.getItem("prayer_timings");
        if (saved) displayTimings(JSON.parse(saved));
    }
}

function displayTimings(t) {
    const names = { Fajr: "الفجر", Dhuhr: "الظهر", Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء" };
    let h = "";
    for (let k in names) {
        h += `<div class="prayer-row"><span>${names[k]}</span><strong>${t[k].split(' ')[0]}</strong></div>`;
    }
    document.getElementById('prayer-table').innerHTML = h;
}

// 3. نظام الأذان
function testAzan() {
    const v = document.getElementById('azanVoice').value;
    azanAudios[v].play();
    setTimeout(() => { azanAudios[v].pause(); azanAudios[v].currentTime = 0; }, 5000);
}

setInterval(() => {
    const saved = localStorage.getItem("prayer_timings");
    if (!saved) return;
    const t = JSON.parse(saved);
    const now = new Date();
    const cur = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    
    ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].forEach(p => {
        if (t[p].split(' ')[0] === cur && lastAzan !== p) {
            const v = document.getElementById('azanVoice').value;
            azanAudios[v].play();
            lastAzan = p;
        }
    });
}, 60000);

async function setupAppPermissions() {
    document.getElementById('permission-overlay').style.display = 'none';
    updatePrayerTimes();
}

window.onload = () => {
    const saved = localStorage.getItem("prayer_timings");
    if (saved) displayTimings(JSON.parse(saved));
};
