const { createContext, useState } = require('react');

const CurrentRoomContext = createContext();

function CurrentRoomProvider({ children }) {
  const [currentRoom, setCurrentRoom] = useState();

  const handleSetCurrentRoom = (value) => {
    setCurrentRoom(value);
  };

  const value = {
    currentRoom,
    handleSetCurrentRoom,
  };

  return <CurrentRoomContext.Provider value={value}>{children}</CurrentRoomContext.Provider>;
}

export { CurrentRoomContext, CurrentRoomProvider };
