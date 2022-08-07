import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

const useAuthenticateUser = () => {
  const localUser = localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser')) : null;
  const [user, setUser] = useState(localUser);
  const [isLoader, setIsLoader] = useState(true);

  useEffect(() => {
    const subscription = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user));
        setUser(user);
        setIsLoader(false);
      } else {
        localStorage.removeItem('authUser');
        setUser(null);
        setIsLoader(false);
      }
    });

    return subscription;
  }, []);

  return { user, isLoader };
};

export default useAuthenticateUser;
