import { useState } from "react";
import style from "./auth.module.scss";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/loader/Loader";
import { Link, useNavigate } from "react-router-dom";

import InputField from "../../components/inputField/InputField";
import { signInWithEmailAndPassword, } from "firebase/auth";
import { auth } from "../../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const loginUser = (e:any) => {
    e.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        setLoading(false);
        toast.success("Login Successful");
        navigate("/")
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  return (
    <>
      <ToastContainer />
      {loading && (
        <div className="loading-container">
          <Loader />
        </div>
      )}
      <section className={`container ${style.auth}`}>
        <div className={style.form}>
          <h2>Login</h2>
          <form onSubmit={loginUser}>
            {/* {Email field} */}
            <InputField
              value={email}
              label="Email"
              type="email"
              setProperty={setEmail}
            />
            {/* {Pasword field} */}
            <InputField
              value={password}
              label="Password"
              type="password"
              setProperty={setPassword}
            />

            <button type="submit" className="--btn --btn-primary --btn-block">
              Login
            </button>
            <div className="links">
              <Link to="/reset">Reset Password</Link>
            </div>
            <p>-- or --</p>
          </form>
          <span className={style.register}>
            <p>Don't have a account?</p>
            <Link to="/register">Register</Link>
          </span>
        </div>
      </section>
    </>
  );
};

export default Login;
