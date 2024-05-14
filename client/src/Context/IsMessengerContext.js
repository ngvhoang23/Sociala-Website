const { createContext, useState } = require('react');

const IsMessengerContext = createContext();

function IsMessengerProvider({ children }) {
  const [isMessenger, setIsMessenger] = useState();

  const value = {
    isMessenger,
    setIsMessenger,
  };

  return <IsMessengerContext.Provider value={value}>{children}</IsMessengerContext.Provider>;
}

export { IsMessengerContext, IsMessengerProvider };
