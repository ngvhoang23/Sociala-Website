const { createContext, useState } = require('react');

const MediaContext = createContext();

function MediaProvider({ children }) {
  const [media, setMedia] = useState([]);

  const value = {
    media,
    setMedia,
  };

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

export { MediaContext, MediaProvider };
