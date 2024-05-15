const { createContext, useState } = require('react');

const CurrentMediaPreviewContext = createContext();

function CurrentMediaPreviewProvider({ children }) {
  const [currentMediaPreview, setCurrentMediaPreview] = useState();

  const value = {
    currentMediaPreview,
    setCurrentMediaPreview,
  };

  return <CurrentMediaPreviewContext.Provider value={value}>{children}</CurrentMediaPreviewContext.Provider>;
}

export { CurrentMediaPreviewContext, CurrentMediaPreviewProvider };
