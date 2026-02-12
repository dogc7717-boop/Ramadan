// ===== حماية الداشبورد =====
function protectDashboard(){
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if(!user) { window.location.href = "index.html"; return; }
  if(!user.accepted_policy) { window.location.href = "policy_page.html"; return; }
}
protectDashboard();

// ===== تسجيل خروج =====
function logoutUser(){
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// ===== تبويبات الداشبورد =====
function showTab(id){
  document.querySelectorAll(".tab").forEach(t=>t.style.display="none");
  document.getElementById(id).style.display="block";
}

// ===== بيانات المستخدم =====
const user = JSON.parse(localStorage.getItem("currentUser"));
if(user){
  document.getElementById("userInfo").innerText=
    `الاسم: ${user.name}\nالهاتف: ${user.phone}\nالبريد: ${user.email}`;
}

// ===== الاشتراكات =====
const subscriptions = [
  {name:"200ج",price:200,days:3},
  {name:"500ج",price:500,days:4},
  {name:"750ج",price:750,days:7},
  {name:"1000ج",price:1000,days:7},
  {name:"5000ج",price:5000,days:15},
  {name:"10000ج",price:10000,days:30},
  {name:"VIP1",price:25000,days:40},
  {name:"VIP2",price:50000,days:40},
];

function loadSubscriptions(){
  let u = JSON.parse(localStorage.getItem("currentUser"));
  if(!u.subscriptions) u.subscriptions=[];
  u.subscriptions = u.subscriptions.filter(s => new Date(s.end) > new Date());
  localStorage.setItem("currentUser", JSON.stringify(u));

  const subList = document.getElementById("subscriptionList");
  const availList = document.getElementById("availableSubs");
  subList.innerHTML=""; availList.innerHTML="";

  u.subscriptions.forEach(s=>{
    subList.innerHTML+=`<div class="card"><h4>${s.name}</h4><p class="count" data-end="${s.end}"></p></div>`;
  });

  subscriptions.forEach(s=>{
    availList.innerHTML+=`<div class="card" onclick='buySubscription(${JSON.stringify(s)})'>
      <h4>${s.name}</h4>
      <p>${s.price} جنيه</p>
      <p>${s.days} يوم</p>
    </div>`;
  });

  startCountdown();
}

function buySubscription(s){
  let u = JSON.parse(localStorage.getItem("currentUser"));
  let end = new Date(); end.setDate(end.getDate()+s.days);
  u.subscriptions.push({...s,end:end});
  localStorage.setItem("currentUser",JSON.stringify(u));
  loadSubscriptions();
}

// ===== العدادات =====
let sessionCount = 0;
let totalCount = Number(localStorage.getItem("totalCount")) || 0;

const sessionSpan = document.getElementById("sessionCount");
const totalSpan = document.getElementById("totalCount");
const resetTotal = document.getElementById("resetTotal");

function updateCounter(n, container){
  container.innerHTML="";
  n.toString().split('').forEach(d=>{
    const box=document.createElement("span");
    box.className="counter-box";
    box.innerText=d;
    container.appendChild(box);
  });
}
updateCounter(sessionCount, sessionSpan);
updateCounter(totalCount, totalSpan);

// ===== أزرار لعبة الآيات =====
const btn = document.getElementById("btn");
const input = document.getElementById("textInput");
const resultDiv = document.getElementById("result");
const verseListDiv = document.getElementById("verseList");

const quranTable = [
  { verse: "شهر رمضان الذي أنزل فيه القرآن هدى للناس وبينات من الهدى والفرقان ۚ فمن شهد منكم الشهر فليصمه ۖ ومن كان مريضا أو على سفر فعدة من أيام أخرى ۗ يريد الله بكم اليسر ولا يريد بكم العسر ولتُكملوا العدة ولتكبروا الله على ما هداكم ولعلّكم تشكرون" },
  { verse: "يا أيها الذين آمنوا كتب عليكم الصيام كما كتب على الذين من قبلكم لعلكم تتقون" }
  // اضف باقي الآيات هنا
];

btn.onclick = () => {
  const val = input.value.trim().toLowerCase();
  if(!val) return;
  verseListDiv.innerHTML=""; resultDiv.innerText="";
  const foundItems = quranTable.filter(item => 
    item.verse.replace(/[\u064B-\u0652]/g,'').toLowerCase().includes(val)
  );
  if(foundItems.length){
    foundItems.forEach((item,i)=>{
      if(resultDiv.innerText==="") resultDiv.innerText=item.verse;
      const div=document.createElement("div");
      div.className="verse-item"; div.innerText=item.verse;
      div.onclick=()=>div.classList.toggle("expanded");
      verseListDiv.appendChild(div);
    });
  } else resultDiv.innerText="لا يوجد نتيجة";
};

// ===== مسح العداد الدائم =====
resetTotal.onclick = ()=>{
  totalCount=0;
  localStorage.setItem("totalCount",0);
  updateCounter(totalCount,totalSpan);
};

// ===== العدادات داخل الاشتراكات =====
function startCountdown(){
  document.querySelectorAll(".count").forEach(el=>{
    const end = new Date(el.dataset.end);
    setInterval(()=>{
      const diff = end - new Date();
      if(diff<=0){ loadSubscriptions(); return; }
      const d=Math.floor(diff/86400000);
      const h=Math.floor(diff/3600000)%24;
      const m=Math.floor(diff/60000)%60;
      const s=Math.floor(diff/1000)%60;
      el.innerText=`${d}ي ${h}س ${m}د ${s}ث`;
    },1000);
  });
}

// ===== بدء تحميل الاشتراكات =====
loadSubscriptions();
