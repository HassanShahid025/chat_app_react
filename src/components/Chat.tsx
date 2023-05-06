import {useState,useEffect} from "react";
import { BsArrowLeftShort, BsCameraVideoFill, BsThreeDots } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { Messages } from "./Messages";
import Input from "./Input";
import { useChatContext } from "../Context/ChatContext";
import { DocumentData, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useAuthContext } from "../Context/AuthContext";
import { db } from "../firebase";
import Notiflix from "notiflix";

const Chat = () => {
  const {data} = useChatContext()!
  const { dispatch } = useChatContext()!;
  const [shouldDisplay, setShouldDisplay] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userChats, setUserChats] = useState<DocumentData>({});
  const { currentUser } = useAuthContext()!;
  const [block, setBlock] = useState({isBlocked:false, blockBy:""})


  function handleDropdownClick() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  useEffect(() => {
    setBlock({isBlocked:false, blockBy:""})
      const getChats = () => {
        const unSub = onSnapshot(doc(db, "userChats", data.user.uid), (doc) => {
          setUserChats(doc.data()!);
        });
        return () => {
          unSub();
        };
      };
    data.chatId && getChats()

   
  }, [data.chatId]);
  console.log(data.user.uid)

  useEffect(() => {
    for(const key in userChats){
      if(key.includes(currentUser.uid)){
        if(userChats[key].block.isBlocked === true)
        setBlock({isBlocked:true,blockBy:userChats[key].blockBy})
      }
    }
  },[data.chatId])


  

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 700;
      const shouldDisplay = isMobile ? data.chatId !== "" : true;
      setShouldDisplay(shouldDisplay);
    };

    handleResize(); // Call initially to set the correct display state

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data.chatId]);

  const closeChat = () => {
    dispatch({ type: "CLEAR_USER"});
    handleDropdownClick()
  }

  const blockUser = async() => {

    const combinedId =
     currentUser.uid > data.user.uid
       ? currentUser.uid + data.user.uid
       : data.user.uid + currentUser.uid;

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [combinedId + ".block"] : {
        isBlocked:true,
        blockBy:currentUser.displayName
       }  
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [combinedId + ".block"] : {
       isBlocked:true,
       blockBy:currentUser.displayName
      }
    });
    handleDropdownClick()
  }

  const blockModal = () => {
    Notiflix.Confirm.show(
      "Block user",
      `You are about to block ${data.user.displayName}?`,
      "Confirm",
      "Cancel",
      function okCb() {
        blockUser()
      },
      function cancelCb() {
        handleDropdownClick();
      },
      {
        width: "320px",
        borderRadius: "8px",
        titleColor: "#f7c17b",
        okButtonBackground: "#f7c17b",
        cssAnimationStyle: "zoom",
      }
    );
  }

  return (
   <>
   {shouldDisplay && (
     <div className="chat" >
        <div className="chatInfo">
          {data.chatId && (
            <>
               <div>
        <BsArrowLeftShort
            size={40}
            onClick={closeChat}
            style={{cursor:"pointer"}}
            className="chat-arrow"
          />
        <span>{data.user.displayName}</span>
        </div>
     
        <div className="chatContainer">
      <div className="chatIcons" onClick={handleDropdownClick}>
        <BsThreeDots size={20} />
      </div>
      {isDropdownOpen && (
        <div className="chatDropdown">
          <button onClick={closeChat}>Close chat</button>
          <button onClick={blockModal}>Block user</button>
        </div>
      )}
    </div>
            </>
          )}
       

        </div>
        {!data.chatId && (
          <div className="div">
            <p>No chats availabel</p>
          </div>
        )}
        
        {data.chatId && (
       <>
        <Messages />
        {block.isBlocked === false ? (<Input />): (<p>blocked</p>)}
        
      </>
     )}
       
      
    
     
   </div>
   )}
   </>
  );
};

export default Chat;
