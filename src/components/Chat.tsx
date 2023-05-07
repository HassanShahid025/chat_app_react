import { useState, useEffect } from "react";
import {
  BsArrowLeftShort,
  BsThreeDots,
} from "react-icons/bs";

import { Messages } from "./Messages";
import Input from "./Input";
import { useChatContext } from "../Context/ChatContext";
import { DocumentData, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useAuthContext } from "../Context/AuthContext";
import { db } from "../firebase";
import Notiflix from "notiflix";



const Chat = () => {
  const { data } = useChatContext()!;
  const { dispatch } = useChatContext()!;
  const { isBlocked } = useChatContext()!.data;
  const { blockBy } = useChatContext()!.data;
 const {sendPicture} = useChatContext()!.data;
  const [shouldDisplay, setShouldDisplay] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userChats, setUserChats] = useState<DocumentData>({});
  const { currentUser } = useAuthContext()!;


  function handleDropdownClick() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  useEffect(() => {
    dispatch({ type: "HANDLE_BLOCK", payload: {isBlocked:false,blockBy:""} })
    const getChats = () => {
      const unSub = onSnapshot(doc(db, "userChats", data.user.uid), (doc) => {
        setUserChats(doc.data()!);
      });
      return () => {
        unSub();
      };
    };
    data.chatId && getChats();
   
  }, [data.chatId]);

  useEffect(() => {
    if (Object.keys(userChats).length !== 0) {
      for (const key in userChats) {
        if (key.includes(currentUser.uid)) {
          if (userChats[key].block.isBlocked === true) {
            dispatch({ type: "HANDLE_BLOCK", payload: {isBlocked:true,blockBy:userChats[key].block.blockBy} })
          }
          setUserChats({});
        }
      }
    }
  }, [userChats]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 700;
      const shouldDisplay = isMobile ? data.chatId !== "" : true;
      setShouldDisplay(shouldDisplay);
    };

    handleResize(); // Call initially to set the correct display state

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data.chatId]);

  const closeChat = () => {
    dispatch({ type: "CLEAR_USER" });
    setIsDropdownOpen(false)
  };

  const blockUser = async() => {
    const combinedId =
      currentUser.uid > data.user.uid
        ? currentUser.uid + data.user.uid
        : data.user.uid + currentUser.uid;

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [combinedId + ".block"]: {
        isBlocked: true,
        blockBy: currentUser.displayName,
      },
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [combinedId + ".block"]: {
        isBlocked: true,
        blockBy: currentUser.displayName,
      },
    });
    handleDropdownClick();
  };

  const unBlockUser = async() => {
    const combinedId =
      currentUser.uid > data.user.uid
        ? currentUser.uid + data.user.uid
        : data.user.uid + currentUser.uid;

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [combinedId + ".block"]: {
        isBlocked: false,
        blockBy: "",
      },
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [combinedId + ".block"]: {
        isBlocked: false,
        blockBy: "",
      },
    });
    dispatch({ type: "HANDLE_BLOCK", payload: {isBlocked:false,blockBy:""} })
    handleDropdownClick();
  }

  const blockModal = (text: string) => {
    Notiflix.Confirm.show(
      text === "block" ? "Block user" : "Unblock user",
      `You are about to ${text} ${data.user.displayName}?`,
      "Confirm",
      "Cancel",
      function okCb() {
        text === "block" ? blockUser() : unBlockUser()
      },
      function cancelCb() {
        handleDropdownClick();
      },
      {
        width: "320px",
        borderRadius: "8px",
        titleColor: "#5d5b8d",
        okButtonBackground: "#5d5b8d",
        cssAnimationStyle: "zoom",
      }
    );
  };


  return (
    <>
      {shouldDisplay && (
        <div className="chat">
          <div className="chatInfo">
            {data.chatId && (
              <>
                <div>
                  <BsArrowLeftShort
                    size={40}
                    onClick={closeChat}
                    style={{ cursor: "pointer" }}
                    className="chat-arrow"
                  />
                  <span>{data.user.displayName}</span>
                </div>

                <div className="chatContainer">
                  <div className="chatIcons" onClick={handleDropdownClick}>
                    <BsThreeDots size={20} />
                  </div>
                  {isDropdownOpen && !sendPicture &&(
                    <div className="chatDropdown">
                      <button onClick={closeChat} className="close-chat-btn">Close chat</button>
                      {isBlocked === true ? (
                        <button onClick={() => blockModal("unblock")}>
                          Unblock user
                        </button>
                      ) : (
                        <button onClick={() => blockModal("block")}>Block user</button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          {!data.chatId && (
            <div className="div">
              <p>Enjoy unlimited chatting and share pictures for free!!</p>
            </div>
          )}

          

          {data.chatId && (
            <>
              <Messages />
              {isBlocked === false ? (
                <Input />
              ) : (
                <div className="block-text">
                  <p>
                    {blockBy === currentUser.displayName
                      ? `You have blocked ${data.user.displayName}`
                      : `${blockBy} has blocked you`}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chat;
