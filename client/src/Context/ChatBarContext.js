const { createContext, useState } = require('react');

const ChatBarContext = createContext();

function ChatBarProvider({ children }) {
  const [newMessage, setNewMessage] = useState([]);

  const handleSetNewMessage = (value) => {
    setNewMessage(value);
  };

  const value = {
    newMessage,
    handleSetNewMessage,
  };

  return <ChatBarContext.Provider value={value}>{children}</ChatBarContext.Provider>;
}

export { ChatBarContext, ChatBarProvider };
