import { useState } from "react";
import { BsImage } from "react-icons/bs";
import { MdSend } from "react-icons/md";
import { useChatContext } from "../Context/ChatContext";
import { useAuthContext } from "../Context/AuthContext";
import { arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import SendPic from "./SendPic";


const   Input = () => {
  const [text, setText] = useState("");
  const [chatImg, setChatImg] = useState<File | null>(null);

  const { currentUser } = useAuthContext()!;
  const { data } = useChatContext()!;
  const {dispatch} = useChatContext()!
  const { sendPicture } = useChatContext()!.data;

  const date = new Date()
  const currentHours = `${date.getHours().toLocaleString().length === 1 ? `0${date.getHours()}` : `${date.getHours()}`}`
    let currentMinutes = `${date.getMinutes().toLocaleString().length === 1 ? `0${date.getMinutes()}` : `${date.getMinutes()}`}`

    const handleImageSelect  =(event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        dispatch({ type: "HANDLE_PICTURE", payload: true });
        setChatImg(event.target.files[0]);
      }
    };

  const handleSend = async () => {
    if (chatImg) {
      setText("")
      const storageRef = ref(storage, uuidv4());
      const uploadTask = uploadBytesResumable(storageRef, chatImg);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          toast.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuidv4(),
                  text,
                  senderId: currentUser.uid,
                  date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
                  time:`${currentHours}:${currentMinutes}`,
                  img:downloadURL
                }),
              })
            }
          );
        }
      );

      await updateDoc(doc(db,"userChats",currentUser.uid),{
        [data.chatId + ".lastMessage"]:{
          text:text === "" ? "Image sent" : text
        },
        [data.chatId + ".date"]: serverTimestamp()
      })
      await updateDoc(doc(db,"userChats",data.user.uid),{
        [data.chatId + ".lastMessage"]:{
          text: text === "" ? "Image Recieved" : text
        },
        [data.chatId + ".date"]: serverTimestamp()
      })

      setChatImg(null)
      dispatch({ type: "HANDLE_PICTURE", payload: false });
    } 
    
    else if(text !== "") {
      setChatImg(null)
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuidv4(),
          text,
          senderId: currentUser.uid,
          date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
          time:`${currentHours}:${currentMinutes}`       
        }),
      }).then(() => {setText("")});
      await updateDoc(doc(db,"userChats",currentUser.uid),{
        [data.chatId + ".lastMessage"]:{
          text,
        },
        [data.chatId + ".date"]: serverTimestamp()
      })
      await updateDoc(doc(db,"userChats",data.user.uid),{
        [data.chatId + ".lastMessage"]:{
          text,
        },
        [data.chatId + ".date"]: serverTimestamp()
      })

      
    }

   
  };

  const handleKeyPress = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };
  
 

  return (
   <>
   {sendPicture && <SendPic chatImg={chatImg} text={text} setText={setText} handleSend={handleSend}/>}
     <div className="input">
     <div className="input-container">
     <input
        type="text"
        placeholder="Type something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => handleKeyPress(e)}
      />
     </div>
      <div className="send">
        <input
          type="file"
          id="chatPic"
          style={{ display: "none" }}
          onChange={handleImageSelect}
        />
        <label htmlFor="chatPic" className="pointer">
          <BsImage size={20} />
        </label>
        <MdSend size={20} className="pointer" onClick={handleSend} />
      </div>
    </div>
   </>
  );
};

export default Input;
