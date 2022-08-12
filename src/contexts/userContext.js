import { createContext, useState, useEffect } from 'react';

export const UserProfileContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const UserProfileProvider = ({ children }) => {
  const userLocalProfileData = localStorage.getItem('userProfileData');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (userLocalProfileData) {
      setUserProfile(JSON.parse(userLocalProfileData));
    }
  }, []);

  return <UserProfileContext.Provider value={{ userProfile, setUserProfile }}>{children}</UserProfileContext.Provider>;
};
