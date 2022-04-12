import React, { useContext, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import { MainContext } from "../context/mainContext";

function Login() {
  const { setUser } = useContext(MainContext);
  const [cookies] = useCookies([]);
  const navigate = useNavigate();
  const username = useRef();
  const password = useRef();


  const generateError = (error) =>
    toast.error(error, {
      position: "top-center",
      theme: "colored",
    });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const inputs = {
      username: username.current.value,
      password: password.current.value,
    };

    if (inputs.username.length > 15 || inputs.username.length < 5) {
      generateError("Username length has to be between 5-15 characters");
      return;
    }
    if (inputs.password.length > 20 || inputs.password.length < 5) {
      generateError("Password length has to be between 5-20 characters");
      return;
    }

    const { data } = await axios.post(
      "http://localhost:4000/login",
      {
        ...inputs,
      },
      { withCredentials: true }
    );
    if (data.success) {
      setUser(data.user);
      navigate("/");
    } else {
      generateError(data.message);
    }
  };
  return (
    <div className="login-form-container">
      <h2 className="login-text">Login to your Account</h2>
      <div className="login-form">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="d-flex column gap-2">
            <label htmlFor="username">Username</label>
            <input
              className="input"
              ref={username}
              type="text"
              name="username"
              placeholder="Username"
            />
          </div>
          <div className="d-flex column gap-2">
            <label htmlFor="password">Password</label>
            <input
              className="input"
              ref={password}
              type="password"
              placeholder="Password"
              name="password"
            />
          </div>
          <div className="d-flex column">
            <button type="submit" className="login-btn">
              Submit
            </button>
            <span>
              Don't have an account ?
              <Link className="link-text" to="/register">
                {" "}
                Register{" "}
              </Link>
            </span>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
