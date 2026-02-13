/* ==============================
   app.js - إعدادات + عدادات
============================== */

// ======= عدادات التسبيح =======
for(let i=1;i<=3;i++){
    let count = localStorage.getItem("count"+i)||0;
    document.getElementById("count"+i)?.innerText=count;

    document.getElementById("btn"+i)?.addEventListener("click",function(){
        count++;
        document.getElementById("count"+i).innerText=count;
        localStorage.setItem("count"+i,count);
    });
}

function reset(num){
    localStorage.setItem("count"+num,0);
    document.getElementById("count"+num).innerText=0;
}

// ======= نافذة الإعدادات =======
function toggleSettings(){
    const panel = document.getElementById("settingsPanel");
    if(panel){
        panel.style.right = panel.style.right === "0px" ? "-320px" : "0px";
    }
}

// ======= الخلفية =======
function changeBackground(){
    const file = document.getElementById("bgUpload")?.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(){
        localStorage.setItem("bgImage", reader.result);
        document.body.style.background=`url(${reader.result}) no-repeat center center / cover`;
    }
    reader.readAsDataURL(file);
}

// ======= تطبيق الخلفية عند التحميل =======
window.addEventListener("load", function(){
    const bg = localStorage.getItem("bgImage");
    if(bg) document.body.style.background=`url(${bg}) no-repeat center center / cover`;

    for(let i=1;i<=3;i++){
        const text = localStorage.getItem("btnText"+i);
        if(text) document.getElementById("btn"+i).innerText=text;
    }

    // تشغيل صوت الأذان لو موجود
    const audioSrc = localStorage.getItem("adhanAudio");
    if(audioSrc){
        let audio = new Audio(audioSrc);
        window.audio = audio;
    }
});

// ======= تغيير نصوص أزرار التسبيح =======
function changeButtonsText(){
    for(let i=1;i<=3;i++){
        const val = document.getElementById("btn"+i+"Text")?.value;
        if(val){
            document.getElementById("btn"+i).innerText=val;
            localStorage.setItem("btnText"+i,val);
        }
    }
}

// ======= رفع صوت الأذان =======
function saveAudio(){
    const file = document.getElementById("audioUpload")?.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(){
        localStorage.setItem("adhanAudio", reader.result);
        alert("تم رفع الصوت بنجاح");
        window.audio = new Audio(reader.result);
    }
    reader.readAsDataURL(file);
}

// ======= تشغيل الصوت عند الحاجة =======
function playAudio(){
    if(window.audio) window.audio.play();
           }
