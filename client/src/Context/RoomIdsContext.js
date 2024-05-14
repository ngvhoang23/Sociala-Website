import { createContext, useContext, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';

const RoomIdsContext = createContext();

function RoomIdsProvider({ children }) {
  const [roomIds, setRoomIds] = useState([]);

  const value = {
    roomIds,
    setRoomIds,
  };

  return <RoomIdsContext.Provider value={value}>{children}</RoomIdsContext.Provider>;
}

export { RoomIdsContext, RoomIdsProvider };
