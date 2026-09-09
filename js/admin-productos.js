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

  // ----- Logout desktop -----
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      await window.supabaseClient.auth.signOut();
      window.location.href = 'index.html';
    });
  }

  // ----- Menú móvil -----
  const btnAdminHamburguesa = document.getElementById('btnAdminHamburguesa');
  const adminMenuMovil = document.getElementById('adminMenuMovil');
  const btnAdminCerrarMenu = document.getElementById('btnAdminCerrarMenu');
  const adminOverlay = document.getElementById('adminOverlay');

  function abrirAdminMenu() {
    if (adminMenuMovil) adminMenuMovil.classList.add('admin-menu-movil--abierto');
    if (adminOverlay) adminOverlay.classList.add('admin-header__overlay--visible');
    document.body.style.overflow = 'hidden';
  }

  function cerrarAdminMenu() {
    if (adminMenuMovil) adminMenuMovil.classList.remove('admin-menu-movil--abierto');
    if (adminOverlay) adminOverlay.classList.remove('admin-header__overlay--visible');
    document.body.style.overflow = '';
  }

  if (btnAdminHamburguesa) btnAdminHamburguesa.addEventListener('click', abrirAdminMenu);
  if (btnAdminCerrarMenu) btnAdminCerrarMenu.addEventListener('click', cerrarAdminMenu);
  if (adminOverlay) adminOverlay.addEventListener('click', cerrarAdminMenu);

  document.querySelectorAll('.admin-menu-movil__link').forEach(link => {
    link.addEventListener('click', cerrarAdminMenu);
  });

  // ----- Logout móvil -----
  const btnLogoutMovil = document.getElementById('btnLogoutMovil');
  if (btnLogoutMovil) {
    btnLogoutMovil.addEventListener('click', async () => {
      await window.supabaseClient.auth.signOut();
      window.location.href = 'index.html';
    });
  }

  // ----- Mostrar/ocultar formulario -----
  const btnMostrarForm = document.getElementById('btnMostrarForm');
  const btnCerrarForm = document.getElementById('btnCerrarForm');
  const btnCancelarForm = document.getElementById('btnCancelarForm');

  if (btnMostrarForm) {
    btnMostrarForm.addEventListener('click', () => {
      formProducto.style.display = 'flex';
      btnMostrarForm.style.display = 'none';
    });
  }

  if (btnCerrarForm) {
    btnCerrarForm.addEventListener('click', () => {
      formProducto.style.display = 'none';
      btnMostrarForm.style.display = 'block';
    });
  }

  if (btnCancelarForm) {
    btnCancelarForm.addEventListener('click', () => {
      formProducto.style.display = 'none';
      btnMostrarForm.style.display = 'block';
    });
  }

  // ----- Buscador -----
  const adminBuscador = document.getElementById('adminBuscador');
  if (adminBuscador) {
    adminBuscador.addEventListener('input', () => {
      const term = adminBuscador.value.toLowerCase();
      document.querySelectorAll('.admin-item').forEach(item => {
        const nombre = item.querySelector('strong').textContent.toLowerCase();
        item.style.display = nombre.includes(term) ? 'flex' : 'none';
      });
    });
  }

  // ===== SUBIR IMAGEN A SUPABASE STORAGE =====
  const imagenFile = document.getElementById('imagenFile');
  const imagenNombre = document.getElementById('imagenNombre');
  const imagenPreview = document.getElementById('imagenPreview');
  const imagenPreviewImg = document.getElementById('imagenPreviewImg');

  if (imagenFile) {
    imagenFile.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      imagenNombre.textContent = 'Subiendo...';

      const reader = new FileReader();
      reader.onload = () => {
        imagenPreviewImg.src = reader.result;
        imagenPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);

      const nombreArchivo = `${Date.now()}_${file.name}`;

      const { data, error } = await window.supabaseClient
        .storage
        .from('productos')
        .upload(nombreArchivo, file);

      if (error) {
        alert('❌ Error al subir imagen');
        console.error(error);
        imagenNombre.textContent = 'Error al subir';
        return;
      }

      const { data: urlData } = window.supabaseClient
        .storage
        .from('productos')
        .getPublicUrl(nombreArchivo);

      document.getElementById('imagen_url').value = urlData.publicUrl;
      imagenNombre.textContent = `✅ ${file.name}`;
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

  // ----- Agregar / Actualizar -----
  formProducto.addEventListener('submit', async (e) => {
    e.preventDefault();

    const productoId = document.getElementById('productoId').value;
    const nombre = document.getElementById('nombre').value.trim();
    const categoria = document.getElementById('categoria').value.trim();
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;
    const imagen_url = document.getElementById('imagen_url').value;
    const descripcion = document.getElementById('descripcion').value.trim();

    const btn = formProducto.querySelector('.admin-form__btn');
    btn.textContent = 'Guardando...';
    btn.disabled = true;

    let error;

    if (productoId) {
      const result = await window.supabaseClient
        .from('productos')
        .update({ nombre, categoria, precio, stock, imagen_url, descripcion })
        .eq('id', productoId);
      error = result.error;
    } else {
      const result = await window.supabaseClient
        .from('productos')
        .insert([{ nombre, categoria, precio, stock, imagen_url, descripcion, activo: true }]);
      error = result.error;
    }

    btn.textContent = 'Guardar producto';
    btn.disabled = false;

    if (error) {
      alert('❌ Error al guardar');
      console.error(error);
      return;
    }

    alert('✅ Producto guardado');
    formProducto.reset();
    document.getElementById('productoId').value = '';
    document.getElementById('formTitulo').textContent = 'Nuevo producto';
    if (imagenPreview) imagenPreview.style.display = 'none';
    if (imagenNombre) imagenNombre.textContent = 'Ningún archivo seleccionado';
    formProducto.style.display = 'none';
    if (btnMostrarForm) btnMostrarForm.style.display = 'block';
    await cargarProductos();
  });

  // ----- Editar producto -----
  window.editarProducto = async function(id) {
    const { data, error } = await window.supabaseClient
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      alert('❌ Error al cargar producto');
      return;
    }

    document.getElementById('productoId').value = data.id;
    document.getElementById('nombre').value = data.nombre || '';
    document.getElementById('categoria').value = data.categoria || '';
    document.getElementById('precio').value = data.precio || '';
    document.getElementById('stock').value = data.stock || '';
    document.getElementById('imagen_url').value = data.imagen_url || '';
    document.getElementById('descripcion').value = data.descripcion || '';

    document.getElementById('formTitulo').textContent = 'Editar producto';
    formProducto.style.display = 'flex';
    if (btnMostrarForm) btnMostrarForm.style.display = 'none';
  };

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

});