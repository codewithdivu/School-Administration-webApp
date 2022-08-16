import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase/config';

const useListener = (collectionName) => {
  const [listenerData, setlistenerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const q = query(collection(db, collectionName));
    const unsub = onSnapshot(q, (querySnapShot) => {
      const myData = [];
      querySnapShot.forEach((doc) => {
        myData.push(doc.data());
      });
      setIsLoading(false);
      if (myData.length > 0) {
        setlistenerData(myData);
      }
    });
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { listenerData, isLoading };
};

export default useListener;
