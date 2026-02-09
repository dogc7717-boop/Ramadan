import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://YOUR_PROJECT_ID.supabase.co",
  "YOUR_PUBLIC_ANON_KEY",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// تسجيل مستخدم
async function signup(email, password) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "https://dogc7717-boop.github.io/dashboard.html"
    }
  });

  if (error) {
    alert(error.message);
  } else {
    window.location.href = "sent.html";
  }
}

// تسجيل دخول
async function login(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
  } else {
    window.location.href = "dashboard.html";
  }
}

// كشف الجلسة
async function checkSession() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    window.location.href = "index.html";
  }
}

window.signup = signup;
window.login = login;
window.checkSession = checkSession;
