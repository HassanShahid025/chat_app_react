import { RxCross2 } from "react-icons/rx";
import { useChatContext } from "../Context/ChatContext";
import userPic from "../assets/user.jpg";
import { MdSend } from "react-icons/md";

interface ISendPic {
    chatImg: File | null
    text:string
    setText: React.Dispatch<React.SetStateAction<string>>
    handleSend: () => Promise<void>
}

const SendPic = ({chatImg,text,setText,handleSend}:ISendPic) => {
  const { dispatch } = useChatContext()!;

  const closeSendPic = () => {
    dispatch({ type: "HANDLE_PICTURE", payload: false });
  };

  return (
    <div className="sendPic-container">
      <div className="nav">
        <RxCross2
          size={30}
          style={{ cursor: "pointer" }}
          onClick={closeSendPic}
        />
      </div>
      <div className="pic-container">
        {chatImg && (
             <img src={URL.createObjectURL(chatImg)} alt="" />
        )}      
      </div>
      <div className="input-contianer">
        <input type="text" placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)}/>
      </div>
      <div className="send-btn">
        <div>
          <MdSend size={35} style={{ cursor: "pointer", color:"white" }} onClick={handleSend}/>
        </div>
      </div>
    </div>
  );
};

export default SendPic;
