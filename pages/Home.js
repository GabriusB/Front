import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { MainContext } from "../context/mainContext";
import Topics from "../components/Topics";
import Modal from "../components/Modal";


export default function Home() {
  const [cookies, setCookie, removeCookie] = useCookies([]);

  const { user, setUser, setNotifications } = useContext(MainContext);

  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
      } else {
        const { data } = await axios.post(
          "http://localhost:4000",
          {},
          {
            withCredentials: true,
          }
        );
        console.log(data);
        if (!data.status) {
          setUser(null);
          removeCookie("jwt");
        } else {
          setUser(data.user);
          setNotifications(data.notifications);
        }
      }
    };
    verifyUser();
  }, [cookies, navigate, removeCookie]);

  return (
    <>
      {user && <Modal />}
      <Topics />
      <ToastContainer />
    </>
  );
}
