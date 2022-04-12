import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { MainContext } from "./context/mainContext";
import { useState } from "react";
import Toolbar from "./components/Toolbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TopicPage from "./pages/TopicPage";
import FavoritesPage from "./pages/FavoritesPage";
import Profile from "./pages/Profile";


export default function App() {
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("favorites") !== null) {
      setFavorites(JSON.parse(localStorage.getItem("favorites")));
    }
  }, []);

  return (
    <MainContext.Provider
      value={{
        user,
        setUser,
        topics,
        setTopics,
        favorites,
        setFavorites,
        notifications,
        setNotifications,
      }}
    >
      <BrowserRouter>
        <Toolbar />
        <Routes>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/" element={<Home />} />
          <Route exact path="/topic/:id" element={<TopicPage />}></Route>
          <Route exact path="/favorites" element={<FavoritesPage />}></Route>
          <Route exact path="/profile" element={<Profile />}></Route>
        </Routes>
      </BrowserRouter>
    </MainContext.Provider>
  );
}
