const { createContext, useState } = require('react');

const IsOpenRoomInfoBarContext = createContext();

function IsOpenRoomInfoBarProvider({ children }) {
  const [isOpenRoomInfoBar, setIsOpenRoomInfoBar] = useState([]);

  const value = {
    isOpenRoomInfoBar,
    setIsOpenRoomInfoBar,
  };

  return <IsOpenRoomInfoBarContext.Provider value={value}>{children}</IsOpenRoomInfoBarContext.Provider>;
}

export { IsOpenRoomInfoBarContext, IsOpenRoomInfoBarProvider };
