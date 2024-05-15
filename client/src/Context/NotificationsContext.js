const { createContext, useState } = require('react');

const NotificationsContext = createContext();

function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const value = {
    notifications,
    setNotifications,
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export { NotificationsContext, NotificationsProvider };
