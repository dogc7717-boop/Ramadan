/**
 * ISKAR - Ramadan Application 2026
 * Developed by: ISKAR (Sameh Elnady)
 */

let count = 0;
let audioCtx;
let currentAzanAudio = null;
let deferredPrompt;
window.lastAzanTime = "";

const installBtn = document.getElementById('installBtn');
const loadingModal = document.getElementById('loadingModal');

// --- 1. نظام التثبيت (PWA) ---
window.addEventListener('beforeinstallprompt', (e) => {
    // منع المتصفح من إظهار النافذة التلقائية
    e.preventDefault();
    // حفظ الحدث لاستخدامه عند الضغط على الزر الأخضر
    deferredPrompt = e;
});

if(installBtn) {
    installBtn.addEventListener('click', async () => {
        // إظهار نافذة "جاري التحميل" الوهمية
        loadingModal.style.display = 'flex';

        if (deferredPrompt) {
            // محاولة إظهار نافذة التثبيت الرسمية
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                installBtn.style.display = 'none';
            }
            deferredPrompt = null;
            // إخفاء نافذة التحميل بعد ثانيتين
            setTimeout(() => { loadingModal.style.display = 'none'; }, 2000);
        } else {
            // إذا كان التطبيق مثبتاً بالفعل أو المتصفح لا يدعم التثبيت التلقائي
            setTimeout(() => {
                loadingModal.style.display = 'none';
                // إرشاد المستخدم للتثبيت اليدوي في حال فشل التلقائي
                alert("للتثبيت على هاتفك:\n١. اضغط على خيارات المتصفح (⋮)\n٢. اختر 'تثبيت التطبيق' أو 'إضافة إلى الشاشة الرئيسية'");
            }, 2500);
        }
    });
}

// إخفاء الزر والنافذة فور إتمام التثبيت
window.addEventListener('appinstalled', () => {
    if(installBtn) installBtn.style.display = 'none';
    if(loadingModal) loadingModal.style.display = 'none';
});

// --- 2. وظائف التسبيح (تكة + اهتزاز) ---
function addCount() {
    count++;
    document.getElementById('counter').innerText = count;
    
    // الاهتزاز (إذا كان مفعلاً)
    if(document.getElementById('vibrateToggle').checked && navigator.vibrate) {
        navigator.vibrate(40);
    }

    // صوت التكة (إذا كان مفعلاً)
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

// --- 3. إدارة المدن والمحافظات ---
function updateCityList() {
    const r = document.getElementById('regionSelect').value;
    const s = document.getElementById('citySelect');
    s.innerHTML = "";

    const egyptCities = [
        {n:"القاهرة",v:"Cairo"}, {n:"الإسكندرية",v:"Alexandria"}, {n:"الجيزة",v:"Giza"},
        {n:"المنصورة",v:"Mansoura"}, {n:"طنطا",v:"Tanta"}, {n:"أسيوط",v:"Asyut"},
        {n:"سوهاج",v:"Sohag"}, {n:"الأقصر",v:"Luxor"}, {n:"أسوان",v:"Aswan"},
        {n:"المنيا",v:"Minya"}, {n:"بني سويف",v:"Beni Suef"}, {n:"الفيوم",v:"Faiyum"},
        {n:"الإسماعيلية",v:"Ismailia"}, {n:"السويس",v:"Suez"}, {n:"بورسعيد",v:"Port Said"},
        {n:"دمياط",v:"Damietta"}, {n:"الزقازيق",v:"Zagazig"}, {n:"شبين الكوم",v:"Shibin El Kom"},
        {n:"كفر الشيخ",v:"Kafr El Sheikh"}, {n:"دمنهور",v:"Damanhur"}, {n:"قنا",v:"Qena"},
        {n:"مرسى مطروح",v:"Marsa Matruh"}, {n:"العريش",v:"Arish"}, {n:"الغردقة",v:"Hurghada"}
    ];

    const worldCapitals = [
        {n:"السعودية - مكة", v:"Mecca", c:"Saudi Arabia"},
        {n:"الكويت - العاصمة", v:"Kuwait City", c:"Kuwait"},
        {n:"قطر - الدوحة", v:"Doha", c:"Qatar"},
        {n:"الإمارات - دبي", v:"Dubai", c:"United Arab Emirates"},
        {n:"فلسطين - القدس", v:"Jerusalem", c:"Palestine"},
        {n:"ليبيا - طرابلس", v:"Tripoli", c:"Libya"},
        {n:"الجزائر - العاصمة", v:"Algiers", c:"Algeria"},
        {n:"تونس - العاصمة", v:"Tunis", c:"Tunisia"},
        {n:"المغرب - الرباط", v:"Rabat", c:"Morocco"},
        {n:"السودان - الخرطوم", v:"Khartoum", c:"Sudan"}
    ];

    const list = r === "Egypt" ? egyptCities : worldCapitals;
    list.forEach(c => {
        let o = document.createElement("option");
        o.value = c.v; o.text = c.n;
        if(c.c) o.setAttribute("data-country", c.c);
        s.appendChild(o);
    });
    getPrayerTimes();
}

// --- 4. جلب المواقيت ونظام الأذان ---
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

    currentAzanAudio.onended = () => {
        if(btn) btn.innerText = "▶️ تجربة الأذان";
    };
}

// مراقبة الوقت كل 30 ثانية لتشغيل الأذان تلقائياً
setInterval(() => {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    document.querySelectorAll(".time-cell").forEach(cell => {
        if (cell.innerText.trim() === currentTime && window.lastAzanTime !== currentTime) {
            playAzan();
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
};
