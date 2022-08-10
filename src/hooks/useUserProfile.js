import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { USERS } from '../firebase/collections';

const useUserProfile = (email) => {
  const [userProfileData, setUserProfileData] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (email) {
      const q = query(collection(db, USERS), where('email', '==', email));
      const unsub = onSnapshot(q, (querySnapShot) => {
        const myData = [];
        querySnapShot.forEach((doc) => {
          myData.push(doc.data());
        });
        setIsProfileLoading(false);
        if (myData.length > 0) setUserProfileData(myData[0]);
      });
      return unsub;
    }
  }, [email]);

  return { userProfileData, isProfileLoading };
};

export default useUserProfile;
