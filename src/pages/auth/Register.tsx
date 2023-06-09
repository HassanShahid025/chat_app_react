import { useEffect, useState } from "react";
import style from "./auth.module.scss";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { BsCardImage } from "react-icons/bs";
import Input from "../../components/inputField/InputField";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import {
  UploadTask,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import userPic from "../../assets/user.jpg";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [img, setImg] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate();
  const [userNameTaken, setUserNameTaken] = useState(false);

  const getUsers = async () => {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const docsData: any[] = [];
    querySnapshot.forEach((doc) => {
      docsData.push(doc.data().displayName);
    });
    setUsers(docsData);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const isPasswordValid = password.length >= 6;

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImg(event.target.files[0]);
    }
  };

  const registerUser = async (e: any) => {
    setUserNameTaken(false);
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
    }
    if (users.includes(userName)) {
      setUserNameTaken(true);
    } else {
      setLoading(true);
      try {
        //Creating user
        const res = await createUserWithEmailAndPassword(auth, email, password);

        if (img) {
          //handling firebase storage
          const date = new Date().getTime();
          const storageRef = ref(storage, `${userName + date}`);
          const uploadTask = uploadBytesResumable(storageRef, img);

          uploadTask!.on(
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
            (error: any) => {
              toast.error(error.message);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(
                  uploadTask!.snapshot.ref
                );
                await updateProfile(res.user, {
                  displayName: userName,
                  photoURL: downloadURL,
                });
                //Creating user in firestore
                await setDoc(doc(db, "users", res.user.uid), {
                  uid: res.user.uid,
                  displayName: userName,
                  email,
                  photoURL: downloadURL,
                });
                // Creating userChats in firestore
                setDoc(doc(db, "userChats", res.user.uid), {});
                setLoading(false)
                navigate("/login");
              } catch (error: any) {
                console.error(error);
                toast.error(error.message);
              }
            }
          );
        } 

        else {
              try {
                const imgRef = ref(storage, "user.jpg");
                const downloadURL = await getDownloadURL(
                  imgRef
                );
                await updateProfile(res.user, {
                  displayName: userName,
                  photoURL: downloadURL,
                });
                //Creating user in firestore
                await setDoc(doc(db, "users", res.user.uid), {
                  uid: res.user.uid,
                  displayName: userName,
                  email,
                  photoURL: downloadURL,
                });
                // Creating userChats in firestore
                setDoc(doc(db, "userChats", res.user.uid), {});
                setLoading(false)
                navigate("/login");
              } catch (error: any) {
                console.error(error);
                toast.error(error.message);
              }   
        }

      } catch (error: any) {
        setLoading(false);
        console.error(error);
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
              value={userName}
              label="Username"
              type="text"
              setProperty={setUserName}
            />
            {userNameTaken && (
              <p className={`${style["warning-text"]}`}>
                This username has already taken. Try another
              </p>
            )}
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
              onChange={handleImageSelect}
              style={{ display: "none" }}
            />
            <label htmlFor="file" className={style["image-upload"]}>
              <BsCardImage size={30} color="#8daff1" />
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
