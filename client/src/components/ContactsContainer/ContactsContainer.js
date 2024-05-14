import classNames from 'classnames/bind';
import styles from './ContactsContainer.module.scss';
import { memo, useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import ContactItem from '../ContactItem/ContactItem';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { ContactsContext } from '~/Context/ContactsContext';
import { StrangeMessageContext } from '~/Context/StrangeMessageContext';
import { RoomStateContext } from '~/Context/RoomStateContext';
import { OnlineUsersContext } from '~/Context/OnlineUsersContext';
import { SocketContext } from '~/Context/SocketContext';
import { FriendsContext } from '~/Context/FriendsContext';
import moment from 'moment';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cookies = new Cookies();
const cx = classNames.bind(styles);

function ContactsContainer({ chatFilter }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_CONTEXT
  const contactsContext = useContext(ContactsContext);
  const setContacts = contactsContext.handleSetContacts;
  const contacts = contactsContext.contacts;

  const isStrangeContext = useContext(StrangeMessageContext);
  const setIsStrange = isStrangeContext.handleSetIsStrange;
  const isStrange = isStrangeContext.isStrange;

  const roomStateContext = useContext(RoomStateContext);
  const roomState = roomStateContext.roomState;
  const setRoomState = roomStateContext.setRoomState;

  const onlineUsersContext = useContext(OnlineUsersContext);
  const onlineUsers = onlineUsersContext.onlineUsers;

  const relationshipContext = useContext(FriendsContext);
  const relationship = relationshipContext.relationship;
  const setRelationship = relationshipContext.setRelationship;

  // USE_STATE

  // USE_EFFECT

  const renderContacts = () => {
    let contactsComps = [];

    switch (chatFilter) {
      case 'friends':
        contacts?.forEach((contact, ind) => {
          if (contact.room_type != 1) {
            return;
          }

          if (
            !relationship.some((friend) => {
              const member = contact.members.filter((member) => member.user_id !== user.user_id)[0];
              return friend.guest_id == member?.user_id;
            })
          ) {
            return;
          }

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
            <ContactItem
              key={ind}
              contactName={contactName}
              contactAvatar={contactAvatar}
              type={contact.type}
              author_name={contact.author_name}
              isSeen={contact.isSeen}
              room_id={contact.room_id}
              created_at={contact.created_at}
              message={contact.message}
              isOnline={check}
            />,
          );
        });

        break;

      case 'all_chats':
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
            <ContactItem
              key={ind}
              contactName={contactName}
              contactAvatar={contactAvatar}
              type={contact.type}
              author_name={contact.author_name}
              isSeen={contact.isSeen}
              room_id={contact.room_id}
              created_at={contact.created_at}
              message={contact.message}
              isOnline={check}
            />,
          );
        });

        break;

      case 'groups':
        contacts?.forEach((contact, ind) => {
          if (contact.room_type != 2) {
            return;
          }

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
            <ContactItem
              key={ind}
              contactName={contactName}
              contactAvatar={contactAvatar}
              type={contact.type}
              author_name={contact.author_name}
              isSeen={contact.isSeen}
              room_id={contact.room_id}
              created_at={contact.created_at}
              message={contact.message}
              isOnline={check}
            />,
          );
        });

        break;

      case 'un_read':
        contacts?.forEach((contact, ind) => {
          if (contact.isSeen) {
            return;
          }

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
            <ContactItem
              key={ind}
              contactName={contactName}
              contactAvatar={contactAvatar}
              type={contact.type}
              author_name={contact.author_name}
              isSeen={contact.isSeen}
              room_id={contact.room_id}
              created_at={contact.created_at}
              message={contact.message}
              isOnline={check}
            />,
          );
        });

        break;

      default:
        break;
    }
    return contactsComps;
  };

  return <div className={cx('wrapper')}>{renderContacts()}</div>;
}

export default memo(ContactsContainer);
