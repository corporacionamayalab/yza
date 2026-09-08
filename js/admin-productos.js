// ==================== PRODUCTOS ADMIN — MYT EXPRESS ====================

document.addEventListener('DOMContentLoaded', async () => {

  const formProducto = document.getElementById('formProducto');
  const listaProductos = document.getElementById('listaProductos');

  if (!formProducto) return;

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

  // ----- Cargar productos -----
  await cargarProductos();

  async function cargarProductos() {
    const { data, error } = await window.supabaseClient
      .from('productos')
      .select('*')
      .order('creado', { ascending: false });

    if (error) {
      console.error('Error:', error);
      return;
    }

    if (!data || data.length === 0) {
      listaProductos.innerHTML = '<div class="admin-vacio">No hay productos.</div>';
      return;
    }

    listaProductos.innerHTML = data.map(prod => `
      <div class="admin-item">
        <img src="${prod.imagen_url || 'https://via.placeholder.com/50'}" alt="${prod.nombre}" class="admin-item__img">
        <div class="admin-item__info">
          <strong>${prod.nombre}</strong>
          <span>S/ ${parseFloat(prod.precio).toFixed(2)} | Stock: ${prod.stock} | ${prod.categoria || 'Sin categoría'}</span>
        </div>
        <div class="admin-item__acciones">
          <button class="admin-item__btn admin-item__btn--editar" onclick="editarProducto('${prod.id}')">✏️</button>
          <button class="admin-item__btn admin-item__btn--eliminar" onclick="eliminarProducto('${prod.id}')">🗑️</button>
        </div>
      </div>
    `).join('');
  }

  // ----- Agregar producto -----
  formProducto.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const categoria = document.getElementById('categoria').value.trim();
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;
    const imagen_url = document.getElementById('imagen_url').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();

    const btn = formProducto.querySelector('.admin-form__btn');
    btn.textContent = 'Guardando...';
    btn.disabled = true;

    const { error } = await window.supabaseClient
      .from('productos')
      .insert([{ nombre, categoria, precio, stock, imagen_url, descripcion, activo: true }]);

    btn.textContent = 'Guardar producto';
    btn.disabled = false;

    if (error) {
      alert('❌ Error al guardar');
      console.error(error);
      return;
    }

    alert('✅ Producto guardado');
    formProducto.reset();
    await cargarProductos();
  });

  // ----- Eliminar producto -----
  window.eliminarProducto = async function(id) {
    if (!confirm('¿Eliminar este producto?')) return;

    const { error } = await window.supabaseClient
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) {
      alert('❌ Error al eliminar');
      return;
    }

    alert('✅ Producto eliminado');
    await cargarProductos();
  };

  // ----- Editar producto -----
  window.editarProducto = async function(id) {
    const nombre = prompt('Nuevo nombre:');
    if (!nombre) return;

    const precio = prompt('Nuevo precio:');
    if (!precio) return;

    const stock = prompt('Nuevo stock:');
    if (!stock) return;

    const { error } = await window.supabaseClient
      .from('productos')
      .update({ nombre, precio, stock })
      .eq('id', id);

    if (error) {
      alert('❌ Error al actualizar');
      return;
    }

    alert('✅ Producto actualizado');
    await cargarProductos();
  };

});