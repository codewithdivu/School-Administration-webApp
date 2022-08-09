import { createContext, useState } from 'react';

export const UserProfileContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);

  return <UserProfileContext.Provider value={{ userProfile, setUserProfile }}>{children}</UserProfileContext.Provider>;
};
