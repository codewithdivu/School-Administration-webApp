import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const useListenerStudentsData = (collectionName) => {
  const [listenerStudentsData, setlistenerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const q = query(collection(db, collectionName), where('role', '==', 13));
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

  return { listenerStudentsData, isLoading };
};

export default useListenerStudentsData;
