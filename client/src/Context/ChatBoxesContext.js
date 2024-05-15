const { createContext, useState } = require('react');

const ChatBoxesContext = createContext();

function ChatBoxesProvider({ children }) {
  const [chatBoxes, setChatBoxes] = useState([]);

  const value = {
    chatBoxes,
    setChatBoxes,
  };

  return <ChatBoxesContext.Provider value={value}>{children}</ChatBoxesContext.Provider>;
}

export { ChatBoxesContext, ChatBoxesProvider };
