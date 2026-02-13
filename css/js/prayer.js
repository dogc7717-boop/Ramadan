/* ==============================
   prayer.js - صفحة مواعيد الصلاة
============================== */

let prayers = JSON.parse(localStorage.getItem("prayers")) || {};

const days = ["الأربعاء","الخميس","الجمعة","السبت","الأحد","الإثنين","الثلاثاء"];
const times = ["إمساك","فجر","ظهر","عصر","مغرب","عشاء"];

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

function addPrayer(){
    const day = document.getElementById("daySelect").value;
    const time = document.getElementById("timeSelect").value;
    const input = document.getElementById("prayerInput").value;

    if(!input) return alert("أدخل وقت الصلاة");

    const cellId = `${day}-${time}`;
    prayers[cellId] = input;
    localStorage.setItem("prayers", JSON.stringify(prayers));
