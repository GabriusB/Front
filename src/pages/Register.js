import { useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";


function Register() {
  const username = useRef();
  const passwordOne = useRef();
  const passwordTwo = useRef();

  const [cookies] = useCookies(["cookie-name"]);
  const nav = useNavigate();

  const generateError = (error) =>
    toast.error(error, {
      position: "top-center",
      theme: "colored",
    });
  const handleSubmit = async (event) => {
    event.preventDefault();

    const inputs = {
      username: username.current.value,
      passwordOne: passwordOne.current.value,
      passwordTwo: passwordTwo.current.value,
    };

    if (inputs.username.length > 15 || inputs.username.length < 5) {
      generateError("Username length has to be between 5-15 characters");
      return;
    }
    if (inputs.passwordOne.length > 20 || inputs.passwordOne.length < 5) {
      generateError("Password length has to be between 5-20 characters");
      return;
    }
    if (inputs.passwordOne !== inputs.passwordTwo) {
      generateError("Passwords must match");
      return;
    }

    const { data } = await axios.post(
      "http://localhost:4000/register",
      {
        ...inputs,
      },
      { withCredentials: true }
    );
    if (!data.success) {
      generateError(data.message);
    } else {
      nav("/login");
    }
  };
  return (
    <div className="login-form-container">
      <h2 className="login-text">Create New Account</h2>
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
              ref={passwordOne}
              type="password"
              placeholder="Password"
              name="password"
            />
          </div>

          <div className="d-flex column gap-2">
            <label htmlFor="password">Repeat Password</label>
            <input
              className="input"
              ref={passwordTwo}
              type="password"
              placeholder="Repeat Password"
              name="password"
            />
          </div>
          <div className="d-flex column">
            <button type="submit" className="login-btn">
              Submit
            </button>
            <span>
              Already have an account ?
              <Link className="link-text" to="/login">
                {" "}
                Login{" "}
              </Link>
            </span>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;
