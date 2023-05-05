import {useState,useEffect} from "react";
import { BsArrowLeftShort, BsCameraVideoFill, BsThreeDots } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { Messages } from "./Messages";
import Input from "./Input";
import { useChatContext } from "../Context/ChatContext";

const Chat = () => {
  const {data} = useChatContext()!
  const { dispatch } = useChatContext()!;
  const [shouldDisplay, setShouldDisplay] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function handleDropdownClick() {
    setIsDropdownOpen(!isDropdownOpen);
  }

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

  const handleClick = () => {
    dispatch({ type: "CLEAR_USER"});
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
            onClick={handleClick}
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
          <button onClick={() => console.log('Block chat clicked')}>Block User</button>
          <button onClick={() => console.log('Close chat clicked')}>Close chat</button>
        </div>
      )}
    </div>
            </>
          )}
       

      </div>
      
     
     <Messages />
     <Input />
   </div>
   )}
   </>
  );
};

export default Chat;
