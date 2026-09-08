// ==================== CONFIRMACIÓN — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', () => {

  const numeroPedido = document.getElementById('numeroPedido');
  if (!numeroPedido) return;

  // Obtener número de pedido desde la URL
  const params = new URLSearchParams(window.location.search);
  const pedido = params.get('pedido');

  if (pedido) {
    numeroPedido.textContent = pedido;
  }

});