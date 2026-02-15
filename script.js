 /**
 * ISKAR - Ramadan Application 2026
 * Developed by: ISKAR (Sameh Elnady)
 */

let count = 0;
let audioCtx;
window.lastAzanTime = "";

// 1. وظائف السبحة
function addCount() {
    count++;
    document.getElementById('counter').innerText = count;
    
    // تشغيل الاهتزاز
    if(document.getElementById('vibrateToggle').checked && navigator.vibrate) {
        navigator.vibrate(50);
    }

    // تفعيل الصوت عند اللمس (تكة)
    if(document.getElementById('soundToggle').checked) {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    }
}

function resetCounter() { count = 0; document.getElementById('counter').innerText = 0; }
function setZekr(z) { document.getElementById('zekrName').innerText = z; resetCounter(); }

// 2. وظائف الأذان والوقت
async function getPrayerTimes() {
    const r = document.getElementById('regionSelect').value;
    const s = document.getElementById('citySelect');
    const city = s.value;
    const country = r === "Egypt" ? "Egypt" : s.options[s.selectedIndex].getAttribute("data-country");
    const tb = document.getElementById('tableBody');
    tb.innerHTML = "<tr><td colspan='2'>جاري التحميل...</td></tr>";
    
    try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=4`);
        const d = await res.json();
        const t = d.data.timings;
        const pAr = {"Fajr":"الفجر","Sunrise":"الشروق","Dhuhr":"الظهر","Asr":"العصر","Maghrib":"المغرب","Isha":"العشاء"};
        tb.innerHTML = "";
        for(let k in pAr) {
            tb.innerHTML += `<tr><td style="color:gold">${pAr[k]}</td><td class="time-cell">${t[k]}</td></tr>`;
        }
    } catch(e) { tb.innerHTML = "<tr><td colspan='2'>خطأ في الاتصال</td></tr>"; }
}

function playAzan() {
    const azanFiles = ["Egypt.mp3", "Egypt_1.mp3", "Egypt_2.mp3", "Egypt_3.mp3"];
    const randomAzan = azanFiles[Math.floor(Math.random() * azanFiles.length)];
    const audio = new Audio(randomAzan);
    audio.play().catch(() => console.log("المس الشاشة أولاً لتفعيل الصوت"));
}

function monitorTime() {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    const cells = document.querySelectorAll(".time-cell");
    cells.forEach(cell => {
        if (cell.innerText.trim() === currentTime && window.lastAzanTime !== currentTime) {
            playAzan();
            window.lastAzanTime = currentTime;
        }
    });
}
setInterval(monitorTime, 30000);

// 3. التحكم في الواجهة
function showPage(p) {
    document.getElementById('subhaPage').style.display = p==='subha'?'block':'none';
    document.getElementById('prayerPage').style.display = p==='prayer'?'block':'none';
    document.getElementById('navSubha').className = p==='subha'?'active':'';
    document.getElementById('navPrayer').className = p==='prayer'?'active':'';
}

function updateCityList() {
    const r = document.getElementById('regionSelect').value;
    const s = document.getElementById('citySelect');
    s.innerHTML = "";
    const egyptCities = [{n:"القاهرة",v:"Cairo"},{n:"الإسكندرية",v:"Alexandria"},{n:"المنصورة",v:"Mansoura"}];
    const worldCapitals = [{n:"مكة المكرمة",v:"Mecca",c:"Saudi Arabia"},{n:"القدس",v:"Jerusalem",c:"Palestine"}];
    const list = r === "Egypt" ? egyptCities : worldCapitals;
    list.forEach(c => {
        let o = document.createElement("option"); o.value=c.v; o.text=c.n;
        if(c.c) o.setAttribute("data-country", c.c);
        s.appendChild(o);
    });
    getPrayerTimes();
}

window.onload = () => {
    updateCityList();
    console.log("Application Ready!");
};
