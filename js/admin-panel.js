// ==================== PANEL ADMIN — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', async () => {

  // ----- Fecha actual -----
  const fechaActual = document.getElementById('fechaActual');
  if (fechaActual) {
    const hoy = new Date();
    fechaActual.textContent = hoy.toLocaleDateString('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  // ----- Verificar sesión -----
  async function verificarSesion() {
    const { data } = await window.supabaseClient.auth.getSession();
    if (!data.session) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }

  const ok = await verificarSesion();
  if (!ok) return;

  // ----- Logout -----
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      await window.supabaseClient.auth.signOut();
      window.location.href = 'index.html';
    });
  }

  // ----- Cargar stats -----
  const { data: pedidos, error: errorPedidos } = await window.supabaseClient
    .from('pedidos')
    .select('*');

  const { data: productos, error: errorProductos } = await window.supabaseClient
    .from('productos')
    .select('*');

  if (pedidos) {
    document.getElementById('statPedidos').textContent = pedidos.length;
    document.getElementById('statPendientes').textContent = 
      pedidos.filter(p => p.estado === 'pendiente').length;

    const totalVentas = pedidos.reduce((sum, p) => sum + parseFloat(p.total), 0);
    document.getElementById('statVentas').textContent = `S/ ${totalVentas.toFixed(2)}`;
  }

  if (productos) {
    document.getElementById('statProductos').textContent = productos.length;
  }

});