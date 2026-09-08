// ==================== FOOTER — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', () => {

  // Año dinámico
  const yearSpan = document.getElementById('footerYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Animación de entrada
  const footer = document.getElementById('footer');
  if (!footer) return;

  const columnas = footer.querySelectorAll('.footer__col');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  columnas.forEach(col => {
    col.style.opacity = '0';
    col.style.transform = 'translateY(20px)';
    col.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(col);
  });

});