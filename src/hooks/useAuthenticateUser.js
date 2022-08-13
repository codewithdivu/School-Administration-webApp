import { useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { UserProfileContext } from '../contexts/userContext';
import { getUserData } from '../firebase/services';

const useAuthenticateUser = () => {
  const localUser = localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser')) : null;
  const [user, setUser] = useState(localUser);
  const [isLoader, setIsLoader] = useState(true);
  const { setUserProfile } = useContext(UserProfileContext);

  useEffect(() => {
    const subscription = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        const response = await getUserData(user.email);
        if (response) {
          setUserProfile(response);
          localStorage.setItem('userProfileData', JSON.stringify(response));
        }
        localStorage.setItem('authUser', JSON.stringify(user));
        setUser(user);
        setIsLoader(false);
      } else {
        localStorage.removeItem('authUser');
        localStorage.removeItem('userProfileData');
        setUserProfile(null);
        setUser(null);
        setIsLoader(false);
      }
    });

    return subscription;
  }, []);

  return { user, isLoader };
};

export default useAuthenticateUser;
