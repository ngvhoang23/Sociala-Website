import classNames from 'classnames/bind';
import styles from './OnlineContactContainer.module.scss';
import OnlineContactItem from '../OnlineContactItem';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { OnlineUsersContext } from '~/Context/OnlineUsersContext';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { ContactsContext } from '~/Context/ContactsContext';
import ContactItem from '../ContactItem';
import { CurrentRoomContext } from '~/Context/CurrentRoomContext';
import { ChatBoxesContext } from '~/Context/ChatBoxesContext';
import moment from 'moment';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function OnlineContactContainer({ className, handleOpenChatBox }) {
  const cx = classNames.bind(styles);

  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_CONTEXT
  const onlineUsersContext = useContext(OnlineUsersContext);
  const onlineUsers = onlineUsersContext.onlineUsers;

  const contactsContext = useContext(ContactsContext);
  const setContacts = contactsContext.handleSetContacts;
  const contacts = contactsContext.contacts;

  const currentRoomContext = useContext(CurrentRoomContext);
  const currentRoom = currentRoomContext.currentRoom;
  const setCurrentRoom = currentRoomContext.handleSetCurrentRoom;

  const chatBoxesContext = useContext(ChatBoxesContext);
  const setChatBoxes = chatBoxesContext.setChatBoxes;
  const chatBoxes = chatBoxesContext.chatBoxes;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/users/suggested-users/`, config)
      .then((result) => {
        setSuggestedUsers(result.data);
      })
      .catch((error) => {
        error = new Error();
      });
  }, []);

  const renderContacts = () => {
    let contactsComps = [];

    contacts?.forEach((contact, ind) => {
      const check = contact.members?.some((member) => {
        const index = onlineUsers.findIndex((onlineUser) => {
          return onlineUser.user_id == member.user_id && member.user_id != user.user_id;
        });
        return index !== -1 ? 1 : 0;
      });

      let contactName = '';
      let contactAvatar = '';

      contactName =
        contact.room_type === 1
          ? contact.members.filter((member) => member.user_id !== user.user_id)[0]?.full_name
          : contact.room_name;

      if (contact.room_type === 1) {
        const member = contact.members.filter((member) => member.user_id !== user.user_id)[0];

        contactName = member?.full_name;
        contactAvatar = member?.user_avatar;
      } else {
        contactName = contact.room_name;
        contactAvatar = contact.room_avatar;
      }

      contactsComps.push(
        <OnlineContactItem
          className={cx('contact-item')}
          key={ind}
          room_id={contact.room_id}
          contact_name={contactName}
          contact_avatar={contactAvatar}
          online_info={{ status: false, timestamp: '2022-12-03T01:49:52.000Z' }}
          onClick={() => handleOpenChatBox(contact)}
          avatar_width={36}
          avatar_height={36}
        />,
      );
    });

    return contactsComps;
  };

  return (
    <div className={cx('wrapper', { [className]: className })}>
      <div className={cx('header')}>
        <p className={cx('header-title')}>Contacts</p>
      </div>

      <div className={cx('container')}>{renderContacts()}</div>
    </div>
  );
}

export default OnlineContactContainer;
