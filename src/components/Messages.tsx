import { useState, useEffect } from "react";
import Message from "./Message";
import { useChatContext } from "../Context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const Messages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const { data } = useChatContext()!;

  useEffect(() => {
    if (data.chatId !== "") {
      const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });
      return () => {
        unSub;
      };
    }
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages!.map((message: any, index) => {
        let date = message.date;
        return (
          <span key={message.id}>
            <p className="date">
              {index === 0
                ? message.date
                : messages[index - 1].date !== message.date ? message.date : null}
            </p>
            <Message message={message} />
          </span>
        );
      })}
    </div>
  );
};