const { createContext, useState } = require('react');

const IsOpenEditProfileModalContext = createContext();

function IsOpenEditProfileModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = {
    isOpen,
    setIsOpen,
  };

  return <IsOpenEditProfileModalContext.Provider value={value}>{children}</IsOpenEditProfileModalContext.Provider>;
}

export { IsOpenEditProfileModalContext, IsOpenEditProfileModalProvider };
