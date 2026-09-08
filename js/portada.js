// ==================== PORTADA — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', () => {

  const portada = document.querySelector('.portada');
  if (!portada) return;

  // Animación de entrada
  const elementos = portada.querySelectorAll(
    '.portada__badge, .portada__titulo, .portada__descripcion, .portada__acciones, .portada__confianza'
  );

  elementos.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200 + (index * 150));
  });

});