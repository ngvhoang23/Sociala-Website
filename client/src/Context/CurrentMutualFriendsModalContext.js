const { createContext, useState } = require('react');

const CurrentMutualFriendsModalContext = createContext();

function CurrentMutualFriendsModalProvider({ children }) {
  const [currentMutualFriendsModal, setCurrentMutualFriendsModal] = useState();

  const value = {
    currentMutualFriendsModal,
    setCurrentMutualFriendsModal,
  };

  return (
    <CurrentMutualFriendsModalContext.Provider value={value}>{children}</CurrentMutualFriendsModalContext.Provider>
  );
}

export { CurrentMutualFriendsModalContext, CurrentMutualFriendsModalProvider };
