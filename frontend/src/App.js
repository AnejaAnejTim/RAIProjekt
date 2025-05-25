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
import Recipe from './components/RecipeShow';
import Recipes from './components/Recipes';
import RecipeHistory from "./components/RecipeHistory";

function App() {

  const [user, setUser] = useState(localStorage.user ? JSON.parse(localStorage.user) : null);
  const updateUserData = (userInfo) => {
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  }

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
              <Route path="/recipe/:id" element={
                  <Recipe />
              } />
              <Route path="/recipehistory" element={
                       <PrivateRoute>
                         <RecipeHistory />
                       </PrivateRoute>
                     } />
              <Route path="recipes" element={
                <Recipes/>
              }
                />
            </Routes>
          </main>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );

}

export default App;
