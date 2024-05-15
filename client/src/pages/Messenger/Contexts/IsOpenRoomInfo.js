const { createContext, useState } = require('react');

const IsOpenRoomInfoContext = createContext();

function IsOpenRoomInfoProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = {
    isOpen,
    setIsOpen,
  };

  return <IsOpenRoomInfoContext.Provider value={value}>{children}</IsOpenRoomInfoContext.Provider>;
}

export { IsOpenRoomInfoContext, IsOpenRoomInfoProvider };
