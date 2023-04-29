import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import style from "./auth.module.scss";
import { auth } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/loader/Loader";
import { Link } from "react-router-dom";
import InputFieled from "../../components/inputField/InputField";

const Reset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = (e: any) => {
    e.preventDefault();
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false);
        toast.success("Reset link send to your email.");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
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
          <h2>Reset Password</h2>
          <form onSubmit={resetPassword}>
           {/* {Email field} */}
           <InputFieled
              value={email}
              label="Email"
              type="email"
              setProperty={setEmail}
            />
            <button className="--btn --btn-primary --btn-block" type="submit">
              Reset Password
            </button>
            <div className="links">
              <p>
                <Link to="/login">- Login</Link>
              </p>
              <p>
                <Link to="/register">- Register</Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Reset;
