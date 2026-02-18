/**
 * ISKAR - Ramadan Application 2026
 * Developed by: ISKAR (Sameh Elnady)
 * Modified for: Auto Azan & Notifications
 */

let count = 0;
let audioCtx;
let currentAzanAudio = null;
let deferredPrompt;
window.lastAzanTime = "";

const installBtn = document.getElementById('installBtn');
const loadingModal = document.getElementById('loadingModal');
const notifModal = document.getElementById('notifModal');

// --- 1. نظام التثبيت (PWA) ---
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

// --- 2. نظام الإشعارات والنافذة المنبثقة ---
async function checkNotificationPermission() {
    if (!("Notification" in window)) return;
    
    // إذا لم يسبق للمستخدم تحديد رأيه، أظهر النافذة المنبثقة الجميلة
    if (Notification.permission === "default") {
        setTimeout(() => {
            notifModal.style.display = 'flex';
        }, 3000); // تظهر بعد 3 ثواني من دخول التطبيق
    }
}

async function enableNotifications() {
    const permission = await Notification.requestPermission();
    notifModal.style.display = 'none';
    if (permission === "granted") {
        new Notification("تم تفعيل الأذان!", {
            body: "سيقوم التطبيق بتنبيهك عند كل صلاة بإذن الله.",
            icon: "logo.png"
        });
    }
}

// إرسال إشعار عند موعد الصلاة
function sendPrayerNotification(prayerName) {
    if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(`حان الآن موعد أذان ${prayerName}`, {
                body: "حي على الصلاة.. حي على الفلاح",
                icon: "logo.png",
                vibrate: [200, 100, 200],
                tag: 'azan-notification'
            });
        });
    }
}

// --- 3. وظائف التسبيح ---
function addCount() {
    count++;
    document.getElementById('counter').innerText = count;
    if(document.getElementById('vibrateToggle').checked && navigator.vibrate) {
        navigator.vibrate(40);
    }
    if(document.getElementById('soundToggle').checked) {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
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
        } catch(e) { console.log("Audio Error"); }
    }
}

function resetCounter() { count = 0; document.getElementById('counter').innerText = 0; }
function setZekr(z) { document.getElementById('zekrName').innerText = z; resetCounter(); }

// --- 4. جلب المواقيت ونظام الأذان التلقائي ---
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
    const btn = document.getElementById('playBtn');
    const selectedFile = document.getElementById('moazenSelect').value;
    if (currentAzanAudio && !currentAzanAudio.paused) {
        currentAzanAudio.pause();
        currentAzanAudio.currentTime = 0;
        if(btn) btn.innerText = "▶️ تجربة الأذان";
        return;
    }
    currentAzanAudio = new Audio(selectedFile);
    if(btn) btn.innerText = "⏳ جاري التحميل...";
    currentAzanAudio.play().then(() => {
        if(btn) btn.innerText = "⏸️ إيقاف الأذان";
    }).catch(() => {
        if(btn) btn.innerText = "▶️ تجربة الأذان";
    });
}

// مراقبة الوقت كل 30 ثانية لتشغيل الأذان والإشعار
setInterval(() => {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    document.querySelectorAll(".time-cell").forEach(cell => {
        if (cell.innerText.trim() === currentTime && window.lastAzanTime !== currentTime) {
            const prayerName = cell.parentElement.cells[0].innerText;
            playAzan(); // تشغيل الصوت
            sendPrayerNotification(prayerName); // إرسال الإشعار المرئي
            window.lastAzanTime = currentTime;
        }
    });
}, 30000);

// --- 5. التحكم في الواجهة ---
function showPage(p) {
    document.getElementById('subhaPage').style.display = p==='subha'?'block':'none';
    document.getElementById('prayerPage').style.display = p==='prayer'?'block':'none';
    document.getElementById('navSubha').className = p==='subha'?'active':'';
    document.getElementById('navPrayer').className = p==='prayer'?'active':'';
}

document.addEventListener('contextmenu', e => e.preventDefault());

window.onload = () => {
    updateCityList();
    checkNotificationPermission(); // فحص إذن الإشعارات عند التشغيل
};

// وظيفة تحديث المدن الأصلية (أبقيها كما هي في كودك)
function updateCityList() {
    const r = document.getElementById('regionSelect').value;
    const s = document.getElementById('citySelect');
    s.innerHTML = "";
    const egyptCities = [{n:"القاهرة",v:"Cairo"}, {n:"الإسكندرية",v:"Alexandria"} /* ... بقية المدن ... */];
    const worldCapitals = [{n:"السعودية - مكة", v:"Mecca", c:"Saudi Arabia"} /* ... بقية العواصم ... */];
    const list = r === "Egypt" ? egyptCities : worldCapitals;
    list.forEach(c => {
        let o = document.createElement("option");
        o.value = c.v; o.text = c.n;
        if(c.c) o.setAttribute("data-country", c.c);
        s.appendChild(o);
    });
    getPrayerTimes();
       }
