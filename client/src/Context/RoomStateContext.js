const { createContext, useState } = require('react');

const RoomStateContext = createContext();

function RoomStateProvider({ children }) {
  const [roomState, setRoomState] = useState();

  const value = {
    roomState,
    setRoomState,
  };

  return <RoomStateContext.Provider value={value}>{children}</RoomStateContext.Provider>;
}

export { RoomStateContext, RoomStateProvider };
