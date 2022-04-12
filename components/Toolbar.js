import React from "react";
import { MainContext } from "../context/mainContext";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { BsFillEmojiHeartEyesFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";

const Toolbar = () => {
  const nav = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const { pathname } = useLocation();
  const { user, setUser, favorites, notifications, topics } =
    useContext(MainContext);

  const logOut = () => {
    removeCookie("jwt");
    setUser(null);
    nav("/login");
    window.location.reload(true);
  };

  return (
    <div className="toolbar-container ">
      {user && (
        <div className={user ? "toolbar space-btw" : "toolbar justify-end"}>
          <div className="d-flex align-center gap-10">
            <div className="toolbar-user">Hello, {user.username}</div>
            <div
              onClick={() => nav("/profile")}
              className="notification-container d-flex align-center"
            >
              <IoMdNotifications fontSize={24} />
              {notifications > 0 && <span>{notifications}</span>}
            </div>
          </div>

          <div className="d-flex">
            {pathname === "/" ? (
              <>
                <Link
                  to="/favorites"
                  className="toolbar-favorites-btn d-flex align-center"
                >
                  <div style={{ fontSize: 20, color: "#f1f1f1" }}>
                    <span className="d-none">Favorites</span>
                    {favorites.length > 0 && <span> {favorites.length}</span>}
                  </div>
                  <BsFillEmojiHeartEyesFill />
                </Link>
                <Link
                  to="/profile"
                  className="toolbar-btn d-flex align-center gap-10"
                >
                  <div className="d-none">Profile</div>
                  <FaUserCircle />
                </Link>
                <button
                  onClick={logOut}
                  className="toolbar-btn d-flex align-center gap-10"
                >
                  <div className="d-none">Log out</div>
                  <AiOutlineLogout fontSize={24} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="toolbar-favorites-btn d-flex align-center"
                >
                  <div style={{ fontSize: 20, color: "#f1f1f1" }}>Home</div>
                </Link>
                <Link
                  to="/favorites"
                  className="toolbar-favorites-btn d-flex align-center"
                >
                  <div style={{ fontSize: 20, color: "#f1f1f1" }}>
                    <span className="d-none">Favorites</span>
                    {favorites.length > 0 && <span> {favorites.length}</span>}
                  </div>
                  <BsFillEmojiHeartEyesFill />
                </Link>
                <Link
                  to="/profile"
                  className="toolbar-btn d-flex align-center gap-10"
                >
                  <div className="d-none">Profile</div>
                  <FaUserCircle />
                </Link>
                <button
                  onClick={logOut}
                  className="toolbar-btn d-flex align-center gap-10"
                >
                  <div className="d-none">Log out</div>
                  <AiOutlineLogout fontSize={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {!user && (
        <div className={user ? "toolbar space-btw" : "toolbar justify-end"}>
          {pathname === "/" ? (
            <>
              <Link
                to="/favorites"
                className="toolbar-favorites-btn d-flex align-center"
              >

                <div style={{ fontSize: 20, color: "#f1f1f1" }}>
                  <span className="d-none">Favorites</span>
                  {favorites.length > 0 && <span> {favorites.length}</span>}
                </div>
                <BsFillEmojiHeartEyesFill />
              </Link>
              <Link to="/login" className="toolbar-btn">
                Login
              </Link>
              <Link to="/register" className="toolbar-btn">
                Register
              </Link>

            </>
          ) : (
            <>
              <Link
                to="/"
                className="toolbar-favorites-btn d-flex align-center"
              >
                <div style={{ fontSize: 20, color: "#f1f1f1" }}>Home</div>
              </Link>
              <Link
                to="favorites"
                className="toolbar-favorites-btn d-flex align-center"
              >
                <div style={{ fontSize: 20, color: "#f1f1f1" }}>
                  <span className="d-none">Favorites</span>
                  {favorites.length > 0 && <span> {favorites.length}</span>}
                </div>
                <BsFillEmojiHeartEyesFill />
              </Link>
              <Link to="/login" className="toolbar-btn">
                Login
              </Link>
              <Link to="/register" className="toolbar-btn">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Toolbar;
