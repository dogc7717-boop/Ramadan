// ⚠️ بدّل السطرين دول بس
const SUPABASE_URL = "PUT_YOUR_PROJECT_URL_HERE";
const SUPABASE_KEY = "PUT_YOUR_ANON_PUBLIC_KEY_HERE";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Auth
async function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if(error) return alert(error.message);
  window.location.href = "dashboard.html";
}

async function register(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { error } = await sb.auth.signUp({ email, password });
  if(error) return alert(error.message);
  alert("تم التسجيل، سجل دخولك الآن");
}

// Theme
function toggleTheme(){
  const b = document.body;
  b.classList.toggle("light-theme");
  localStorage.setItem("theme", b.classList.contains("light-theme") ? "light" : "dark");
}
(function(){
  if(localStorage.getItem("theme")==="light"){
    document.body.classList.add("light-theme");
  }
})();
