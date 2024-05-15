const { createContext, useState } = require('react');

const MessagesContext = createContext();

function MessagesProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const handleSetMessages = (value) => {
    setMessages(value);
  };

  const value = {
    messages,
    handleSetMessages,
  };

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export { MessagesContext, MessagesProvider };
