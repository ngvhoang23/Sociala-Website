import classNames from 'classnames/bind';
import moment from 'moment';
import { memo, useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import Cookies from 'universal-cookie';
import AlertModal from '~/components/AlertModal';
import {
  BellIcon,
  BlockIcon,
  EarthIcon,
  EditIcon,
  LogOutIcon,
  MuteBellIcon,
  SingleUserPlus,
  UserGroupIcon,
  UserIcon,
  UserPlus,
} from '~/components/Icons';
import { CurrentRoomContext } from '~/Context/CurrentRoomContext';
import { OnlineUsersContext } from '~/Context/OnlineUsersContext';
import { SocketContext } from '~/Context/SocketContext';
import { createId } from '~/UserDefinedFunctions';
import { RoomStateContext } from '../../../../../Context/RoomStateContext';
import styles from './RoomInfoCenter.module.scss';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';
import { MessagesContext } from '~/Context/MessagesContext';
import EditingGroupChatModal from '~/components/EditingGroupChatModal';
import { useNavigate } from 'react-router-dom';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import { RoomCustomizingContext } from '~/Context/RoomCustomizingContext';
import { RoomAddingMembersContext } from '~/Context/RoomAddingMembersContext';
import MediaItem2 from '~/components/MediaItem2/MediaItem2';

const cookies = new Cookies();
const cx = classNames.bind(styles);

function RoomInfoCenter() {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const navigate = useNavigate();

  // USE_REF
  const imgInpRef = useRef(null);
  const addMembersModalRef = useRef(null);

  // USE OUTSIDE
  useOutsideAlerter(addMembersModalRef, () => {
    setIsShowAddMembers(false);
  });

  // USE_CONTEXT
  const currentRoomContext = useContext(CurrentRoomContext);
  const currentRoom = currentRoomContext.currentRoom;

  const onlineUsersContext = useContext(OnlineUsersContext);
  const onlineUsers = onlineUsersContext.onlineUsers;

  const roomStateContext = useContext(RoomStateContext);
  const setRoomState = roomStateContext.setRoomState;

  const messagesContext = useContext(MessagesContext);
  const setMessages = messagesContext.handleSetMessages;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const roomCustomizingContext = useContext(RoomCustomizingContext);
  const setCustomizingRoomInfo = roomCustomizingContext.setRoomInfo;
  const customizingRoomInfo = roomCustomizingContext.roomInfo;

  const roomAddingMembersContext = useContext(RoomAddingMembersContext);
  const setInfoAdding = roomAddingMembersContext.setInfoAdding;
  const infoAdding = roomAddingMembersContext.infoAdding;

  const socket = useContext(SocketContext);

  // USE_STATE
  const [isShowAddMembers, setIsShowAddMembers] = useState(false);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [isShowCustomeBox, setIsShowCustomeBox] = useState(false);
  const [isInRoom, setIsInRoom] = useState(true);

  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomImg, setNewRoomImg] = useState();
  const [isOnline, setIsOnline] = useState(false);

  // USE_EFFECT

  useEffect(() => {
    if (isShowCustomeBox) {
      setNewRoomImg();
      setNewRoomName('');
    }
  }, [isShowCustomeBox]);

  useEffect(() => {
    const check = currentRoom?.members.findIndex((member) => member.user_id === user.user_id) !== -1;
    setIsInRoom(check);
  }, [currentRoom]);

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

  // FUNCTION HANDLER

  const leaveRoom = () => {
    if (currentRoom.admin_id === user.user_id) {
      setIsShowAlert(true);
      return;
    }

    const payload = {
      user_id: user.user_id,
      room_id: currentRoom.room_id,
      left_at: moment().valueOf(),
    };

    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .post(`/rooms/leave-room`, payload, configurations)
      .then((result) => {
        return new Promise((resolve, reject) => {
          const messageId = createId(0, currentRoom.room_id, user.user_id);
          let notificationPackage = {
            room_id: currentRoom.room_id,
            sender_id: user.user_id,
            member_id: user.user_id,
            state_type: 'leave_room',
            notifications: [
              {
                message_id: messageId,
                room_id: currentRoom.room_id,
                message: `${user.full_name} left the room`,
                created_at: moment().valueOf(),
                type: 'text',
                author_id: null,
              },
            ],
          };

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
        socket.emit('change-room-state', { user, room_id: currentRoom.room_id, notificationPackage });
        socket?.emit('leave_room', currentRoom.room_id);
        setRoomState(notificationPackage);
        setMessages((prev) => [...prev, ...notificationPackage.notifications]);
      })
      .catch((error) => {
        error = new Error();
      });
  };

  const handleSubmit = () => {
    const formData = new FormData();

    formData.append('room_name', newRoomName);
    formData.append('room_id', currentRoom.room_id);
    formData.append('roomAvatar', newRoomImg);

    const config = {
      headers: { 'content-type': 'multipart/form-data', Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}` },
    };
    if (newRoomName !== '' || newRoomImg) {
      axiosInstance
        .post(`/rooms/change-info/`, formData, config)
        .then((result) => {
          return new Promise((resolve, reject) => {
            let notificationPackage = {
              room_id: currentRoom.room_id,
              sender_id: user.user_id,
              state_type: 'change_room_info',
              notifications: [],
            };

            if (newRoomName) {
              const messageId = createId(user.user_id, currentRoom.room_id, 0);
              notificationPackage.notifications = [
                ...notificationPackage.notifications,
                {
                  message_id: messageId,
                  room_id: currentRoom.room_id,
                  message: `${user.full_name} has changed room name from '${currentRoom.room_name}' to '${newRoomName}'`,
                  created_at: moment().valueOf(),
                  type: 'text',
                  author_id: null,
                },
              ];
            }

            if (newRoomImg) {
              const messageId = createId(user.user_id, currentRoom.room_id, 1);
              notificationPackage.notifications = [
                ...notificationPackage.notifications,
                {
                  message_id: messageId,
                  room_id: currentRoom.room_id,
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
          socket.emit('change-room-state', { room_id: currentRoom.room_id, notificationPackage });
          setMessages((prev) => [...prev, ...notificationPackage.notifications]);
          setRoomState(notificationPackage);
        })
        .catch((err) => console.log(err));
    }
  };

  const getParticipantsQuantity = () => {
    return currentRoom?.members.filter((member) => member.user_id != user.user_id).length;
  };

  const handleRedirectToProfile = (user_id) => {
    if (!user_id) {
      return;
    }
    navigate(`/profiles/${user_id}/posts`, { replace: true });
  };

  return (
    <>
      <div className={cx('wrapper')}>
        <div className={cx('img-container')}>
          <MediaItem2
            item={{ url: currentRoom?.room_avatar, type: 'image' }}
            width={140}
            height={140}
            border_radius={1000}
            _styles={{
              boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
            }}
          />
          {isOnline ? <div className={cx('online-icon')}></div> : <></>}
        </div>
        <div className={cx('info')}>
          <h5 className={cx('room-name')}>{currentRoom?.room_name}</h5>
          <p className={cx('room-status')}>
            {currentRoom?.room_type == 1 ? (
              <>
                <EarthIcon width={'1.8rem'} height={'1.8rem'} />
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </>
            ) : (
              <>
                <UserGroupIcon width={'1.8rem'} height={'1.8rem'} />
                <span>{`${getParticipantsQuantity()} Participants`}</span>
              </>
            )}
          </p>
        </div>
        <div className={cx('quick-options')}>
          {currentRoom?.room_type === 1 ? (
            <>
              <div
                className={cx('option-item', 'favorite')}
                onClick={() => handleRedirectToProfile(currentRoom.guest.user_id)}
              >
                <UserIcon width={'2.4rem'} height={'2.4rem'} />
              </div>
              <div className={cx('option-item', 'block')}>
                <BlockIcon width={'2rem'} height={'2rem'} />
              </div>
            </>
          ) : (
            <>
              {currentRoom?.admin_id == user.user_id && (
                <div
                  className={cx('option-item', 'add-user')}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsShowAddMembers(true);
                    setInfoAdding({ members: currentRoom.members, room_id: currentRoom.room_id });
                  }}
                >
                  <UserPlus width={'2.4rem'} height={'2.4rem'} />
                </div>
              )}
              <div
                className={cx('option-item', 'edit-icon')}
                onClick={() => {
                  setCustomizingRoomInfo({
                    isOpenRoomCustomizing: true,
                    room_id: currentRoom?.room_id,
                  });
                }}
              >
                <EditIcon width="2.2rem" height="2.2rem" />
              </div>
              {isInRoom && (
                <div className={cx('option-item', 'block')} onClick={() => leaveRoom()}>
                  <LogOutIcon width={'2.4rem'} height={'2.4rem'} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isShowAlert && (
        <AlertModal setIsShowAlert={setIsShowAlert}>
          <p className={cx('alert-content')}>
            you are admin, if you want to leave this room, you must authorize your admin permission for another member
          </p>
        </AlertModal>
      )}
      {isShowCustomeBox && (
        <EditingGroupChatModal room_id={currentRoom.room_id} onClose={() => setIsShowCustomeBox(false)} />
      )}
    </>
  );
}

export default memo(RoomInfoCenter);
