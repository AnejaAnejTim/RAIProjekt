import { useContext } from "react";
import { UserContext } from "../userContext";
import { Link } from "react-router-dom";

const Header = ({ title }) => {
  const { user } = useContext(UserContext);

  return (
    <header style={{backgroundColor: "#b0d16b", color: "white" }} className="shadow-sm">
        <div className="container d-flex justify-content-between align-items-center py-3">
          <div className="d-flex align-items-center">
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: "50px", height: "50px", objectFit: "contain" }}
            className="me-1"
          />
          <h1 className="h4 m-0">YummyAI</h1>
        </div>
            <nav>
              <ul className="nav">
                <li className="nav-item">
                  <Link to="/" className="nav-link text-white text-decoration-none">Domov</Link>
                </li>
                {user ? (
                  <>
                    <li className="nav-item">
                      <Link to="/publish" className="nav-link text-white text-decoration-none">Generiraj</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/profile" className="nav-link text-white text-decoration-none">Moj profil</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/logout" className="nav-link text-white text-decoration-none">Odjava</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link to="/login" className="nav-link text-white text-decoration-none">Prijava</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/register" className="nav-link text-white text-decoration-none">Registracija</Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </header>
      );
    };

    export default Header;

