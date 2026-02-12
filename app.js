// حماية Dashboard
function protectDashboard() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if(!user){ window.location.href="index.html"; return; }
  if(!user.accepted_policy){ window.location.href="policy.html"; return; }

  document.getElementById("userInfo").innerText = 
    `الاسم: ${user.name}\nالهاتف: ${user.phone}\nالبريد: ${user.email}\nالكود: ${user.code}`;

  loadSubscriptions();
}

// Tabs
function showTab(tabId){
  document.querySelectorAll(".tab").forEach(t=>t.style.display="none");
  document.getElementById(tabId).style.display="block";

  document.querySelectorAll(".navbar button").forEach(b=>b.classList.remove("active"));
  const btn = Array.from(document.querySelectorAll(".navbar button"))
                  .find(b => b.innerText === getTabName(tabId));
  if(btn) btn.classList.add("active");
}
function getTabName(tabId){
  switch(tabId){
    case "profile": return "صفحتك";
    case "about": return "عنا";
    case "payment": return "دفع";
    case "subscriptions": return "اشتراكاتي";
    case "gameContainer": return "اللعبة";
  }
}

// Logout
function logout(){ localStorage.removeItem("currentUser"); window.location.href="index.html"; }

// Subscriptions
const subscriptions=[
  {name:"اشتراك 1", price:200, days:3, type:"game"},
  {name:"اشتراك 2", price:500, days:4, type:"game"},
  {name:"اشتراك 3", price:750, days:7, type:"game"},
  {name:"اشتراك 4", price:1000, days:7, type:"game"},
  {name:"اشتراك 5", price:5000, days:15, type:"game"},
  {name:"اشتراك 6", price:10000, days:30, type:"game"},
  {name:"VIP 1", price:25000, days:40, type:"game"},
  {name:"VIP 2", price:50000, days:40, type:"game"},
];

// تحميل الاشتراكات
function loadSubscriptions() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if(!user.subscriptions) user.subscriptions=[];

  // إزالة المنتهية تلقائياً
  user.subscriptions = user.subscriptions.filter(sub=> new Date(sub.endTime) > new Date());
  localStorage.setItem("currentUser", JSON.stringify(user));

  const userSubsDiv = document.getElementById("subscriptionList");
  const availableDiv = document.getElementById("availableSubs");
  userSubsDiv.innerHTML=""; availableDiv.innerHTML="";

  // عرض الاشتراكات المشتراه
  user.subscriptions.forEach(sub=>{
    const card = document.createElement("div"); card.className="card";
    card.innerHTML=`<h4>${sub.name}</h4>
      <p>السعر: ${sub.price} جنيه</p>
      <p>المدة: ${sub.days} يوم</p>
      <p>ينتهي خلال: <span class="countdown" data-end="${sub.endTime}"></span></p>`;
    userSubsDiv.appendChild(card);
  });

  // عرض الاشتراكات المتاحة
  subscriptions.forEach(sub=>{
    const card=document.createElement("div"); card.className="card";
    card.innerHTML=`<h4>${sub.name}</h4>
      <p>السعر: ${sub.price} جنيه</p>
      <p>المدة: ${sub.days} يوم</p>`;
    card.onclick=()=>buySubscription(sub);
    availableDiv.appendChild(card);
  });

  startCountdown();
}

// شراء اشتراك
function buySubscription(sub){
  const user=JSON.parse(localStorage.getItem("currentUser"));
  if(!user.subscriptions) user.subscriptions=[];
  const endTime = new Date(); endTime.setDate(endTime.getDate()+sub.days);

  user.subscriptions.push({...sub, date:new Date().toISOString(), endTime:endTime.toISOString()});
  localStorage.setItem("currentUser", JSON.stringify(user));
  alert(`تم شراء الاشتراك: ${sub.name}`);
  loadSubscriptions();
}

// العداد التنازلي لكل اشتراك
function startCountdown(){
  document.querySelectorAll(".countdown").forEach(el=>{
    const endTime = new Date(el.dataset.end);
    const interval = setInterval(()=>{
      const diff = endTime - new Date();
      if(diff<=0){ clearInterval(interval); loadSubscriptions(); return; }
      const days=Math.floor(diff/(1000*60*60*24));
      const hours=Math.floor((diff/(1000*60*60))%24);
      const minutes=Math.floor((diff/(1000*60))%60);
      const seconds=Math.floor((diff/1000)%60);
      el.innerText = `${days} يوم / ${hours} ساعة / ${minutes} دقيقة / ${seconds} ثانية`;
    },1000);
  });
}

// فتح اللعبة والتحكم بالوصول + 5 دقائق مجانية
function openGame(subName){
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if(!user || !user.subscriptions) return alert("لا يوجد اشتراك!");

  const gameSub = user.subscriptions.find(s => s.name===subName && s.type==="game");
  const freeStart = localStorage.getItem("gameFreeStart");

  if(!freeStart){
    localStorage.setItem("gameFreeStart", new Date().toISOString());
    alert("لديك 5 دقائق مجانية للعب!");
  }

  const now = new Date();
  let freeMinutes = 5;
  if(freeStart){
    const start = new Date(freeStart);
    freeMinutes -= (now - start)/1000/60;
  }

  if(!gameSub && freeMinutes <=0){
    alert("انتهى الوقت المجاني والاشتراك!");
    document.getElementById("gameContainer").style.display="none";
    return;
  }

  document.getElementById("gameContainer").style.display="block";
  startGameCountdown(subName);
}

// عداد اللعبة + اغلاق عند انتهاء الوقت
function startGameCountdown(subName){
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const gameSub = user.subscriptions.find(s => s.name===subName && s.type==="game");
  if(!gameSub) return;

  const endTime = new Date(gameSub.endTime);
  const countdownEl = document.getElementById("gameCountdown");

  const interval = setInterval(()=>{
    const diff = endTime - new Date();
    if(diff <=0){
      clearInterval(interval);
      alert("انتهى وقت الاشتراك للعبة! سيتم إغلاق اللعبة.");
      document.getElementById("gameContainer").style.display="none";
      return;
    }

    const days=Math.floor(diff/(1000*60*60*24));
    const hours=Math.floor((diff/(1000*60*60))%24);
    const minutes=Math.floor((diff/(1000*60))%60);
    const seconds=Math.floor((diff/1000)%60);
    countdownEl.innerText = `${days} يوم / ${hours} ساعة / ${minutes} دقيقة / ${seconds} ثانية`;
  },1000);
}

// حماية عند التحميل
if(document.getElementById("userInfo")) protectDashboard();
