import classNames from 'classnames/bind';
import styles from './MembersTab.module.scss';
import TabLayout from '../TabLayout/TabLayout';
import { BlockIcon, LogOutIcon, PhotoIcon, SettingUserIcon, UserGroupIcon, UserIcon } from '~/components/Icons';
import Cookies from 'universal-cookie';
import { useContext } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { CurrentRoomContext } from '~/Context/CurrentRoomContext';
import OnlineContactItem from '~/components/OnlineContactItem';
import { MessageDot } from '~/components/Icons';
import moment from 'moment';
import axios from 'axios';
import { createId } from '~/UserDefinedFunctions';
import { RoomStateContext } from '~/Context/RoomStateContext';
import { MessagesContext } from '~/Context/MessagesContext';
import { SocketContext } from '~/Context/SocketContext';
import { useNavigate } from 'react-router-dom';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function MembersTab({ room_id, setCurrentTab }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const navigate = useNavigate();

  // USE_CONTEXT
  const currentRoomContext = useContext(CurrentRoomContext);
  const currentRoom = currentRoomContext.currentRoom;
  const setCurrentRoom = currentRoomContext.handleSetCurrentRoom;

  const roomStateContext = useContext(RoomStateContext);
  const roomState = roomStateContext.roomState;
  const setRoomState = roomStateContext.setRoomState;

  const messagesContext = useContext(MessagesContext);
  const setMessages = messagesContext.handleSetMessages;
  const socket = useContext(SocketContext);

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // FUNCTION_HANDLER

  const handleRemoveUserFromRoom = (member, room_id) => {
    const payload = {
      admin_id: user.user_id,
      room_id,
      deleteduser_id: member.user_id,
      left_at: moment().valueOf(),
    };

    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .post(`/rooms/remove-user`, payload, configurations)
      .then((result) => {
        return new Promise((resolve, reject) => {
          const messageId = createId(0, room_id, member.user_id);
          let notificationPackage = {
            room_id,
            member_id: member.user_id,
            sender_id: user.user_id,
            state_type: 'remove_member',
            notifications: [
              {
                message_id: messageId,
                room_id,
                message: `${member.full_name} was removed from room`,
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
        socket.emit('change-room-state', { member, room_id, notificationPackage });
        setRoomState(notificationPackage);
        setMessages((prev) => [...prev, ...notificationPackage.notifications]);
      })
      .catch((err) => console.log(err));
  };

  const handleSetAdmin = (room_id, admin_id, authorizedUser) => {
    const payload = {
      authorizeduser_id: authorizedUser.user_id,
      admin_id,
      room_id,
    };

    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .post(`/rooms/set-admin/${room_id}`, payload, configurations)
      .then((result) => {
        return new Promise((resolve, reject) => {
          const messageId = createId(0, room_id);
          let notificationPackage = {
            room_id,
            member_id: authorizedUser.user_id,
            sender_id: user.user_id,
            state_type: 'set_admin',
            notifications: [
              {
                message_id: messageId,
                room_id,
                message: `${authorizedUser.full_name} is admin now`,
                created_at: moment().valueOf(),
                type: 'text',
                author_id: null,
              },
            ],
          };

          const payload = {
            authorizeduser_id: authorizedUser.user_id,
            admin_id,
            room_id,
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
        socket.emit('change-room-state', { room_id, notificationPackage });
        setRoomState(notificationPackage);
        setMessages((prev) => [...prev, ...notificationPackage.notifications]);
      })
      .catch((err) => console.log(err));
  };

  const handleRedirectToProfile = (user_id) => {
    navigate(`/profiles/${user_id}/posts`, { replace: true });
  };

  return (
    <TabLayout
      icon={<UserGroupIcon className={cx('members-icon')} width={'2.6rem'} height={'2.6rem'} />}
      header_title={'Participants'}
      onClose={() => setCurrentTab()}
    >
      <div className={cx('members-wrapper')}>
        {currentRoom?.members.map((member, ind) => {
          let options = [
            {
              icon: <UserIcon height="2.4rem" width="2.4rem" />,
              title: 'See Profile',
              onClick: () => {
                handleRedirectToProfile(member.user_id);
              },
            },
          ];

          if (
            currentRoom?.admin_id &&
            member.user_id != currentRoom?.admin_id &&
            currentRoom?.admin_id == user.user_id
          ) {
            options.push({
              icon: <SettingUserIcon height="2.4rem" width="2.4rem" />,
              title: 'Make Admin',
              onClick: () => handleSetAdmin(currentRoom?.room_id, currentRoom?.admin_id, member),
            });
            options.push({
              icon: <LogOutIcon height="2.4rem" width="2.4rem" />,
              title: 'Remove from room',
              color: 'red',
              onClick: () => handleRemoveUserFromRoom(member, currentRoom?.room_id),
            });
          }

          if (user.user_id == member.user_id) {
            options = undefined;
          }

          return (
            <OnlineContactItem
              key={member.user_id}
              className={cx('member-item')}
              contact_avatar={member.user_avatar}
              contact_name={member.full_name}
              description={'1 mutual group'}
              options={options}
              medium
              avatar_width={36}
              avatar_height={36}
            />
          );
        })}
      </div>
    </TabLayout>
  );
}

export default MembersTab;
