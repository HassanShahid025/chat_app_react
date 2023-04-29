import { useState } from "react";
import style from "./auth.module.scss";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { BsCardImage } from "react-icons/bs";
import Input from "../../components/inputField/InputField";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isPasswordValid = password.length >= 6;

  const registerUser = async (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords donot match.");
    } else {
      setLoading(true);
      const file = e.target[4].files[0];
      try {
        //Creating user
        const res = await createUserWithEmailAndPassword(auth, email, password);

        //handling firebase storage
        const date = new Date().getTime();
        const storageRef = ref(storage, `${fullName + date}`);

        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            toast.error(error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await updateProfile(res.user, {
                  displayName: fullName,
                  photoURL: downloadURL,
                });
                //Creating user in firestore
                await setDoc(doc(db, "users", res.user.uid), {
                  uid: res.user.uid,
                  displayName: fullName,
                  email,
                  photoURL: downloadURL,
                });
                // Creating userChats in firestore
                setDoc(doc(db, "userChats", res.user.uid), {});
                navigate("/login");
              }
            );
          }
        );
      } catch (error: any) {
        toast.error(error.message);
      }
    }
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
                  ? style["warning-text"]
                  : style.hide
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
            <p>Already have an account? </p>
            <Link to="/login"> Login</Link>
          </span>
        </div>
      </section>
    </>
  );
};

export default Register;
