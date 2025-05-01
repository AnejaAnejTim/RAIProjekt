import { useContext } from "react";
import { UserContext } from "../userContext";
import { Link } from "react-router-dom";

const Header = ({ title }) => {
  const { user } = useContext(UserContext);

  return (
    <header className="bg-light text-black shadow-sm">
        <div className="container d-flex justify-content-between align-items-center py-3">
            <h1 className="h4 m-0">YummyAI</h1>
            <nav>
              <ul className="nav">
                <li className="nav-item">
                  <Link to="/" className="nav-link ">Home</Link>
                </li>
                {user ? (
                  <>
                    <li className="nav-item">
                      <Link to="/publish" className="nav-link ">Publish</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/profile" className="nav-link">Profile</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/logout" className="nav-link">Logout</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link to="/login" className="nav-link">Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/register" className="nav-link">Register</Link>
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

