import { signOut } from "firebase/auth";
import  { useState, useRef } from "react";
import { auth, db, storage } from "../firebase";
import { useAuthContext } from "../Context/AuthContext";
import { ChangePicture } from "./ChangePicture";
import userPic from "../assets/user.jpg"
import Notiflix from "notiflix";



const Navbar = () => {
  const { currentUser } = useAuthContext()!;
  const [editProfile, setEditProfile] = useState(false)


  const handleEditProfile = () => {
    setEditProfile(!editProfile);
    
  };

  const logout = () => {
    Notiflix.Confirm.show(
      "Logout",
      "You are about to logout?",
      "Logout",
      "Cancel",
      function okCb() {
        signOut(auth)
      },
      function cancelCb() {
        console.log("cancel");
      },
      {
        width: "320px",
        borderRadius: "8px",
        titleColor: "#5d5b8d",
        okButtonBackground: "#8daff1",
        cssAnimationStyle: "zoom",
      }
    );
  };

 

  return (
    <>  
      <ChangePicture setEditProfile={setEditProfile} editProfile={editProfile}/>
      <div className="navbar">
        {/* <span className="logo">Chat Name</span> */}
        <div className="user">
          {currentUser.photoURL ? <img src={currentUser.photoURL} alt="" onClick={handleEditProfile} />: <img src={userPic}/>}
          
          <div className="user-info">
            <span>{currentUser.displayName}</span>
            <button onClick={logout}>Logout</button>
            {/* <BsThreeDotsVertical className="setting" size={90}/> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
