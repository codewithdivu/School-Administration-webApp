import { createContext, useState } from 'react';

export const ThemeModeContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const ThemeModeProvider = ({ children }) => {
  const [themeMode, setthemeMode] = useState(false);

  return <ThemeModeContext.Provider value={{ themeMode, setthemeMode }}>{children}</ThemeModeContext.Provider>;
};
