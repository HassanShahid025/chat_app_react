import { BsArrowLeftShort } from "react-icons/bs"
import { useAuthContext } from "../Context/AuthContext";
import { FaUserAlt } from "react-icons/fa";
import { AiFillCamera } from "react-icons/ai";
import {useState,useEffect} from 'react'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { updateProfile } from "firebase/auth";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";

interface IChangePicture{
    setEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
    editProfile: boolean
};


export const ChangePicture = ({setEditProfile,editProfile,}:IChangePicture) => {
    const [docs ,setdocs] =  useState<any[]>([])
    const { currentUser } = useAuthContext()!;

    const handleEditProfile = () => {
        setEditProfile(!editProfile);
      }

    const updatePicInUserChats = async(documentID:string,combinedId:string) => {
      await updateDoc(doc(db, "userChats",documentID), {
        [combinedId + ".userInfo.photoURL"]: currentUser.photoURL,
      });
     }

     const handlePicFirebase = async()=>{
        await updateDoc(doc(db, "users",currentUser.uid), {
          photoURL: currentUser.photoURL,
        });

        const q = query(collection(db, "userChats"));
            const querySnapshot = await getDocs(q);
            const docsData:any[] = [];
            querySnapshot.forEach((doc) => {
              docsData.push({[doc.id] : doc.data()});
            });
            setdocs(docsData);
        }

        useEffect(() => {
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
                      console.log("function activated")
                    } ;
                }
                }
                
              }
            }
          }
        },[docs])
      

    const handlePicture = async(e: any) => {
        const img = e.target.files[0];
    
        const desertRef = ref(storage, currentUser.photoURL);
    
        // Delete the file
        deleteObject(desertRef).then(() => {
          // File deleted successfully
        }).catch((error) => {
          console.log(error.message)
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
              console.log(error.message);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(
                async (downloadURL) => {
                  await updateProfile(auth.currentUser!, {
                    ...auth.currentUser, 
                    photoURL: downloadURL
                  }).then(() => {
                    // Profile updated!
                    handlePicFirebase()
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
          console.log(error.message);
        }
      };

     
          
    return(
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
        </>
    )
}