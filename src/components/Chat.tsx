import React from "react";
import { BsCameraVideoFill, BsThreeDots } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { Messages } from "./Messages";
import Input from "./Input";
import { useChatContext } from "../Context/ChatContext";

const Chat = () => {
  const {data} = useChatContext()!
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user.displayName}</span>
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
