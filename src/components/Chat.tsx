import React from "react";
import { BsArrowLeftShort, BsCameraVideoFill, BsThreeDots } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { Messages } from "./Messages";
import Input from "./Input";
import { useChatContext } from "../Context/ChatContext";

const Chat = () => {
  const {data} = useChatContext()!
  const { dispatch } = useChatContext()!;

  const handleClick = () => {
    dispatch({ type: "CLEAR_USER"});
  }

  return (
    <div className="chat" style={{display: data.chatId !== "" ? "block" : "none"}}>
      <div className="chatInfo">
        <div>
        <BsArrowLeftShort
            size={40}
            onClick={handleClick}
            style={{cursor:"pointer"}}
          />
        <span>{data.user.displayName}</span>
        </div>
     
        <div className="chatIcons">
          <BsCameraVideoFill size={20} />
          <FaUserPlus size={20} />
          <BsThreeDots size={20} />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
