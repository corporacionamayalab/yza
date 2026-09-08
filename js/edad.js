// ==================== VALIDACIÓN DE EDAD — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', () => {

  const edadModal = document.getElementById('edadModal');
  const btnMayorEdad = document.getElementById('btnMayorEdad');

  if (!edadModal) return;

  // Verificar si ya confirmó antes
  const mayorEdad = localStorage.getItem('myt_mayor_edad');

  if (mayorEdad === 'si') {
    edadModal.style.display = 'none';
    return;
  }

  // Mostrar modal
  edadModal.style.display = 'flex';

  // Confirmar edad
  btnMayorEdad.addEventListener('click', () => {
    localStorage.setItem('myt_mayor_edad', 'si');
    edadModal.style.display = 'none';
  });

});