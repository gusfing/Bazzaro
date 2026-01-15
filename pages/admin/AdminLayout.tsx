import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, User, Bell, Search, Menu } from 'lucide-react';

// Helper to check if script is already loaded
const isScriptLoaded = (src: string) => {
  return document.querySelector(`script[src="${src}"]`);
};

const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    if (isScriptLoaded(src)) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Load Admin CSS
    const cssFiles = [
      '/admin-assets/vendor/swiper/css/swiper-bundle.min.css',
      '/admin-assets/vendor/datatables/css/jquery.dataTables.min.css',
      '/admin-assets/vendor/bootstrap-select/css/bootstrap-select.min.css',
      '/admin-assets/vendor/jqvmap/css/jqvmap.min.css',
      '/admin-assets/css/style.css'
    ];

    const links: HTMLLinkElement[] = [];
    cssFiles.forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.href = href;
        link.rel = 'stylesheet';
        link.className = 'admin-css'; // Marker class to remove later if needed
        document.head.appendChild(link);
        links.push(link);
      }
    });

    // Scripts to load primarily for layout interaction
    // We strictly control the order
    const loadScripts = async () => {
      try {
        await loadScript('/admin-assets/vendor/global/global.min.js');
        await loadScript('/admin-assets/vendor/bootstrap-select/js/bootstrap-select.min.js');
        // Custom scripts - might need distinct loading if they rely on DOM presence
        await loadScript('/admin-assets/js/custom.min.js');
        await loadScript('/admin-assets/js/ic-sidenav-init.js');
      } catch (err) {
        console.error("Failed to load admin scripts", err);
      }
    };

    loadScripts();

    // Cleanup function: Remove admin CSS when leaving admin section to avoid style bleeding
    return () => {
      links.forEach(link => {
        if (link.parentNode) link.parentNode.removeChild(link);
      });
      // Optionally remove scripts, but that's harder and usually unnecessary if they are scoped to DOM elements that disappear.
      // However, forcing a reload might be needed if they pollute global window objects heavily.
    };
  }, []);

  return (
    <div id="main-wrapper" className={`show ${sidebarOpen ? '' : 'menu-toggle'}`}>

      {/* Nav Header */}
      <div className="nav-header">
        <Link to="/admin/dashboard" className="brand-logo">
          {/* Replaced SVG with simplified Text/Logo for now to ensure rendering */}
          <h2 className="text-white text-2xl font-bold m-0 p-0">Bazzaro Admin</h2>
        </Link>
        <div className="nav-control" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <div className={`hamburger ${sidebarOpen ? 'is-active' : ''}`}>
            <span className="line"></span><span className="line"></span><span className="line"></span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="header">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left">
                <div className="dashboard_bar">
                  Dashboard
                </div>
              </div>
              <ul className="navbar-nav header-right">
                <li className="nav-item dropdown notification_dropdown">
                  <a className="nav-link" href="#" role="button" data-bs-toggle="dropdown">
                    <Bell size={20} />
                    <span className="badge badge-primary">0</span>
                  </a>
                </li>
                <li className="nav-item dropdown header-profile">
                  <a className="nav-link" href="#" role="button" data-bs-toggle="dropdown">
                    <img src="/admin-assets/images/user.jpg" width="20" alt="" />
                    <div className="header-info ms-3">
                      <span className="fs-18 font-w500 mb-2">Admin User</span>
                      <small className="fs-12 font-w400">Super Admin</small>
                    </div>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link to="/admin/profile" className="dropdown-item ai-icon">
                      <User className="text-primary" size={18} />
                      <span className="ms-2">Profile </span>
                    </Link>
                    <Link to="/logout" className="dropdown-item ai-icon">
                      <LogOut className="text-danger" size={18} />
                      <span className="ms-2">Logout </span>
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      {/* Sidebar */}
      <div className="ic-sidenav">
        <div className="ic-sidenav-scroll">
          <ul className="metismenu" id="menu">
            <li className={location.pathname === '/admin/dashboard' ? 'mm-active' : ''}>
              <Link to="/admin/dashboard" className="ai-icon" aria-expanded="false">
                <i className="flaticon-home"></i>
                <span className="nav-text">Dashboard</span>
              </Link>
            </li>

            <li className="menu-title">Store Management</li>

            <li className={location.pathname.startsWith('/admin/products') ? 'mm-active' : ''}>
              <Link to="/admin/products" className="ai-icon" aria-expanded="false">
                <i className="flaticon-shopping-bag"></i>
                <span className="nav-text">Products</span>
              </Link>
            </li>

            <li className={location.pathname.startsWith('/admin/orders') ? 'mm-active' : ''}>
              <Link to="/admin/orders" className="ai-icon" aria-expanded="false">
                <i className="flaticon-rocket"></i>
                <span className="nav-text">Orders</span>
              </Link>
            </li>

            <li className={location.pathname.startsWith('/admin/customers') ? 'mm-active' : ''}>
              <Link to="/admin/customers" className="ai-icon" aria-expanded="false">
                <i className="flaticon-user"></i>
                <span className="nav-text">Customers</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Content Body */}
      <div className="content-body">
        <div className="container-fluid">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="copyright">
          <p>Copyright © Designed &amp; Developed by <a href="#" target="_blank">DexignLab</a> 2024</p>
        </div>
      </div>

    </div>
  );
};

export default AdminLayout;