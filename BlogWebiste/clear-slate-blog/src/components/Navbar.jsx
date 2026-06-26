import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${mobileOpen ? 'navbar-mobile-open' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">✍ BlogSpace</Link>

        <div className="navbar-center">
          <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
          {user && <Link to="/write" className={isActive('/write') ? 'active' : ''}>Write</Link>}
          {user && <Link to="/my-posts" className={isActive('/my-posts') ? 'active' : ''}>My Posts</Link>}
          {isAdmin && <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>Admin</Link>}
        </div>

        <div className="navbar-right">
          {user ? (
            <>
              <span className="navbar-user">{user.name}</span>
              {isAdmin && <span className="admin-nav-badge">Admin</span>}
              <button className="navbar-btn navbar-btn--ghost" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"><button className="navbar-btn navbar-btn--ghost">Login</button></Link>
              <Link to="/register"><button className="navbar-btn navbar-btn--primary">Register</button></Link>
            </>
          )}
        </div>

        <button className="navbar-hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}
