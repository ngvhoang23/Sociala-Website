import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { SocketContext } from './SocketContext';

const { createContext, useState, useContext, useEffect } = require('react');

const OnlineUsersContext = createContext();

function OnlineUsersProvider({ children }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket?.emit('addUser', user);
    socket?.on('getUsers', (users) => {
      setOnlineUsers(users);
    });
  }, [socket]);

  const value = {
    onlineUsers,
    setOnlineUsers,
  };

  return <OnlineUsersContext.Provider value={value}>{children}</OnlineUsersContext.Provider>;
}

export { OnlineUsersContext, OnlineUsersProvider };
