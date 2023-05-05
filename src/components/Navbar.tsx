import { signOut } from "firebase/auth";
import  { useState, useRef } from "react";
import { auth, db, storage } from "../firebase";
import { useAuthContext } from "../Context/AuthContext";
import { ChangePicture } from "./ChangePicture";
import userPic from "../assets/user.jpg"
import Notiflix from "notiflix";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useChatContext } from "../Context/ChatContext";


const Navbar = () => {
  const { currentUser } = useAuthContext()!;
  const [editProfile, setEditProfile] = useState(false)


  const handleEditProfile = () => {
    setEditProfile(!editProfile);
    
  };

  const logout = () => {
    Notiflix.Confirm.show(
      "Delete Product",
      "You are about to delete this product?",
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
        titleColor: "#f7c17b",
        okButtonBackground: "#f7c17b",
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
            <p>{currentUser.displayName}</p>
            <button onClick={logout}>Logout</button>
            {/* <BsThreeDotsVertical className="setting" size={90}/> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
