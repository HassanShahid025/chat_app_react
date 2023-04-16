import { useState } from "react";
import style from "./auth.module.scss";
import { ToastContainer } from "react-toastify";
import Loader from "../../components/loader/Loader";
import registerImg from "../../assets/register.jpg";
import { Link } from "react-router-dom";
import { BsCardImage } from "react-icons/bs";
import Input from "../../components/input/Input";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isPasswordValid = password.length >= 6;

  const registerUser = () => {};

  const handleImageChange = (e: any) => {};

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
          <h2>Register</h2>
          <form onSubmit={registerUser}>
            {/* {Full Name field} */}
            <Input
              value={fullName}
              label="Full Name"
              type="text"
              setProperty={setFullName}
            />
            {/* {Email field} */}
            <Input
              value={email}
              label="Email"
              type="email"
              setProperty={setEmail}
            />
            {/* {Password field} */}
            <Input
              value={password}
              label="Password"
              type="password"
              setProperty={setPassword}
            />
            {/* {confirm Password field} */}
            <p
              className={
                password.length <= 5 && password.length > 0
                  ? "warning-text"
                  : "hide"
              }
            >
              Minimum 6 characters.
            </p>
            <Input
              value={confirmPassword}
              label="Confirm Password"
              type="password"
              setProperty={setConfirmPassword}
            />
            <input
              type="file"
              name="image"
              id="file"
              accept="image/*"
              placeholder="Product Image"
              onChange={(e) => handleImageChange(e)}
              style={{ display: "none" }}
            />
            <label htmlFor="file" className={style["image-upload"]}>
              <BsCardImage size={30} color="#88428d" />
              <span>Add an avatar</span>
            </label>
            <button
              type="submit"
              className="--btn --btn-primary --btn-block"
              disabled={!isPasswordValid}
            >
              Register
            </button>
          </form>
          <span className={style.register}>
            <p>Already have an account?</p>
            <Link to="/login">Login</Link>
          </span>
        </div>
      </section>
    </>
  );
};

export default Register;
