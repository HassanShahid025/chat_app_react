import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import { useAuthContext } from "../Context/AuthContext";
import { BsArrowLeftShort } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { AiFillCamera } from "react-icons/ai";

const Navbar = () => {
  const { currentUser } = useAuthContext()!;
  const [editProfile,setEditProfile] = useState(false)
  
  const handleEditProfile = () => {
    setEditProfile(!editProfile)
  }
  return (
    <>
    <div className={`profile ${editProfile ? "show" : ""}`}>
      <div className="profile-header">
      <BsArrowLeftShort size={40} onClick={handleEditProfile} className="arrow"/>
      <p>Profile</p>
      </div>
      <div className="profile-info">
        <div className="user-img">
          <FaUserAlt color="white" size={85}/>
        <span>
          <AiFillCamera color="white" size={20}/>
          <p>ADD PROFILE PHOTO</p>
        </span>
      </div>
        </div>
    </div>
      <div className="navbar">
      {/* <span className="logo">Chat Name</span> */}
      <div className="user">
        <img src={currentUser.photoURL} alt="" onClick={handleEditProfile}/>
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
