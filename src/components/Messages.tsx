import { useState, useEffect } from "react";
import Message from "./Message";
import { useChatContext } from "../Context/ChatContext";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const Messages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const { data } = useChatContext()!;

  useEffect(() => {
    if (data.chatId !== "") {
      const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages)
      });
      return () => {
        unSub;
      };
    }
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages!.map((message:any) => {
        return (
          <Message message={message} key={message.id}/>
        )
      })}
    </div>
  );
};
