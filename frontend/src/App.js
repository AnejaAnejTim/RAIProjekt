import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from "./userContext";
import Header from "./components/Header";
import Login from "./components/Login";
import Index from "./components/Index"
import Register from "./components/Register";
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import Generate from "./components/GenerateShow";
import MyFridge from "./components/MyFridge";
import PrivateRoute from './components/PrivateRoute';
import AddArticles from './components/AddArticles';
function App() {
  /**
   * Podatek o tem, ali je uporabnik prijavljen ali ne, bomo potrebovali v vseh komponentah.
   * State je dosegljiv samo znotraj trenutne komponente. Če želimo deliti spremenljivke z
   * ostalimi komponentami, moramo uporabiti Context.
   * Vsebino Contexta smo definirali v datoteki userContext.js. Poleg objekta 'user', potrebujemo
   * še funkcijo, ki bo omogočala posodabljanje te vrednosti. To funkcijo definiramo v komponenti App
   * (updateUserData). V render metodi pripravimo UserContext.Provider, naš Context je potem dosegljiv
   * v vseh komponentah, ki se nahajajo znotraj tega providerja.
   * V komponenti Login ob uspešni prijavi nastavimo userContext na objekt s trenutno prijavljenim uporabnikom.
   * Ostale komponente (npr. Header) lahko uporabijo UserContext.Consumer, da dostopajo do prijavljenega
   * uporabnika.
   * Context se osveži, vsakič ko osvežimo aplikacijo v brskalniku. Da preprečimo neželeno odjavo uporabnika,
   * lahko context trajno hranimo v localStorage v brskalniku.
   */
  const [user, setUser] = useState(localStorage.user ? JSON.parse(localStorage.user) : null);
  const updateUserData = (userInfo) => {
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  }

  /**
   * Na vrhu vključimo komponento Header, z naslovom in menijem.
   * Nato vključimo Router, ki prikaže ustrezno komponento v odvisnosti od URL naslova.
   * Pomembno je, da za navigacijo in preusmeritve uporabljamo komponenti Link in Navigate, ki sta
   * definirani v react-router-dom modulu. Na ta način izvedemo navigacijo brez osveževanja
   * strani. Klasične metode (<a href=""> in window.location) bi pomenile osvežitev aplikacije
   * in s tem dodatno obremenitev (ponovni izris komponente Header, ponastavitev Contextov,...)
   */
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch('http://localhost:3001/users/profile', {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          updateUserData(data);
        } else {
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (err) {
        console.error("Session check failed:", err);
        localStorage.removeItem('user');
        setUser(null);
      }
    };

    verifySession();
  }, []);


  return (
    <BrowserRouter>
      <UserContext.Provider value={{
        user: user,
        setUserContext: updateUserData
      }}>
        <div className="App">
          <Header title="My Application" />

          <main className="container my-4 flex-grow-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/generate" element={
                <PrivateRoute>
                  <Generate />
                </PrivateRoute>
              } />
              <Route path="/myfridge" element={
                <PrivateRoute>
                  <MyFridge />
                </PrivateRoute>
              } />
              <Route path="/addarticles" element={
                <PrivateRoute>
                  <AddArticles />
                </PrivateRoute>
              } />
            </Routes>
          </main>

        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );

}

export default App;
