import classNames from 'classnames/bind';
import styles from './MemberListModal.module.scss';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import Cookies from 'universal-cookie';
import OnlineContactItem from '../OnlineContactItem';
import {
  CloseIcon,
  EditIcon,
  InfoIcon,
  LogOutIcon,
  MessageDot,
  ThreeDotIcon,
  UserCheck,
  UserGroupIcon,
  UserIcon,
  UserMinus,
} from '../Icons';
import TippyHeadless from '@tippyjs/react/headless';
import TippyWrapper from '../TippyWrapper';
import OptionItem from '../OptionItem';
import DropDownMenu from '../DropDownMenu';
import { useNavigate } from 'react-router-dom';
import { createId } from '~/UserDefinedFunctions';
import moment from 'moment';
import { RoomStateContext } from '~/Context/RoomStateContext';
import { MediaContext } from '~/Context/MediaContext';
import { MessagesContext } from '~/Context/MessagesContext';
import { SocketContext } from '~/Context/SocketContext';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cookies = new Cookies();
const cx = classNames.bind(styles);

function MemberListModal({ members, admin_id, room_id, setIsOpenMemberList }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_NAVIGATE
  const navigate = useNavigate();

  // // USE_CONTEXT
  const roomStateContext = useContext(RoomStateContext);
  const setRoomState = roomStateContext.setRoomState;

  const messagesContext = useContext(MessagesContext);
  const setMessages = messagesContext.handleSetMessages;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const socket = useContext(SocketContext);

  // USE_STATE

  // USE_EFFECT

  // FUNCTION_HANDLER
  const handleRedirectToProfile = (user_id) => {
    navigate(`/profiles/${user_id}/posts`, { replace: true });
  };

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
      })
      .catch((err) => console.log(err));
  };

  const handleSetAdmin = (room_id, authorizedUser) => {
    const payload = {
      authorizeduser_id: authorizedUser.user_id,
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
        socket.emit('change-room-state', { room_id, notificationPackage });
        setRoomState(notificationPackage);
      })
      .catch((err) => console.log(err));
  };

  const handleOpenChatBox = (contact_id) => {
    const params = {
      user_id: contact_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/message-datas/check-exist`, configurations)
      .then((result) => {
        const room_id = result.data.room_id;
        navigate(`/messenger/${room_id}`, { replace: true });
      })
      .catch((error) => {
        error = new Error();
        console.log(error);
      });
  };

  return (
    <div className={cx('wrapper')} onClick={() => setIsOpenMemberList(false)}>
      <div
        className={cx('container')}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={cx('header')}>
          <p>Members</p>
        </div>
        <div className={cx('body')}>
          <div className={cx('member-list')}>
            {members.map((member, ind) => {
              let role = 'Member';
              if (admin_id == member.user_id) {
                role = 'Admin';
              }

              let options = [
                {
                  icon: <UserCheck width="2.6rem" height="2.6rem" />,
                  title: 'Make Admin',
                  onClick: () => handleSetAdmin(room_id, member),
                },
                {
                  icon: <UserMinus width="2.4rem" height="2.4rem" />,
                  title: 'Remove from Group',
                  onClick: () => {
                    handleRemoveUserFromRoom(member, room_id);
                  },
                },
                {
                  icon: <UserIcon width="2.4rem" height="2.4rem" />,
                  title: 'Message',
                  onClick: () => handleOpenChatBox(member.user_id),
                },
                {
                  icon: <UserIcon width="2.4rem" height="2.4rem" />,
                  title: 'Profile',
                  onClick: () => handleRedirectToProfile(member.user_id),
                },
              ];

              if (admin_id !== user.user_id) {
                options = [
                  {
                    icon: <UserIcon width="2.4rem" height="2.4rem" />,
                    title: 'Profile',
                    onClick: () => handleRedirectToProfile(member.user_id),
                  },
                  {
                    icon: <UserIcon width="2.4rem" height="2.4rem" />,
                    title: 'Message',
                    onClick: () => handleOpenChatBox(member.user_id),
                  },
                ];
              }

              if (user.user_id === member.user_id) {
                options = undefined;
              }

              return (
                <OnlineContactItem
                  className={cx('member-item')}
                  key={ind}
                  contact_name={member.full_name}
                  contact_avatar={member.user_avatar}
                  description={role}
                  options={options}
                  avatar_width={36}
                  avatar_height={36}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberListModal;
