import classNames from 'classnames/bind';
import styles from './Messenger.module.scss';

import ChatContainer from '~/components/ChatContainer';
import ChatTabContent from '~/components/ChatTabContent';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { IsMessengerContext } from '~/Context/IsMessengerContext';
import RoomInfoContainer from '~/MainLayout/components/RoomInfoContainer';
import { IsOpenRoomInfoContext } from './Contexts/IsOpenRoomInfo';

const cx = classNames.bind(styles);

function AuthComponent({ children }) {
  // USE_CONTEXT
  const isMessengerContext = useContext(IsMessengerContext);
  const isMessenger = isMessengerContext.isMessenger;
  const setIsMessenger = isMessengerContext.setIsMessenger;

  const isOpenRoomInfoContext = useContext(IsOpenRoomInfoContext);
  const isOpenRoomInfo = isOpenRoomInfoContext.isOpen;
  const setIsOpenRoomInfo = isOpenRoomInfoContext.setIsOpen;

  // USE_STATE

  useEffect(() => {
    setIsMessenger(true);
    return () => {
      setIsMessenger(false);
    };
  }, []);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <div className={cx('content')}>
          <ChatTabContent />
          <ChatContainer isOpenRoomInfo={isOpenRoomInfo} />
          {isOpenRoomInfo && <RoomInfoContainer setIsOpenRoomInfo={setIsOpenRoomInfo} />}
        </div>
      </div>
    </div>
  );
}

export default AuthComponent;
