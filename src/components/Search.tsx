import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import useFetchCollection from "../customHooks/useFetchCollection";
import { useAuthContext } from "../Context/AuthContext";
import userPic from "../assets/user.jpg"

const Search = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<DocumentData[] | null>(null);
  const { currentUser } = useAuthContext()!;
  const { data } = useFetchCollection("users");

  const handleSearch = () => {
    if (search !== "") {
      const firebaseUsers = data.filter((user) => {
        return user.displayName.toLowerCase().includes(search.toLowerCase());
      });
      setUsers(firebaseUsers);
    }
    if (search === "") {
      setUsers(null);
    }
  };

  

  const handleSelect = async (user: DocumentData) => {
     //check whether the group(chats in firestore) exists, if not create
     const combinedId =
     currentUser.uid > user.uid
       ? currentUser.uid + user.uid
       : user.uid + currentUser.uid;
   try {
     const res = await getDoc(doc(db, "chats", combinedId));

     if (!res.exists()) {
       //create a chat in chats collection
       await setDoc(doc(db, "chats", combinedId), { messages: [] });

       //create user chats
       await updateDoc(doc(db, "userChats", currentUser.uid), {
         [combinedId + ".userInfo"]: {
           uid: user.uid,
           displayName: user.displayName,
           photoURL: user.photoURL,
         },
         [combinedId + ".date"]: serverTimestamp(),
       });

       await updateDoc(doc(db, "userChats", user.uid), {
         [combinedId + ".userInfo"]: {
           uid: currentUser.uid,
           displayName: currentUser.displayName,
           photoURL: currentUser.photoURL,
         },
         [combinedId + ".date"]: serverTimestamp(),
       });
     }
   } catch (error) {}
   setUsers(null)
   setSearch("")
  };


  useEffect(() => {
    handleSearch();
  }, [search]);


  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {users &&
        users.map((user) => {
          return (
            <div
              className="userChat"
              key={user.uid}
              onClick={() => handleSelect(user)}
            >
              <img src={user.photoURL ? user.photoURL : userPic} alt="" />
              <div className="userChatInfo">
                <span>{user.displayName}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Search;
