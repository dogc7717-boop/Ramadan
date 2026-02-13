// ===================
// نافذة الإعدادات (فتح/غلق)
// ===================
function toggleSettings() {
  const panel = document.getElementById("settingsPanel");
  if (panel.style.right === "0px") {
    panel.style.right = "-350px";
  } else {
    panel.style.right = "0px";
  }
}

// ===================
// تغيير الخلفية
// ===================
function changeBackground() {
  const file = document.getElementById("bgUpload").files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.body.style.backgroundImage = `url(${e.target.result})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    };
    reader.readAsDataURL(file);
  }
}

// ===================
// رفع صوت الأذان
// ===================
function saveAudio() {
  const file = document.getElementById("audioUpload").files[0];
  if (file) {
    const audioURL = URL.createObjectURL(file);
    localStorage.setItem("azanAudio", audioURL);
    alert("تم رفع صوت الأذان بنجاح");
  }
}

// ===================
// عدادات التسبيح
// ===================
let counts = [0,0,0];

function increment(index) {
  counts[index]++;
  document.getElementById("count"+(index+1)).innerText = counts[index];
}

function reset(index) {
  counts[index] = 0;
  document.getElementById("count"+(index+1)).innerText = 0;
}

// ربط الأزرار بالعدادات
document.getElementById("btn1").addEventListener("click", ()=> increment(0));
document.getElementById("btn2").addEventListener("click", ()=> increment(1));
document.getElementById("btn3").addEventListener("click", ()=> increment(2));
