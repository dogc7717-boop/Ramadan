/* ==============================
   prayer.js - صفحة مواعيد الصلاة
============================== */

// قراءة المواعيد من LocalStorage عند التحميل
let prayers = JSON.parse(localStorage.getItem("prayers")) || {};

// جدول الأيام
const days = ["الأربعاء","الخميس","الجمعة","السبت","الأحد","الإثنين","الثلاثاء"];
const times = ["إمساك","فجر","ظهر","عصر","مغرب","عشاء"];

// تطبيق المواعيد على الجدول
function renderTable(){
    days.forEach(day=>{
        times.forEach(time=>{
            const cellId = `${day}-${time}`;
            const val = prayers[cellId] || "";
            const cell = document.getElementById(cellId);
            if(cell) cell.innerText = val;
        });
    });
}
renderTable();

// إضافة موعد جديد
function addPrayer(){
    const day = document.getElementById("daySelect").value;
    const time = document.getElementById("timeSelect").value;
    const input = document.getElementById("prayerInput").value;

    if(!input) return alert("أدخل وقت الصلاة");

    const cellId = `${day}-${time}`;
    prayers[cellId] = input;
    localStorage.setItem("prayers", JSON.stringify(prayers));

    renderTable();
    alert("تم حفظ الموعد");
}

// ======= تشغيل الصوت حسب المواعيد =======
function checkPrayerAudio(){
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const dayName = days[now.getDay()===0?6:now.getDay()-1]; // تعديل لتوافق جدولنا

    times.forEach(time=>{
        const cellId = `${dayName}-${time}`;
        const val = prayers[cellId];
        if(val){
            const [h,m] = val.split(":").map(Number);
            if(h===hours && m===minutes){
                const lastPlayed = localStorage.getItem("lastPlayed-"+cellId);
                const today = now.toDateString();
                if(lastPlayed !== today){
                    playAudio();
                    localStorage.setItem("lastPlayed-"+cellId,today);
                }
            }
        }
    });
}

// تحقق كل دقيقة
setInterval(checkPrayerAudio,60000);
