let count = parseInt(localStorage.getItem('count')) || 0;
let subhanCount = parseInt(localStorage.getItem('subhanCount')) || 0;
let alhamdCount = parseInt(localStorage.getItem('alhamdCount')) || 0;
let akbarCount = parseInt(localStorage.getItem('akbarCount')) || 0;

let deferredPrompt;
let adhanPreviewAudio = new Audio();

const azkarData = {
    sabah: ["أصبحنا وأصبح الملك لله والحمد لله", "يا حي يا قيوم برحمتك أستغيث", "اللهم أنت ربي لا إله إلا أنت", "سبحان الله وبحمده عدد خلقه"],
    massa: ["أمسين وأمسى الملك لله والحمد لله", "أعوذ بكلمات الله التامات من شر ما خلق", "اللهم بك أمسينا وبك أصبحنا", "اللهم عالم الغيب والشهادة"],
    random: ["سبحان الله وبحمده", "اللهم صلِ وسلم على نبينا محمد", "أستغفر الله العظيم", "لا حول ولا قوة إلا بالله"]
};

// تحديث العدادات عند التحميل
window.onload = () => {
    document.getElementById('counter').innerText = count;
    document.getElementById('subhanCount').innerText = subhanCount;
    document.getElementById('alhamdCount').innerText = alhamdCount;
    document.getElementById('akbarCount').innerText = akbarCount;
    getPrayerTimes();
};

function showPage(p) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.querySelectorAll('nav span').forEach(s => s.classList.remove('active'));
    document.getElementById(p + 'Page').style.display = 'block';
    document.getElementById('nav' + p.charAt(0).toUpperCase() + p.slice(1)).classList.add('active');
    if(p === 'azkar') loadAzkar();
}

function addCount() {
    count++;
    updateDisplay();
    triggerFeedback();
}

function specificZekr(type) {
    if(type === 'subhan') { subhanCount++; document.getElementById('currentZekr').innerText = "سبحان الله"; }
    else if(type === 'alhamd') { alhamdCount++; document.getElementById('currentZekr').innerText = "الحمد لله"; }
    else if(type === 'akbar') { akbarCount++; document.getElementById('currentZekr').innerText = "الله أكبر"; }
    count++;
    updateDisplay();
    triggerFeedback();
}

function updateDisplay() {
    document.getElementById('counter').innerText = count;
    document.getElementById('subhanCount').innerText = subhanCount;
    document.getElementById('alhamdCount').innerText = alhamdCount;
    document.getElementById('akbarCount').innerText = akbarCount;
    // حفظ البيانات
    localStorage.setItem('count', count);
    localStorage.setItem('subhanCount', subhanCount);
    localStorage.setItem('alhamdCount', alhamdCount);
    localStorage.setItem('akbarCount', akbarCount);
}

function triggerFeedback() {
    if(document.getElementById('vibrateToggle').checked && navigator.vibrate) navigator.vibrate(50);
    if(document.getElementById('soundToggle').checked) {
        let audio = new Audio('https://assets.mixkit.co/active_storage/sfx/3005/3005-preview.mp3');
        audio.volume = 0.2; audio.play().catch(()=>{});
    }
}

function resetAllCounters() {
    if(confirm("هل تريد تصفير جميع العدادات؟")) {
        count = 0; subhanCount = 0; alhamdCount = 0; akbarCount = 0;
        updateDisplay();
        localStorage.clear();
    }
}

async function getPrayerTimes() {
    const city = document.getElementById('citySelect').value;
    const tableDiv = document.getElementById('prayerTable');
    tableDiv.innerHTML = "<p style='text-align:center'>جاري التحديث...</p>";
    try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Egypt&method=4`);
        const data = await res.json();
        const t = data.data.timings;
        tableDiv.innerHTML = `<table>
            <tr class="highlight"><td>🕒 الإمساك</td><td>${t.Imsak}</td></tr>
            <tr><td>الفجر</td><td>${t.Fajr}</td></tr>
            <tr><td>الظهر</td><td>${t.Dhuhr}</td></tr>
            <tr><td>العصر</td><td>${t.Asr}</td></tr>
            <tr class="highlight"><td>🌅 المغرب</td><td>${t.Maghrib}</td></tr>
            <tr><td>العشاء</td><td>${t.Isha}</td></tr></table>`;
    } catch(e) { tableDiv.innerHTML = "<p style='color:red'>خطأ في اتصال الإنترنت</p>"; }
}

function loadAzkar() {
    const h = new Date().getHours();
    const isMorning = (h >= 5 && h < 12);
    document.getElementById('azkarTitle').innerText = isMorning ? "☀️ أذكار الصباح" : "🌙 أذكار المساء";
    let html = "";
    const list = isMorning ? azkarData.sabah : azkarData.massa;
    list.forEach(z => { html += `<div class="zekr-card">${z}</div>`; });
    document.getElementById('azkarListContainer').innerHTML = html;
}

function closeAzkarWindow() { document.getElementById('azkarOverlay').style.display = 'none'; }

// PWA Installation Logic
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installBtn').style.display = 'block';
});

document.getElementById('installBtn').onclick = () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt = null;
        document.getElementById('installBtn').style.display = 'none';
    }
};
