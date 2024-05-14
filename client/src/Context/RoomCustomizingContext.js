const { createContext, useState } = require('react');

const RoomCustomizingContext = createContext();

function RoomCustomizingProvider({ children }) {
  const [roomInfo, setRoomInfo] = useState();

  const value = {
    roomInfo,
    setRoomInfo,
  };

  return <RoomCustomizingContext.Provider value={value}>{children}</RoomCustomizingContext.Provider>;
}

export { RoomCustomizingContext, RoomCustomizingProvider };
