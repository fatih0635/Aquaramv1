import React, { createContext, useState, useContext } from 'react';

const lightTheme = {
  background: '#f0fff4',
  text: '#2e7d32',
  inputBg: '#fff',
  borderColor: '#ccc',
  button: '#c8e6c9',
  error: '#d32f2f',
};

const darkTheme = {
  background: '#121212',
  text: '#bbf7d0',
  inputBg: '#1e1e1e',
  borderColor: '#444',
  button: '#333',
  error: '#ef9a9a',
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
