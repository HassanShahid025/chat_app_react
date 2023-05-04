import { signOut } from "firebase/auth";
import  { useState } from "react";
import { auth, db, storage } from "../firebase";
import { useAuthContext } from "../Context/AuthContext";
import { ChangePicture } from "./ChangePicture";
import userPic from "../assets/user.jpg"


const Navbar = () => {
  const { currentUser } = useAuthContext()!;
  const [editProfile, setEditProfile] = useState(false);

  const handleEditProfile = () => {
    setEditProfile(!editProfile);
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
            <button onClick={() => signOut(auth)}>Logout</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
