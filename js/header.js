// ==================== HEADER — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', () => {

  // ----- Elementos -----
  const header = document.getElementById('header');
  const btnHamburguesa = document.getElementById('btnHamburguesa');
  const menuMovil = document.getElementById('menuMovil');
  const btnCerrarMenu = document.getElementById('btnCerrarMenu');
  const overlay = document.getElementById('headerOverlay');

  // ----- 1. Efecto al hacer scroll -----
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    });
  }

  // ----- 2. Abrir menú móvil -----
  function abrirMenu() {
    if (menuMovil) menuMovil.classList.add('menu-movil--abierto');
    if (overlay) overlay.classList.add('header__overlay--visible');
    if (btnHamburguesa) btnHamburguesa.classList.add('header__hamburguesa--abierto');
    document.body.style.overflow = 'hidden';
  }

  // ----- 3. Cerrar menú móvil -----
  function cerrarMenu() {
    if (menuMovil) menuMovil.classList.remove('menu-movil--abierto');
    if (overlay) overlay.classList.remove('header__overlay--visible');
    if (btnHamburguesa) btnHamburguesa.classList.remove('header__hamburguesa--abierto');
    document.body.style.overflow = '';
  }

  // ----- Eventos -----
  if (btnHamburguesa) {
    btnHamburguesa.addEventListener('click', () => {
      if (menuMovil && menuMovil.classList.contains('menu-movil--abierto')) {
        cerrarMenu();
      } else {
        abrirMenu();
      }
    });
  }

  if (btnCerrarMenu) btnCerrarMenu.addEventListener('click', cerrarMenu);
  if (overlay) overlay.addEventListener('click', cerrarMenu);

  // Cerrar al hacer clic en un enlace del menú
  const linksMovil = document.querySelectorAll('.menu-movil__link');
  linksMovil.forEach(link => {
    link.addEventListener('click', cerrarMenu);
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarMenu();
  });

  // ----- 4. Contador del carrito -----
  function actualizarContador() {
    const contador = document.getElementById('contadorCarrito');
    if (!contador) return;

    const carrito = JSON.parse(localStorage.getItem('carrito_myt') || '[]');
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contador.textContent = total;
  }

  actualizarContador();

  window.addEventListener('storage', actualizarContador);

});