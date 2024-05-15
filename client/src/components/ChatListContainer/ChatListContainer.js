import classNames from 'classnames/bind';
import styles from './ChatListContainer.module.scss';
import OnlineContactItem from '../OnlineContactItem';
import DropDownMenu from '../DropDownMenu';
import OptionItem from '../OptionItem';
import { useContext, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { ChatBoxesContext } from '~/Context/ChatBoxesContext';
import Cookies from 'universal-cookie';
import { ContactsContext } from '~/Context/ContactsContext';
import moment from 'moment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { StrangeMessageContext } from '~/Context/StrangeMessageContext';
import { CloseIcon, EditIcon, EllipsisIcon, MessageDot, MessageIcon, ThreeDotIcon, XMarkIcon } from '../Icons';
import TippyWrapper from '../TippyWrapper';
import IconBtn from '../IconBtn';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function ChatListContainer({ setIsOpen }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_CONTEXT
  const chatBoxesContext = useContext(ChatBoxesContext);
  const setChatBoxes = chatBoxesContext.setChatBoxes;
  const chatBoxes = chatBoxesContext.chatBoxes;

  const contactsContext = useContext(ContactsContext);
  const setContacts = contactsContext.handleSetContacts;
  const contacts = contactsContext.contacts;

  const isStrangeContext = useContext(StrangeMessageContext);
  const setIsStrange = isStrangeContext.handleSetIsStrange;
  const isStrange = isStrangeContext.isStrange;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE
  const [optionContact, setOptionContact] = useState(false);

  // FUNCTION_HANDLER
  const handleOpenChatBox = (contact) => {
    if (chatBoxes.length > 3) {
      return;
    }
    if (chatBoxes.some((chatBox) => chatBox.contact.room_id == contact.room_id)) {
      return;
    }

    const params = {
      room_id: contact.room_id,
      quantity: 10,
      last_seen_at: moment().valueOf(),
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    if (contact.room_id) {
      axiosInstance
        .get(`/message-datas/${contact.room_id}`, configurations)
        .then((result) => {
          let messages = result.data.content;
          let read_message_data = result.data.lastSeenInfo;
          let removed_message_data = result.data.removeData;

          const params = {
            room_id: contact.room_id,
          };

          const configurations = {
            params: params,
            headers: {
              Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
            },
          };

          axiosInstance
            .get(`/rooms/${contact.room_id}`, configurations)
            .then((result) => {
              messages = messages.map((message) => {
                return { ...message, isSent: true };
              });

              setChatBoxes((prev) => [
                ...prev,
                {
                  contact: { ...result.data },
                  messages: messages,
                  read_message_data,
                  removed_message_data,
                },
              ]);
            })
            .catch((error) => {
              error = new Error(error);
              console.log(error);
            });
        })
        .catch((error) => {
          error = new Error(error);
          console.log(error);
        });
    }
  };

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
        setIsStrange((prev) => !prev);
      })
      .catch((err) => console.log(err));
  };

  const handleOpenMessenger = (chat_id) => {
    navigate(`/messenger/${chat_id}`, { replace: true });
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <h4 className={cx('header-title')}>Messages</h4>
        <button className={cx('options-btn')}>
          <ThreeDotIcon width="2.3rem" height="2.3rem" />
        </button>
      </div>
      <div className={cx('body')}>
        {contacts.map((contact, ind) => {
          let contactName = '';
          let contactAvatar = '';
          if (contact.room_type === 1) {
            const member = contact.members.filter((member) => member.user_id !== user.user_id)[0];
            contactName = member?.full_name;
            contactAvatar = member?.user_avatar;
          } else {
            contactName = contact.room_name;
            contactAvatar = contact.room_avatar;
          }

          return (
            <div key={ind} className={cx('contact-item')}>
              <OnlineContactItem
                className={cx('member-item')}
                contact_name={contactName}
                contact_avatar={contactAvatar}
                description={contact.message}
                des_timestamp={contact.created_at}
                unread={!contact.isSeen}
                large
                onClick={(e) => {
                  setIsOpen(false);
                  handleOpenChatBox(contact);
                  e.stopPropagation();
                }}
                options={[
                  {
                    icon: <MessageDot width="2.6rem" height="2.6rem" />,
                    title: 'Open In Messenger',
                    onClick: () => handleOpenMessenger(contact.room_id),
                  },
                  {
                    icon: <CloseIcon width="2.4rem" height="2.4rem" />,
                    title: 'Remove Chat',
                    onClick: () => handleRemoveChat(contact.room_id),
                  },
                ]}
                avatar_width={50}
                avatar_height={50}
              />
            </div>
          );
        })}
      </div>
      <div className={cx('footer')}>Open in Messenger</div>
    </div>
  );
}

export default ChatListContainer;
