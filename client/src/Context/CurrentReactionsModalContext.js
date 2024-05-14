const { createContext, useState } = require('react');

const CurrentReactionsModalContext = createContext();

function CurrentReactionsModalProvider({ children }) {
  const [currentReactionsModal, setCurrentReactionsModal] = useState();

  const value = {
    currentReactionsModal,
    setCurrentReactionsModal,
  };

  return <CurrentReactionsModalContext.Provider value={value}>{children}</CurrentReactionsModalContext.Provider>;
}

export { CurrentReactionsModalContext, CurrentReactionsModalProvider };
