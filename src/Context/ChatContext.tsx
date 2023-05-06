import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useAuthContext } from "./AuthContext";
import { DocumentData } from "firebase/firestore";

interface AppContextType {
  dispatch: React.Dispatch<actionType>
  data:DocumentData
}

type actionType =
  | { type: "CHANGE_USER"; payload: DocumentData }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "CLEAR_USER" }
  | { type: "HANDLE_BLOCK"; payload:{isBlocked:boolean,blockBy:string}}

const ChatContext = createContext<AppContextType | null>(null);

export const ChatProvider = ({ children }: any) => {
  const { currentUser } = useAuthContext()!;

  const INITIAL_STATE = {
    chatId: "",
    user: {},
    isBlocked: false, 
    blockBy: "" 
  };

  const chatReducer = (state: typeof INITIAL_STATE, action: actionType) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          ...state,
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };
        case "CLEAR_USER":
          return{
            ...state,
            user: {},
            chatId: ""
          };
        case "HANDLE_BLOCK":
          return{
            ...state,
            isBlocked: action.payload.isBlocked,
            blockBy: action.payload.blockBy
          };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider
      value={{
        data: state,
        dispatch,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const useChatContext = () => {
  return useContext(ChatContext);
};
