import React, { useEffect, useRef } from "react";
import { useAuthContext } from "../Context/AuthContext";
import { useChatContext } from "../Context/ChatContext";
import userPic from "../assets/user.jpg"

const Message = ({ message }: { message: any }) => {
  const { currentUser } = useAuthContext()!;
  const { data } = useChatContext()!;
  const { isBlocked } = useChatContext()!.data;

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
              ? currentUser.photoURL ? currentUser.photoURL : userPic
              : isBlocked ? userPic : data.user.photoURL ? data.user.photoURL : userPic
          }
          alt=""
        />
        <span>{message.time}</span>
      </div>
      <div className="messageContent">
        {message.text === "" ? null : (
          <p>{message.text}</p>
        )}
        {
          message.img && <img src={message.img} alt="" />
        }
      </div>
    </div>
  );
};

export default Message;
