import {useContext, useState} from "react";
import {UserContext} from "../userContext";
import {Link} from "react-router-dom";

const Header = () => {
  const {user} = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header style={{backgroundColor: "#b0d16b", color: "white"}} className="shadow-sm">
      <div className="container d-flex justify-content-between align-items-center py-3">
        {/* Logo + naslov */}
        <div className="d-flex align-items-center">
          <img
            src="/logo.png"
            alt="logo"
            style={{width: "50px", height: "50px", objectFit: "contain"}}
            className="me-2"
          />
          <Link to="/" className="nav-link text-white text-decoration-none">
            <h1 className="h4 m-0 d-flex align-items-center"> YummyAI</h1>
          </Link>
        </div>
        <button
          className="navbar-toggler d-md-none"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarToggleExternalContent"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list" style={{fontSize: "1.5rem", color: "white"}}></i>
        </button>

        <nav className="d-none d-md-block">
          <ul className="nav">
            <li className="nav-item">
              <Link to="/" className="nav-link text-white text-decoration-none">Home</Link>
            </li>
            {user ? (
              <>
                <li className="nav-item"><Link to="/myfridge" className="nav-link text-white">Moj hladilnik</Link></li>
                <li className="nav-item"><Link to="/favorites" className="nav-link text-white">Moji recepti</Link></li>
                <li className="nav-item"><Link to="/generate" className="nav-link text-white">Generiraj</Link></li>
                <li className="nav-item"><Link to="/recipes" className="nav-link text-white">Recepti</Link></li>
                <li className="nav-item"><Link to="/profile" className="nav-link text-white">Profile</Link></li>
                <li className="nav-item"><Link to="/logout" className="nav-link text-white">Logout</Link></li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link to="/login" className="nav-link text-white">Login</Link></li>
                <li className="nav-item"><Link to="/register" className="nav-link text-white">Register</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
      {menuOpen && (
        <div id="navbarToggleExternalContent" className="d-md-none p-3" style={{backgroundColor: "#b0d16b"}}>
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link to="/" onClick={closeMenu} className="nav-link text-white text-decoration-none">Home</Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link to="/myfridge" onClick={closeMenu} className="nav-link text-white text-decoration-none">Moj
                    hladilnik</Link>
                </li>
                <li className="nav-item">
                  <Link to="/generate" onClick={closeMenu}
                        className="nav-link text-white text-decoration-none">Generiraj</Link>
                </li>
                <li className="nav-item">
                  <Link to="/recipes" onClick={closeMenu}
                        className="nav-link text-white text-decoration-none">Recepti</Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" onClick={closeMenu}
                        className="nav-link text-white text-decoration-none">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link to="/logout" onClick={closeMenu}
                        className="nav-link text-white text-decoration-none">Logout</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" onClick={closeMenu}
                        className="nav-link text-white text-decoration-none">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" onClick={closeMenu}
                        className="nav-link text-white text-decoration-none">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
