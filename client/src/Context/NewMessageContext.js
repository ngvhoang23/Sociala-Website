const { createContext, useState } = require('react');

const NewMessageContext = createContext();

function NewMessageProvider({ children }) {
  const [newMessage, setNewMessage] = useState();

  const value = {
    newMessage,
    setNewMessage,
  };

  return <NewMessageContext.Provider value={value}>{children}</NewMessageContext.Provider>;
}

export { NewMessageContext, NewMessageProvider };
