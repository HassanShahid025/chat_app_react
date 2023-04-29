import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";

interface AppContextType {
  currentUser: any
}

const AuthContext = createContext<AppContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState({});


  useEffect(() => {
   const user =  onAuthStateChanged(auth, (user) => {
      setCurrentUser(user!);
    });
    return () => {
      user()
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuthContext = () => {
  return useContext(AuthContext);
};
