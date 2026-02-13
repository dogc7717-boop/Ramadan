document.addEventListener("DOMContentLoaded", function(){

  // ======= عدادات التسبيح =======
  for(let i=1;i<=3;i++){
    let count = localStorage.getItem("count"+i) || 0;
    const countEl = document.getElementById("count"+i);
    const btnEl = document.getElementById("btn"+i);
    if(countEl) countEl.innerText = count;

    if(btnEl){
      btnEl.addEventListener("click", function(){
        count++;
        countEl.innerText = count;
        localStorage.setItem("count"+i, count);
      });
    }
  }

  // ======= زر التصفير =======
  window.reset = function(num){
    const countEl = document.getElementById("count"+num);
    if(countEl){
      localStorage.setItem("count"+num, 0);
      countEl.innerText = 0;
    }
  }

  // ======= نافذة الإعدادات =======
  window.toggleSettings = function(){
    const panel = document.getElementById("settingsPanel");
    if(panel){
      panel.style.right = panel.style.right === "0px" ? "-320px" : "0px";
    }
  }

  // ======= تغيير الخلفية =======
  window.changeBackground = function(){
    const file = document.getElementById("bgUpload")?.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(){
      localStorage.setItem("bgImage", reader.result);
      document.body.style.background = `url(${reader.result}) no-repeat center center / cover`;
    }
    reader.readAsDataURL(file);
  }

  // ======= تغيير نصوص الأزرار =======
  window.changeButtonsText = function(){
    for(let i=1;i<=3;i++){
      const input = document.getElementById("btn"+i+"Text");
      const btn = document.getElementById("btn"+i);
      if(input && btn && input.value){
        btn.innerText = input.value;
        localStorage.setItem("btnText"+i, input.value);
      }
    }
  }

  // ======= رفع وتشغيل الصوت =======
  window.saveAudio = function(){
    const file = document.getElementById("audioUpload")?.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(){
      localStorage.setItem("adhanAudio", reader.result);
      alert("تم رفع الصوت بنجاح، اضغط على أي زر لتشغيله أول مرة");
      window.audio = new Audio(reader.result);
    }
    reader.readAsDataURL(file);
  }

  // ======= تحميل الخلفية والنصوص والصوت عند فتح الصفحة =======
  const bg = localStorage.getItem("bgImage");
  if(bg) document.body.style.background = `url(${bg}) no-repeat center center / cover`;

  for(let i=1;i<=3;i++){
    const text = localStorage.getItem("btnText"+i);
    const btn = document.getElementById("btn"+i);
    if(text && btn) btn.innerText = text;
  }

  const audioSrc = localStorage.getItem("adhanAudio");
  if(audioSrc) window.audio = new Audio(audioSrc);

});
