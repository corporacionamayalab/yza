// ==================== CÓMO COMPRAR — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', () => {

  const pasos = document.querySelectorAll('.paso');
  if (!pasos.length) return;

  // Animación de entrada
  pasos.forEach((paso, index) => {
    paso.style.opacity = '0';
    paso.style.transform = 'translateY(25px)';
    paso.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 150);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(paso);
  });

});