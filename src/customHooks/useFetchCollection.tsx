import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

const useFetchCollection = (collectionName : string ) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
 

  const getCollection = () => {
    setIsLoading(true);
    try {
      const DocRef = collection(db, collectionName);
    //   const q = query(DocRef, orderBy("createdAt", "desc"));

      onSnapshot(DocRef, (snapshot) => {
        const allData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(allData);
        setIsLoading(false);
      });
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCollection();
  }, []);

  return {
    data,
    isLoading,
  };
};

export default useFetchCollection;
