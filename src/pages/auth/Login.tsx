import { useState } from "react";
import style from "./auth.module.scss";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/loader/Loader";
import loginImg from "../../assets/login.jpg";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import Input from "../../components/input/Input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const loginUser = () => {};

  const signInWithGoogle = () => {};

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
            <Input value={email} label="Email" type="email" setProperty={setEmail}/>
            {/* {Pasword field} */}
            <Input value={password} label="Password" type="password" setProperty={setPassword}/>

            <button type="submit" className="--btn --btn-primary --btn-block">
              Login
            </button>
            <div className="links">
              <Link to="/reset">Reset Password</Link>
            </div>
            <p>-- or --</p>
          </form>
          <button
            className="--btn --btn-primary --btn-block"
            onClick={signInWithGoogle}
          >
            <FaGoogle color="#fff" /> Login With Google
          </button>
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
