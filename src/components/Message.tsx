import React, { useEffect, useRef } from "react";
import { useAuthContext } from "../Context/AuthContext";
import { useChatContext } from "../Context/ChatContext";

const Message = ({ message }: { message: any }) => {
  const { currentUser } = useAuthContext()!;
  const { data } = useChatContext()!;

  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior:"smooth"
    })
  },[message])


  return (
    <div className={`message ${message.senderId === currentUser.uid && "owner"}`} ref={ref}>
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>{message.time}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {
          message.img && <img src={message.img} alt="" />
        }
      </div>
    </div>
  );
};

export default Message;
