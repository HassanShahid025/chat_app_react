import { useState, useEffect } from "react";
import { useAuthContext } from "../Context/AuthContext";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useChatContext } from "../Context/ChatContext";

const Chats = () => {
  const [chats, setChats] = useState<DocumentData>({});
  const { currentUser } = useAuthContext()!;
  const { dispatch } = useChatContext()!;

  useEffect(() => {
    const getChats = () => {
      const unSub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data()!);
      });
      return () => {
        unSub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (user: DocumentData) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <div className="chats">
      {Object.entries(chats).sort((a,b) => b[1].date - a[1].date).map((chat) => (
        <div
          className="userChat"
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].userInfo.displayName}</span>
            <p>
              {chat[1].lastMessage.text.length > 20
                ? chat[1].lastMessage.text.slice(0, 20) + "..."
                : chat[1].lastMessage.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
