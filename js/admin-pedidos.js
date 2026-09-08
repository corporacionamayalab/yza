// ==================== PEDIDOS ADMIN — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', async () => {

  const listaPedidos = document.getElementById('listaPedidos');
  const filtros = document.querySelectorAll('.pedidos-filtro');

  if (!listaPedidos) return;

  let filtroActivo = 'todos';

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

  // ----- Filtros -----
  filtros.forEach(filtro => {
    filtro.addEventListener('click', () => {
      filtros.forEach(f => f.classList.remove('pedidos-filtro--activo'));
      filtro.classList.add('pedidos-filtro--activo');
      filtroActivo = filtro.dataset.filtro;
      cargarPedidos();
    });
  });

  // ----- Cargar pedidos -----
  await cargarPedidos();

  async function cargarPedidos() {
    const { data, error } = await window.supabaseClient
      .from('pedidos')
      .select('*')
      .order('creado', { ascending: false });

    if (error) {
      console.error('Error:', error);
      return;
    }

    if (!data || data.length === 0) {
      listaPedidos.innerHTML = '<div class="pedidos-vacio">No hay pedidos.</div>';
      return;
    }

    // Filtrar
    let pedidos = data;
    if (filtroActivo !== 'todos') {
      pedidos = data.filter(p => p.estado === filtroActivo);
    }

    if (pedidos.length === 0) {
      listaPedidos.innerHTML = '<div class="pedidos-vacio">No hay pedidos con este estado.</div>';
      return;
    }

    listaPedidos.innerHTML = pedidos.map(pedido => {
      // Parsear items del pedido
      let itemsPedido = [];
      try {
        itemsPedido = JSON.parse(pedido.items || '[]');
      } catch (e) {
        itemsPedido = [];
      }

      // Renderizar productos
      const itemsHTML = itemsPedido.map(item => `
        <div class="pedido-card__item">
          <span>${item.cantidad}x ${item.nombre}</span>
          <span>S/ ${(parseFloat(item.precio) * item.cantidad).toFixed(2)}</span>
        </div>
      `).join('');

      return `
        <div class="pedido-card">
          <div class="pedido-card__header">
            <span class="pedido-card__id">Pedido #${pedido.id}</span>
            <span class="pedido-card__estado pedido-card__estado--${pedido.estado}">${pedido.estado}</span>
          </div>

          <div class="pedido-card__info">
            <span><strong>Cliente:</strong> ${pedido.cliente_nombre}</span>
            <span><strong>Teléfono:</strong> ${pedido.cliente_telefono}</span>
            <span><strong>Dirección:</strong> ${pedido.direccion}</span>
            <span><strong>Pago:</strong> ${pedido.metodo_pago}</span>
            <span><strong>Fecha:</strong> ${new Date(pedido.creado).toLocaleString('es-PE')}</span>
          </div>

          <div class="pedido-card__items">
            <strong>🛒 Productos:</strong>
            ${itemsHTML || '<span class="pedido-card__sin-items">Sin detalles</span>'}
          </div>

          <div class="pedido-card__footer">
            <span class="pedido-card__total">Total: S/ ${parseFloat(pedido.total).toFixed(2)}</span>
            <select class="pedido-card__select" onchange="cambiarEstado('${pedido.id}', this.value)">
              <option value="pendiente" ${pedido.estado === 'pendiente' ? 'selected' : ''}>⏳ Pendiente</option>
              <option value="confirmado" ${pedido.estado === 'confirmado' ? 'selected' : ''}>✅ Confirmado</option>
              <option value="entregado" ${pedido.estado === 'entregado' ? 'selected' : ''}>🚀 Entregado</option>
            </select>
          </div>
        </div>
      `;
    }).join('');
  }

  // ----- Cambiar estado -----
  window.cambiarEstado = async function(id, estado) {
    const { error } = await window.supabaseClient
      .from('pedidos')
      .update({ estado })
      .eq('id', id);

    if (error) {
      alert('❌ Error al actualizar');
      return;
    }

    alert('✅ Estado actualizado');
    await cargarPedidos();
  };

});