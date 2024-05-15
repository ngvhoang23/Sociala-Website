const { createContext, useState } = require('react');

const IsOpenNotificationContext = createContext();

function IsOpenNotificationProvider({ children }) {
  const [isOpenNotification, setIsOpenNotification] = useState();

  const value = {
    isOpenNotification,
    setIsOpenNotification,
  };

  return <IsOpenNotificationContext.Provider value={value}>{children}</IsOpenNotificationContext.Provider>;
}

export { IsOpenNotificationContext, IsOpenNotificationProvider };
