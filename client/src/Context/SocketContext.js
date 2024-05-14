import { io } from 'socket.io-client';

const { createContext, useState, useEffect } = require('react');

const SocketContext = createContext();

function SocketProvider({ children }) {
  const [socket, setSocket] = useState();
  const CONNECTION_PORT = 'http://localhost:5000/';
  useEffect(() => {
    setSocket(io.connect(CONNECTION_PORT));
  }, [CONNECTION_PORT]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export { SocketContext, SocketProvider };
