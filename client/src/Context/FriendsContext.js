import { SocketContext } from './SocketContext';

const { createContext, useState } = require('react');

const FriendsContext = createContext();

function FriendsProvider({ children }) {
  const [relationship, setRelationship] = useState([]);

  const value = {
    relationship,
    setRelationship,
  };

  return <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>;
}

export { FriendsProvider, FriendsContext };
