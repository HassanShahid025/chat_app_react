import { getAuth, signOut, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth, storage } from "../firebase";
import { useAuthContext } from "../Context/AuthContext";
import { BsArrowLeftShort } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { AiFillCamera } from "react-icons/ai";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-toastify";

const Navbar = () => {
  const { currentUser } = useAuthContext()!;
  const [editProfile, setEditProfile] = useState(false);

  const handleEditProfile = () => {
    setEditProfile(!editProfile);
  };

  const handlePicture = async(e: any) => {
    const img = e.target.files[0];
    const userImg = ref(storage, currentUser.photoURL);
    deleteObject(userImg);

    // //handling firebase storage
    // const date = new Date().getTime();
    // const storageRef = ref(storage, `${currentUser.displayName + date}`);

    // const uploadTask = uploadBytesResumable(storageRef, img);
    // uploadTask.on(
    //   "state_changed",
    //   (snapshot) => {
    //     const progress =
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     console.log("Upload is " + progress + "% done");
    //     switch (snapshot.state) {
    //       case "paused":
    //         console.log("Upload is paused");
    //         break;
    //       case "running":
    //         console.log("Upload is running");
    //         break;
    //     }
    //   },
    //   (error) => {},
    //   () => {
    //     getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
    //       await updateProfile(currentUser, {
    //         ...currentUser,
    //         photoURL: downloadURL,
    //       });
    //     });
    //   }
    // );

    try {
      //handling firebase storage
      const date = new Date().getTime();
      const storageRef = ref(storage, `${currentUser.displayName + date}`);

      const uploadTask = uploadBytesResumable(storageRef, img);
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
              const auth = getAuth()
              await updateProfile(auth.currentUser!, {
                ...auth.currentUser, 
                photoURL: downloadURL
              }).then(() => {
                // Profile updated!
                // ...
              }).catch((error) => {
                // An error occurred
                // ...
              });
          
            }
          );
        }
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <input
        type="file"
        name="image"
        id="file"
        accept="image/*"
        placeholder="Product Image"
        onChange={(e) => handlePicture(e)}
        style={{ display: "none" }}
      />

      <div className={`profile ${editProfile ? "show" : ""}`}>
        <div className="profile-header">
          <BsArrowLeftShort
            size={40}
            onClick={handleEditProfile}
            className="arrow"
          />
          <p>Profile</p>
        </div>
        <div className="profile-info">
          <div className="user-img">
            <label htmlFor="file" className="label">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="" />
              ) : (
                <FaUserAlt color="white" size={130} />
              )}
              <span>
                <AiFillCamera color="white" size={40} />
                <p>{currentUser.photoURL ? "CHANGE" : "ADD"} PROFILE PHOTO</p>
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="navbar">
        {/* <span className="logo">Chat Name</span> */}
        <div className="user">
          <img src={currentUser.photoURL} alt="" onClick={handleEditProfile} />
          <div className="user-info">
            <p>{currentUser.displayName}</p>
            <button onClick={() => signOut(auth)}>Logout</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
