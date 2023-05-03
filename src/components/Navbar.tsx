import { getAuth, signOut, updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
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
import { DocumentData, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { useChatContext } from "../Context/ChatContext";

const Navbar = () => {
  const { currentUser } = useAuthContext()!;
  const [editProfile, setEditProfile] = useState(false);
  const { data } = useChatContext()!;

  const handleEditProfile = () => {
    setEditProfile(!editProfile);
  };

  const handlePicture = async(e: any) => {
    const img = e.target.files[0];

    const desertRef = ref(storage, currentUser.photoURL);

// Delete the file
deleteObject(desertRef).then(() => {
  // File deleted successfully
}).catch((error) => {
  // Uh-oh, an error occurred!
});

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


const [docs ,setdocs] = useState<any[]>([])

const updatePicInUserChats = async(documentID:string,combinedId:string) => {
  await updateDoc(doc(db, "userChats",documentID), {
    [combinedId + ".userInfo.photoURL"]: currentUser.photoURL,
  });
}

  useEffect(() => {
    const getDoc = async () => {
      const q = query(collection(db, "userChats"));
      const querySnapshot = await getDocs(q);
      const docsData:any[] = [];
      querySnapshot.forEach((doc) => {
        docsData.push({[doc.id] : doc.data()});
      });
      setdocs(docsData);
    }
    getDoc()

    if(docs){
      for (const obj of docs) {
        const keys = Object.keys(obj);
        for (const key of keys) {
          const nestedObj = obj[key];
          const nestedKeys = Object.keys(nestedObj);
          if(nestedKeys[0].includes(currentUser.uid)){
            for (const nestedKey of nestedKeys) {
              if(nestedObj[nestedKey].userInfo.uid === currentUser.uid){
                updatePicInUserChats(keys[0],nestedKeys[0]) 
              } ;
          }
          }
          
        }
      }
    }

  },[auth.currentUser!.photoURL]) 

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
