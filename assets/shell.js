// ORIOLE — shared shell injector for mockups
// Usage:
//   <body data-active="dashboard" data-title="Dashboard">
//   <script src="../assets/shell.js"></script>  (or "assets/shell.js" at root)

(function () {
  const items = [
    { group: 'Principal' },
    { id: 'dashboard',  label: 'Dashboard',     href: 'dashboard.html' },
    { id: 'notifications', label: 'Notificaciones', href: 'notifications/center.html' },
    { group: 'Catálogo' },
    { id: 'books',      label: 'Libros',        href: 'catalog/books.html' },
    { id: 'authors',    label: 'Autores',       href: 'catalog/authors.html' },
    { id: 'publishers', label: 'Editoriales',   href: 'catalog/publishers.html' },
    { id: 'categories', label: 'Categorías',    href: 'catalog/categories.html' },
    { id: 'barcodes',   label: 'Etiquetas / códigos', href: 'catalog/barcodes.html' },
    { group: 'Compras' },
    { id: 'purchase-orders', label: 'Órdenes de compra', href: 'purchases/list.html' },
    { id: 'suppliers',  label: 'Proveedores',   href: 'purchases/suppliers.html' },
    { group: 'Inventario' },
    { id: 'stock',      label: 'Stock',         href: 'inventory/stock.html' },
    { id: 'movements',  label: 'Movimientos',   href: 'inventory/movements.html' },
    { id: 'warehouses', label: 'Bodegas',       href: 'inventory/warehouses.html' },
    { id: 'kardex',     label: 'Kardex',        href: 'inventory/kardex.html' },
    { id: 'physical-count', label: 'Inventario físico', href: 'inventory/physical-count.html' },
    { id: 'replenishment', label: 'Reabastecimiento', href: 'inventory/replenishment.html' },
    { group: 'Análisis' },
    { id: 'reports',    label: 'Reportes',      href: 'reports/index.html' },
    { id: 'audit',      label: 'Auditoría',     href: 'audit.html' },
    { group: 'Administración' },
    { id: 'tenants',    label: 'Empresas',      href: 'companies.html' },
    { id: 'users',      label: 'Usuarios',      href: 'users/list.html' },
    { id: 'roles',      label: 'Roles y permisos', href: 'users/roles.html' },
    { id: 'settings',   label: 'Configuración', href: 'settings.html' },
  ];

  const body = document.body;
  const active = body.getAttribute('data-active');
  const title  = body.getAttribute('data-title') || 'ORIOLE';

  // depth: how many ../ we need to reach mockups root
  const depth = parseInt(body.getAttribute('data-depth') || '0', 10);
  const base  = depth === 0 ? '' : '../'.repeat(depth);

  // Build sidebar
  let nav = '';
  items.forEach(it => {
    if (it.group) {
      nav += `<div class="group">${it.group}</div>`;
    } else {
      const cls = it.id === active ? 'active' : '';
      nav += `<a class="${cls}" href="${base}${it.href}">${it.label}</a>`;
    }
  });

  const hamburgerIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
  const closeIcon    = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  const shell = `
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    <aside class="sidebar" id="appSidebar">
      <a class="brand" href="${base}index.html">ORIOLE</a>
      <nav>${nav}</nav>
    </aside>
    <header class="topbar">
      <div>
        <button class="hamburger" id="menuToggle" aria-label="Abrir menú" aria-expanded="false">
          ${hamburgerIcon}
        </button>
        <strong>${title}</strong>
      </div>
      <div class="user">
        <label class="tenant-switch" aria-label="Empresa activa">
          <span>Empresa</span>
          <select>
            <option>Editorial Demo</option>
            <option>Oriole Académica</option>
            <option>Distribuidora Norte</option>
          </select>
        </label>
        <span class="avatar">AD</span>
        <span>Admin</span>
      </div>
    </header>
  `;

  // Wrap existing body content into <main class="main">
  const mainContent = body.innerHTML;
  body.classList.add('app');
  body.innerHTML = shell + `<main class="main">${mainContent}</main>`;

  // Mobile drawer logic
  const sidebar  = document.getElementById('appSidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const toggle   = document.getElementById('menuToggle');

  function openDrawer() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.innerHTML = closeIcon;
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = hamburgerIcon;
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  overlay.addEventListener('click', closeDrawer);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) closeDrawer();
  });

  // Close drawer on nav link click (already navigating away, but cleans up state)
  sidebar.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
})();
