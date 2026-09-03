import { NavLink } from 'react-router-dom';

function AppHeader() {
  const linkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div>
          <p className="eyebrow">ENGSE203 • LAB 05</p>
          <p className="brand">Campus Service Request</p>
        </div>
        <nav>
          <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/requests/new" className={linkClass}>New Request</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default AppHeader;