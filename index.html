/**
 * ISKAR - Ramadan Application 2026
 * Developed by: ISKAR (Sameh Elnady)
 */

let count = 0, subhanCount = 0, alhamdCount = 0, akbarCount = 0;
let deferredPrompt;
let adhanPreviewAudio = new Audio();

const azkarData = {
    sabah: ["أصبحنا وأصبح الملك لله والحمد لله", "يا حي يا قيوم برحمتك أستغيث", "اللهم أنت ربي لا إله إلا أنت", "سبحان الله وبحمده عدد خلقه"],
    massa: ["أمسين وأمسى الملك لله والحمد لله", "أعوذ بكلمات الله التامات من شر ما خلق", "اللهم بك أمسينا وبك أصبحنا", "اللهم عالم الغيب والشهادة"],
    random: ["سبحان الله وبحمده", "اللهم صلِ وسلم على نبينا محمد", "أستغفر الله العظيم", "لا حول ولا قوة إلا بالله", "لا إله إلا الله"]
};

function showPage(p) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.querySelectorAll('nav span').forEach(s => s.classList.remove('active'));
    document.getElementById(p + 'Page').style.display = 'block';
    document.getElementById('nav' + p.charAt(0).toUpperCase() + p.slice(1)).classList.add('active');
    if(p === 'azkar') loadAzkar();
}

// --- المسبحة ---
function addCount() {
    count++;
    document.getElementById('counter').innerText = count;
    triggerFeedback();
}

function specificZekr(type) {
    if(type === 'subhan') { subhanCount++; document.getElementById('subhanCount').innerText = subhanCount; document.getElementById('currentZekr').innerText = "سبحان الله"; }
    else if(type === 'alhamd') { alhamdCount++; document.getElementById('alhamdCount').innerText = alhamdCount; document.getElementById('currentZekr').innerText = "الحمد لله"; }
    else if(type === 'akbar') { akbarCount++; document.getElementById('akbarCount').innerText = akbarCount; document.getElementById('currentZekr').innerText = "الله أكبر"; }
    count++; document.getElementById('counter').innerText = count;
    triggerFeedback();
}

function triggerFeedback() {
    if(document.getElementById('vibrateToggle').checked && navigator.vibrate) navigator.vibrate(50);
    if(document.getElementById('soundToggle').checked) {
        let audio = new Audio('https://assets.mixkit.co/active_storage/sfx/3005/3005-preview.mp3');
        audio.volume = 0.2; audio.play().catch(()=>{});
    }
}

function resetAllCounters() {
    if(confirm("تصفير الكل؟")) {
        count = 0; subhanCount = 0; alhamdCount = 0; akbarCount = 0;
        ['counter','subhanCount','alhamdCount','akbarCount'].forEach(id => document.getElementById(id).innerText = 0);
        document.getElementById('currentZekr').innerText = "انقر للبدء";
    }
}

// --- الأذكار ---
function loadAzkar() {
    const h = new Date().getHours();
    const isMorning = (h >= 5 && h < 12);
    document.getElementById('azkarTitle').innerText = isMorning ? "☀️ أذكار الصباح" : "🌙 أذكار المساء";
    let html = "";
    const list = isMorning ? azkarData.sabah : azkarData.massa;
    list.forEach(z => { html += `<div class="zekr-card">${z}</div>`; });
    document.getElementById('azkarListContainer').innerHTML = html;
}

function showPopUp() {
    if (!document.getElementById('autoAzkarToggle').checked) return;
    const rand = azkarData.random[Math.floor(Math.random() * azkarData.random.length)];
    document.getElementById('azkarPopText').innerText = rand;
    document.getElementById('azkarOverlay').style.display = 'flex';
}

function closeAzkarWindow() { document.getElementById('azkarOverlay').style.display = 'none'; }

// --- المواقيت والأذان ---
async function getPrayerTimes() {
    const city = document.getElementById('citySelect').value;
    const tableDiv = document.getElementById('prayerTable');
    tableDiv.innerHTML = "<p style='text-align:center'>جاري التحديث...</p>";
    let country = "Egypt";
    const countryMap = { "Mecca":"Saudi Arabia", "Medina":"Saudi Arabia", "Dubai":"UAE", "Jerusalem":"Palestine", "Paris":"France", "Madrid":"Spain", "Rome":"Italy", "New York":"USA" };
    if(countryMap[city]) country = countryMap[city];

    try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=4`);
        const data = await res.json();
        const t = data.data.timings;
        window.currentTimings = t;
        tableDiv.innerHTML = `<table>
            <tr class="highlight"><td>🕒 الإمساك</td><td>${t.Imsak}</td></tr>
            <tr><td>الفجر</td><td>${t.Fajr}</td></tr><tr><td>الظهر</td><td>${t.Dhuhr}</td></tr>
            <tr><td>العصر</td><td>${t.Asr}</td></tr><tr class="highlight"><td>🌅 المغرب</td><td>${t.Maghrib}</td></tr>
            <tr><td>العشاء</td><td>${t.Isha}</td></tr></table>`;
    } catch(e) { tableDiv.innerHTML = "<p style='color:red'>خطأ في التحميل</p>"; }
}

function saveAdhanPreference() { localStorage.setItem('userAdhanChoice', document.getElementById('adhanSelect').value); }

function playAdhanPreview() {
    adhanPreviewAudio.src = "./" + document.getElementById('adhanSelect').value;
    adhanPreviewAudio.play().catch(() => alert("تأكد من وجود الملفات واضغط على الشاشة أولاً"));
}

function stopAdhanPreview() { adhanPreviewAudio.pause(); adhanPreviewAudio.currentTime = 0; }

function checkPrayerTime() {
    if (!window.currentTimings) return;
    const now = new Date();
    const timeNow = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].forEach(p => {
        if (window.currentTimings[p] === timeNow && now.getSeconds() === 0) {
            new Audio("./" + (localStorage.getItem('userAdhanChoice') || 'Egypt.mp3')).play().catch(()=>{});
        }
    });
}

setInterval(checkPrayerTime, 1000);
setInterval(() => { if (new Date().getMinutes() === 0 && new Date().getSeconds() < 2) showPopUp(); }, 1000);

window.onload = () => {
    getPrayerTimes();
    const savedVoice = localStorage.getItem('userAdhanChoice');
    if(savedVoice) document.getElementById('adhanSelect').value = savedVoice;
    setTimeout(showPopUp, 3000);
};

// PWA
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });
document.getElementById('installBtn').onclick = () => { if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; } };
