import classNames from 'classnames/bind';
import styles from './RoomCustomizing.module.scss';
import AlertModal from '../AlertModal';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import Cookies from 'universal-cookie';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';
import { CurrentRoomContext } from '~/Context/CurrentRoomContext';
import { OnlineUsersContext } from '~/Context/OnlineUsersContext';
import { RoomStateContext } from '~/Context/RoomStateContext';
import { MessagesContext } from '~/Context/MessagesContext';
import { SocketContext } from '~/Context/SocketContext';
import axios from 'axios';
import { createId } from '~/UserDefinedFunctions';
import moment from 'moment';
import { ChatBoxesContext } from '~/Context/ChatBoxesContext';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cookies = new Cookies();
const cx = classNames.bind(styles);

function RoomCustomizing({ room_id, room_name, room_avatar, isOpenRoomCustomizing, setIsOpenRoomCustomizing }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_REF
  const imgInpRef = useRef(null);
  const addMembersModalRef = useRef(null);

  // USE_CONTEXT

  const roomStateContext = useContext(RoomStateContext);
  const setRoomState = roomStateContext.setRoomState;

  const chatBoxesContext = useContext(ChatBoxesContext);
  const setChatBoxes = chatBoxesContext.setChatBoxes;
  const chatBoxes = chatBoxesContext.chatBoxes;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const socket = useContext(SocketContext);

  // USE_STATE
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomImg, setNewRoomImg] = useState();
  const [isOnline, setIsOnline] = useState(false);

  // USE_EFFECT

  useEffect(() => {
    if (isOpenRoomCustomizing) {
      setNewRoomImg();
      setNewRoomName('');
    }
  }, [isOpenRoomCustomizing]);

  // FUNCTION HANDLER

  const handleSubmit = () => {
    const formData = new FormData();

    formData.append('room_name', newRoomName);
    formData.append('room_id', room_id);
    formData.append('roomAvatar', newRoomImg);

    const config = {
      headers: { 'content-type': 'multipart/form-data', Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}` },
    };
    if (newRoomName.trim() || newRoomImg) {
      axios
        .post(`/rooms/change-info/`, formData, config)
        .then((result) => {
          return new Promise((resolve, reject) => {
            let notificationPackage = {
              room_id: room_id,
              sender_id: user.user_id,
              state_type: 'change_room_info',
              notifications: [],
            };

            if (newRoomName) {
              const messageId = createId(user.user_id, room_id, 0);
              notificationPackage.notifications = [
                ...notificationPackage.notifications,
                {
                  message_id: messageId,
                  room_id: room_id,
                  message: `${user.full_name} has changed room name from '${room_name}' to '${newRoomName}'`,
                  created_at: moment().valueOf(),
                  type: 'text',
                  author_id: null,
                },
              ];
            }

            if (newRoomImg) {
              const messageId = createId(user.user_id, room_id, 1);
              notificationPackage.notifications = [
                ...notificationPackage.notifications,
                {
                  message_id: messageId,
                  room_id: room_id,
                  message: `${user.full_name} has changed room picture`,
                  created_at: moment().valueOf(),
                  type: 'text',
                  author_id: null,
                },
              ];
            }

            const payload = {
              notifications: notificationPackage.notifications,
            };

            const configurations = {
              headers: {
                Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
              },
            };

            notificationPackage.length !== 0 &&
              axiosInstance
                .post(`/message-datas/notification`, payload, configurations)
                .then((result) => {
                  resolve({ result, notificationPackage });
                })
                .catch((err) => reject(err));
          });
        })
        .then(({ result, notificationPackage }) => {
          socket.emit('change-room-state', { room_id: room_id, notificationPackage });

          setRoomState(notificationPackage);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className={cx('wrapper')}>
      <AlertModal headerTitle="Custom Chat" setIsShowAlert={setIsOpenRoomCustomizing} onSubmit={handleSubmit}>
        <div className={cx('form-item')}>
          <label className={cx('form-item-header')}>Change Group Name</label>
          <input
            value={newRoomName}
            placeholder="Type group name here"
            onChange={(e) => setNewRoomName(e.target.value)}
          />
        </div>
        <div className={cx('form-item')}>
          <label className={cx('form-item-header')}>Change Profile Picture</label>
          <input
            ref={imgInpRef}
            type="file"
            className={cx('hiden')}
            onChange={(e) => {
              setNewRoomImg(e.target.files[0]);
            }}
          />
          <div className={cx('room-img')}>
            <img src={newRoomImg ? URL.createObjectURL(newRoomImg) : room_avatar} alt="room-img" />
          </div>
          <div className={cx('get-file-container')}>
            <p className={cx('get-file-title')}>{newRoomImg?.name ? newRoomImg?.name : 'Change picture'}</p>
            <button
              className={cx('get-file-btn')}
              onClick={() => {
                imgInpRef?.current.click();
              }}
            >
              Browse
            </button>
          </div>
        </div>
      </AlertModal>
    </div>
  );
}

export default RoomCustomizing;
