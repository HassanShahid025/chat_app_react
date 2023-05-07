import { useState, useEffect } from "react";
import Message from "./Message";
import { useChatContext } from "../Context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Loader from "./loader/Loader";

export const Messages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const { data } = useChatContext()!;
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (data.chatId !== "") {
      const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
        setIsLoading(false)
      });
      return () => {
        unSub;
      };
    }
  }, [data.chatId]);

  const date = new Date();
  const todayDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

  return (
   <>
     <div className="messages">
     {isLoading && <Loader/>}
      {messages!.map((message: any, index) => {
        let date = message.date;
        return (
          <span key={message.id}>
            <p className="date">
              {index === 0
                ? message.date === todayDate
                  ? "Today"
                  : message.date
                : messages[index - 1].date !== message.date
                ? message.date === todayDate
                  ? "Today"
                  : message.date
                : null}
            </p>
            {<Message message={message} />}
          </span>
        );
      })}
    </div>
   </>
  );
};
