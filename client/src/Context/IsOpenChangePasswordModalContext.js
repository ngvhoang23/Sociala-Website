const { createContext, useState } = require('react');

const IsOpenChangePasswordModalContext = createContext();

function IsOpenChangePasswordModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = {
    isOpen,
    setIsOpen,
  };

  return (
    <IsOpenChangePasswordModalContext.Provider value={value}>{children}</IsOpenChangePasswordModalContext.Provider>
  );
}

export { IsOpenChangePasswordModalContext, IsOpenChangePasswordModalProvider };
