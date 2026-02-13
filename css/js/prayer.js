document.addEventListener("DOMContentLoaded", function(){
  let prayers = JSON.parse(localStorage.getItem("prayers"))||{};
  const days = ["الأربعاء","الخميس","الجمعة","السبت","الأحد","الإثنين","الثلاثاء"];
  const times = ["إمساك","فجر","ظهر","عصر","مغرب","عشاء"];

  function renderTable(){
    days.forEach(day=>{
      times.forEach(time=>{
        const id=`${day}-${time}`;
        const cell=document.getElementById(id);
        if(cell) cell.innerText=prayers[id]||"";
      });
    });
  }
  renderTable();

  window.addPrayer=function(){
    const day=document.getElementById("daySelect").value;
    const time=document.getElementById("timeSelect").value;
    const val=document.getElementById("prayerInput").value;
    if(!val) return alert("أدخل الوقت");
    const id=`${day}-${time}`;
    prayers[id]=val;
    localStorage.setItem("prayers",JSON.stringify(prayers));
    renderTable();
  }

});
