/**
 * ISKAR - Ramadan Application 2026
 * Developed by: ISKAR (Sameh Elnady)
 */

let count = 0;
let deferredPrompt;
let adhanPreviewAudio = new Audio();

const azkarData = {
    sabah: ["أصبحنا وأصبح الملك لله والحمد لله", "يا حي يا قيوم برحمتك أستغيث", "اللهم أنت ربي لا إله إلا أنت", "سبحان الله وبحمده عدد خلقه"],
    massa: ["أمسين وأمسى الملك لله والحمد لله", "أعوذ بكلمات الله التامات من شر ما خلق", "اللهم بك أمسينا وبك أصبحنا", "اللهم عالم الغيب والشهادة"],
    random: [
        "سبحان الله وبحمده، سبحان الله العظيم",
        "اللهم صلِ وسلم على نبينا محمد",
        "أستغفر الله العظيم وأتوب إليه",
        "لا حول ولا قوة إلا بالله العلي العظيم",
        "لا إله إلا الله وحده لا شريك له"
    ]
};

// --- التنقل بين الصفحات ---
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
    if(document.getElementById('vibrateToggle').checked && navigator.vibrate) navigator.vibrate(50);
    if(document.getElementById('soundToggle').checked) {
        let audio = new Audio('https://assets.mixkit.co/active_storage/sfx/3005/3005-preview.mp3');
        audio.volume = 0.2;
        audio.play().catch(()=>{});
    }
}
function resetCounter() { count = 0; document.getElementById('counter').innerText = 0; }

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
    if (Notification.permission === "granted") new Notification("✨ تذكير بالذكر", { body: rand });
}

function closeAzkarWindow() { document.getElementById('azkarOverlay').style.display = 'none'; }

// --- المواقيت والأذان ---
async function getPrayerTimes() {
    const city = document.getElementById('citySelect').value;
    const tableDiv = document.getElementById('prayerTable');
    tableDiv.innerHTML = "<p style='text-align:center'>جاري التحديث...</p>";
    
    let country = "Egypt";
    const countryMap = { 
        "Mecca":"Saudi Arabia", "Medina":"Saudi Arabia", "Dubai":"UAE", 
        "Jerusalem":"Palestine", "Paris":"France", "Madrid":"Spain", 
        "Rome":"Italy", "New York":"USA" 
    };
    if(countryMap[city]) country = countryMap[city];

    try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=4`);
        const data = await res.json();
        const t = data.data.timings;
        window.currentTimings = t;

        tableDiv.innerHTML = `
            <table>
                <tr class="highlight"><td>🕒 الإمساك</td><td>${t.Imsak}</td></tr>
                <tr><td>الفجر</td><td>${t.Fajr}</td></tr>
                <tr><td>الظهر</td><td>${t.Dhuhr}</td></tr>
                <tr><td>العصر</td><td>${t.Asr}</td></tr>
                <tr class="highlight"><td>🌅 المغرب</td><td>${t.Maghrib}</td></tr>
                <tr><td>العشاء</td><td>${t.Isha}</td></tr>
            </table>`;
    } catch(e) { tableDiv.innerHTML = "<p style='color:red'>خطأ في تحميل المواقيت</p>"; }
}

// --- إعدادات الأذان (تم تصحيح المسارات) ---
function saveAdhanPreference() {
    localStorage.setItem('userAdhanChoice', document.getElementById('adhanSelect').value);
}

function playAdhanPreview() {
    const selectedFile = document.getElementById('adhanSelect').value;
    // إضافة ./ للتأكد من البحث في المجلد الحالي
    adhanPreviewAudio.src = "./" + selectedFile; 
    adhanPreviewAudio.load(); // إعادة تحميل الملف
    adhanPreviewAudio.play().catch((err) => {
        console.error("خطأ في تشغيل الصوت:", err);
        alert("تعذر تشغيل الملف: " + selectedFile + "\nتأكد من الضغط على الشاشة أولاً لتفعيل الصوت.");
    });
}

function stopAdhanPreview() {
    adhanPreviewAudio.pause();
    adhanPreviewAudio.currentTime = 0;
}

function checkPrayerTime() {
    if (!window.currentTimings) return;
    const now = new Date();
    const timeNow = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    
    prayerNames.forEach(p => {
        if (window.currentTimings[p] === timeNow && now.getSeconds() === 0) {
            const voice = localStorage.getItem('userAdhanChoice') || 'Egypt.mp3';
            const audio = new Audio("./" + voice);
            audio.play().catch(e => console.log("الأذان التلقائي يحتاج تفاعل مع الصفحة"));
        }
    });
}

// --- التشغيل ---
setInterval(checkPrayerTime, 1000);
setInterval(() => {
    const now = new Date();
    if (now.getMinutes() === 0 && now.getSeconds() < 2) showPopUp();
}, 1000);

window.onload = () => {
    getPrayerTimes();
    if ("Notification" in window) Notification.requestPermission();
    
    const savedVoice = localStorage.getItem('userAdhanChoice');
    if(savedVoice) document.getElementById('adhanSelect').value = savedVoice;

    const autoState = localStorage.getItem('autoAzkar');
    if (autoState !== null) document.getElementById('autoAzkarToggle').checked = (autoState === 'true');

    document.getElementById('autoAzkarToggle').addEventListener('change', (e) => {
        localStorage.setItem('autoAzkar', e.target.checked);
    });
};

// PWA
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });
document.getElementById('installBtn').onclick = () => {
    if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; }
};
