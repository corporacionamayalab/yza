// ==================== HERO TIENDA — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', async () => {

  const totalProductos = document.getElementById('totalProductos');
  if (!totalProductos) return;

  // Cargar total de productos
  const { data, error } = await window.supabaseClient
    .from('productos')
    .select('id')
    .eq('activo', true);

  if (!error && data) {
    totalProductos.textContent = data.length;
  }

});