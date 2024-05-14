import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './AddingGroupChatMembersModal.module.scss';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import Cookies from 'universal-cookie';

import AccountItem from '../AccountItem';
import Button from '../Button';
import { CloseIcon, SearchIcon, TickBoxIcon, UnCheckTickBox } from '../Icons';
import { createId } from '~/UserDefinedFunctions';
import { ContactsContext } from '~/Context/ContactsContext';
import { CurrentRoomContext } from '~/Context/CurrentRoomContext';
import { MessagesContext } from '~/Context/MessagesContext';
import { RoomStateContext } from '~/Context/RoomStateContext';
import { SocketContext } from '~/Context/SocketContext';
import OnlineContactItem from '../OnlineContactItem';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function AddingGroupChatMembersModal({ room_members, room_id, onClose }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_CONTEXT

  const roomStateContext = useContext(RoomStateContext);
  const setRoomState = roomStateContext.setRoomState;

  const messagesContext = useContext(MessagesContext);
  const setMessages = messagesContext.handleSetMessages;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const socket = useContext(SocketContext);

  // USE_STATE
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  // USE_EFFECT
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/users/suggested-users`, config)
      .then((result) => {
        const members = result.data.filter((member) => {
          return !room_members.some((currentMember) => currentMember.user_id === member.user_id);
        });
        setSuggestedUsers(members);
      })
      .catch((error) => {
        error = new Error();
      });
  }, []);

  useEffect(() => {
    handleSearchMembers();
  }, [searchValue]);

  // FUNCTION_HANDLER
  const handleSelectUser = (user) => {
    setMembers((prev) => {
      const isSelected = prev.findIndex((member) => member.user_id == user.user_id);
      if (isSelected !== -1) {
        return prev.filter((member) => member.user_id != user.user_id);
      } else {
        return [...prev, user];
      }
    });
  };

  const checkIsSelected = (user_id) => {
    return members.some((member) => {
      return member.user_id == user_id;
    });
  };

  const handleSubmit = () => {
    const payload = {
      admin_id: user.user_id,
      members: members,
      room_id,
      joined_at: moment().valueOf(),
    };

    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .post(`/rooms/add-users`, payload, configurations)
      .then((result) => {
        return new Promise((resolve, reject) => {
          let notificationPackage = {
            room_id,
            sender_id: user.user_id,
            members: members,
            state_type: 'add_member',
            notifications: [],
          };
          members.forEach((member, ind) => {
            const check = room_members.filter((currentMember) => currentMember.user_id === member);
            if (check.length === 0) {
              const messageId = createId(0, room_id, ind);
              notificationPackage.notifications.push({
                message_id: messageId,
                room_id,
                message: `${member.full_name} was added to room`,
                created_at: moment().valueOf(),
                member_id: member.user_id,
                type: 'text',
                author_id: null,
              });
            }
          });

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
        onClose();
        setRoomState(notificationPackage);
        setMessages((prev) => [...prev, ...notificationPackage.notifications]);
        socket.emit('add-members', { members: members, room_id, notificationPackage });
      })
      .catch((error) => {
        error = new Error();
      });
  };

  const handleSearchMembers = () => {
    const params = {
      searchValue,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/users/search-users`, configurations)
      .then((result) => {
        const members = result.data.filter((member) => {
          const check = room_members.findIndex((currentMember) => currentMember.user_id === member.user_id);
          return check === -1;
        });
        setSuggestedUsers(members);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={cx('wrapper')} onClick={onClose}>
      <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
        <div className={cx('header')}>
          <h3>Add Group Members</h3>
          <button className={cx('close-btn')} height={'2.2rem'} onClick={onClose}>
            <CloseIcon width={'2.4rem'} height="2.4rem" />
          </button>
        </div>
        <div className={cx('search-box')}>
          <input
            value={searchValue}
            placeholder="Search..."
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
          <button>
            <SearchIcon width={'2.2rem'} height={'2.2rem'} />
          </button>
        </div>
        <div className={cx('body')}>
          {suggestedUsers.map((suggestedUser, ind) => {
            const check = checkIsSelected(suggestedUser.user_id);
            return (
              <div
                key={suggestedUser.user_id}
                className={cx('contact-item-wrapper')}
                onClick={() => handleSelectUser({ user_id: suggestedUser.user_id, full_name: suggestedUser.full_name })}
              >
                <OnlineContactItem
                  contact_avatar={suggestedUser.user_avatar}
                  contact_name={suggestedUser.full_name}
                  description={'1 mutual group'}
                  className={cx('account-item')}
                  avatar_width={36}
                  avatar_height={36}
                />
                {check ? (
                  <TickBoxIcon className={cx('contact-tick-box')} width="2.8rem" height="2.8rem" />
                ) : (
                  <UnCheckTickBox className={cx('contact-tick-box')} width="2.8rem" height="2.8rem" />
                )}
              </div>
            );
          })}
        </div>
        <div className={cx('footer')}>
          <button className={cx('cancel-btn')} onClick={onClose}>
            Cancel
          </button>
          <button className={cx('submit-btn')} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddingGroupChatMembersModal;
