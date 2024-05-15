const { createContext, useState } = require('react');

const IsOpenChangeEmailModalContext = createContext();

function IsOpenChangeEmailModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = {
    isOpen,
    setIsOpen,
  };

  return <IsOpenChangeEmailModalContext.Provider value={value}>{children}</IsOpenChangeEmailModalContext.Provider>;
}

export { IsOpenChangeEmailModalContext, IsOpenChangeEmailModalProvider };
