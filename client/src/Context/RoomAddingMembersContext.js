const { createContext, useState } = require('react');

const RoomAddingMembersContext = createContext();

function RoomAddingMembersProvider({ children }) {
  const [infoAdding, setInfoAdding] = useState();

  const value = {
    infoAdding,
    setInfoAdding,
  };

  return <RoomAddingMembersContext.Provider value={value}>{children}</RoomAddingMembersContext.Provider>;
}

export { RoomAddingMembersContext, RoomAddingMembersProvider };
