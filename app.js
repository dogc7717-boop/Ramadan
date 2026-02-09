// ==================
// Supabase init
// ==================
const SUPABASE_URL = "https://dxqpttiffkdrtbwzmvcd.supabase.co";
const SUPABASE_KEY = "sb_publishable_CWdAdibfoDfxUpALqTyOHQ_Jltfbggt";

const sb = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ==================
// Login (Password)
// ==================
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("اكتب الإيميل وكلمة المرور");
    return;
  }

  const { error } = await sb.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
  } else {
    window.location.href = "dashboard.html";
  }
}

// ==================
// Register (Magic Link)
// ==================
async function register() {
  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("اكتب الإيميل");
    return;
  }

  const { error } = await sb.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin + "/dashboard.html",
    },
  });

  if (error) {
    alert(error.message);
  } else {
    window.location.href = "sent.html";
  }
}

// ==================
// Theme
// ==================
function toggleTheme() {
  const b = document.body;
  b.classList.toggle("light-theme");
  localStorage.setItem(
    "theme",
    b.classList.contains("light-theme") ? "light" : "dark"
  );
}

(function () {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-theme");
  }
})();
