// ==================== LOGIN ADMIN — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', () => {

  const formLogin = document.getElementById('formLogin');
  const loginError = document.getElementById('loginError');

  if (!formLogin) return;

  // Verificar si ya hay sesión activa
  async function verificarSesion() {
    const { data } = await window.supabaseClient.auth.getSession();
    if (data.session) {
      window.location.href = 'panel.html';
    }
  }

  verificarSesion();

  // Login
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Mostrar estado de carga
    const btn = formLogin.querySelector('.login__btn');
    btn.textContent = 'Entrando...';
    btn.disabled = true;

    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      loginError.style.display = 'block';
      loginError.textContent = '❌ Credenciales incorrectas';
      btn.textContent = 'Entrar al panel';
      btn.disabled = false;
      return;
    }

    // Redirigir al panel
    window.location.href = 'panel.html';

  });

});