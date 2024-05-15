import axios from 'axios';
import classNames from 'classnames/bind';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import DropDownMenu from '../DropDownMenu';
import { BlockIcon, EllipsisVerticalIcon, InfoIcon, MuteIcon, PhoneIcon, SearchIcon, TrashBinIcon } from '../Icons';
import OptionMenu from '../OptionMenu';
import styles from './ChatHeader.module.scss';
import { memo } from 'react';
import { CurrentRoomContext } from '~/Context/CurrentRoomContext';
import { StrangeMessageContext } from '~/Context/StrangeMessageContext';
import { OnlineUsersContext } from '~/Context/OnlineUsersContext';
import { SocketContext } from '~/Context/SocketContext';
import OptionItem from '../OptionItem';
import { IsOpenRoomInfoContext } from '~/pages/Messenger/Contexts/IsOpenRoomInfo';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import MediaItem2 from '../MediaItem2/MediaItem2';

const cookies = new Cookies();
const cx = classNames.bind(styles);

function ChatHeader({ setIsOpenRoomInfoBar, setMessages }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_CONTEXT
  const currentRoomContext = useContext(CurrentRoomContext);
  const currentRoom = currentRoomContext.currentRoom;

  const isOpenRoomInfoContext = useContext(IsOpenRoomInfoContext);
  const isOpenRoomInfo = isOpenRoomInfoContext.isOpen;
  const setIsOpenRoomInfo = isOpenRoomInfoContext.setIsOpen;

  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_CONTEXT
  const isStrangeContext = useContext(StrangeMessageContext);
  const setIsStrange = isStrangeContext.handleSetIsStrange;

  const onlineUsersContext = useContext(OnlineUsersContext);
  const onlineUsers = onlineUsersContext.onlineUsers;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const socket = useContext(SocketContext);

  // USE_STATE
  const [isOnline, setIsOnline] = useState(false);

  // USE_EFFECT

  useEffect(() => {
    setIsOnline(false);
    currentRoom?.members.forEach((member) => {
      const check = onlineUsers.some((onlineUser) => {
        return onlineUser.user_id == member.user_id && member.user_id != user.user_id;
      });
      if (check) {
        setIsOnline(true);
        return;
      }
    });
  }, [onlineUsers, currentRoom?.room_id]);

  // FUNCTION_HANDLER
  const handleRemoveChat = (room_id) => {
    const payload = {
      room_id,
      deleted_at: moment().valueOf(),
    };

    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .post(`/rooms/delete/${room_id}`, payload, configurations)
      .then((result) => {
        navigate('/messenger', { replace: true });
        currentRoom.room_id === room_id && setMessages([]);
        setIsStrange((prev) => !prev);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('user-img-container')}>
        {isOnline ? <div className={cx('online-icon')}></div> : <></>}
        <MediaItem2
          item={{ url: currentRoom?.room_avatar, type: 'image' }}
          width={48}
          height={48}
          border_radius={1000}
          _styles={{
            boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
          }}
          className={cx('user-img')}
        />
      </div>
      <div className={cx('user-info')}>
        <h3 className={cx('user-name')}>{currentRoom?.room_name}</h3>
        <span className={cx('status')}>
          <p className={cx('status-text')}>{isOnline ? 'Online' : 'Offline'}</p>
        </span>
      </div>
      <div className={cx('room-bar-tools')}>
        <button
          className={cx('room-option-btn')}
          onClick={() => {
            setIsOpenRoomInfo((prev) => !prev);
          }}
        >
          <InfoIcon className={cx('see-info-icon')} width={'2.2rem'} height={'2.2rem'} />
        </button>
      </div>
    </div>
  );
}

export default memo(ChatHeader);
