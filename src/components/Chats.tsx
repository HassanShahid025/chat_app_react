import { useState, useEffect } from "react";
import { useAuthContext } from "../Context/AuthContext";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useChatContext } from "../Context/ChatContext";
import userPic from "../assets/user.jpg";
import Loader from "./loader/Loader";

const Chats = () => {
  const [chats, setChats] = useState<DocumentData>({});
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuthContext()!;
  const [userChats, setUserChats] = useState<DocumentData>({});
  const { dispatch } = useChatContext()!;
  const [blockPhotoUrl, setBlockPhotoUrl] = useState<string[]>([]);



  useEffect(() => {
    const getChats = () => {
      const unSub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data()!);
        setIsLoading(false);
      });
      return () => {
        unSub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  useEffect(() => {
    setUserChats({})
    const getChats = () => {
      const unSub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setUserChats(doc.data()!);
      });
      return () => {
        unSub();
      };
    };
    currentUser.uid && getChats();
  },[currentUser.uid])


  useEffect(() => {
    setBlockPhotoUrl([])
    if(Object.keys(userChats).length !==0){
      for(const key in userChats){
        if(userChats[key].block.isBlocked){
          setBlockPhotoUrl([...blockPhotoUrl,userChats[key].userInfo.photoURL])
        }
      }
    }
  },[userChats])

  const handleSelect = (user: DocumentData) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  if (isLoading) {
    return (
      <div className="chats">
        <Loader />
      </div>
    );
  }

  if (!chats || Object.keys(chats).length === 0) {
    return (
      <div className="chats">
        <p>No chats for you</p>
      </div>
    );
  }
  


  return (
    <div className="chats" >
      {Object.entries(chats)
        .sort((a, b) => b[1].date - a[1].date)
        .map((chat) => {
          return (
            <div
              className="userChat"
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}
            >
              {blockPhotoUrl.includes(chat[1].userInfo.photoURL) ? (
                <img src={userPic}/>
              ) : (
                chat[1].userInfo.photoURL ?  (
                  <img src={chat[1].userInfo.photoURL} alt="" />
                ) : (
                  <img src={userPic} />
                )
              )}
             

              <div className="userChatInfo">
                <span>{chat[1].userInfo.displayName}</span>
                <p>
                  {chat[1].lastMessage.text.length > 20
                    ? chat[1].lastMessage.text.slice(0, 20) + "..."
                    : chat[1].lastMessage.text}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Chats;
