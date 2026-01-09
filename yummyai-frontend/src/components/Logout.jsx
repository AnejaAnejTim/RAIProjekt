import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Logout() {
  const userContext = useContext(UserContext);
  const [loggedOut, setLoggedOut] = useState(false); 

  useEffect(() => {
    const logout = async () => {
      try {
        userContext.setUserContext(null);
        const res = await fetch("/users/logout", {
          method: 'GET',
          credentials: 'include', 
        });

        if (!res.ok) {
          console.error("Logout failed:", res.statusText);
        }
        setLoggedOut(true);
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    logout();
  }, [userContext]);

  if (loggedOut) {
    return <Navigate replace to="/" />;
  }
  return <div>Logging out...</div>;
}

export default Logout;
