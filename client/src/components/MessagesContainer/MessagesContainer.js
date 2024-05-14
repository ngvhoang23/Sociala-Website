import classNames from 'classnames/bind';
import styles from './MessagesContainer.module.scss';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { json, useParams } from 'react-router-dom';
import moment from 'moment';
import { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useContext } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import MessageTag from '../MessageTag/MessageTag';
import { memo } from 'react';
import { MessagesContext } from '~/Context/MessagesContext';
import { ContactsContext } from '~/Context/ContactsContext';
import { RoomStateContext } from '~/Context/RoomStateContext';
import { CurrentRoomContext } from '~/Context/CurrentRoomContext';
import { SocketContext } from '~/Context/SocketContext';
import { NewMessageContext } from '~/Context/NewMessageContext';
import { binarySearch, indexOfNearestLessThan } from '~/UserDefinedFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MediaPreviewContext } from '~/Context/MediaPreviewContext';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';
const cookies = new Cookies();

const cx = classNames.bind(styles);

function MessagesContainer() {
  // CONSTANCE
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_PARAMS
  const { room_id } = useParams();

  // USE_REF
  const lastMessageRef = useRef(null);
  const topBorderRef = useRef(null);
  const isAtBottom = useIsInViewport(lastMessageRef);
  const isAtTop = useIsInViewport(topBorderRef);

  // USE_STATE
  const [quantityMessages, setQuantityMessages] = useState(10);
  const [seenInfo, setSeenInfo] = useState([]);
  const [removedMessageData, setRemovedMessageData] = useState();
  const [arrivalMessage, setArrivalMessage] = useState();
  const [removedMessage, setRemovedMessage] = useState();
  const [completedMessages, setCompletedMessages] = useState();
  const [isNoMoreMessage, setIsNoMoreMessage] = useState(false);
  const [media, setMedia] = useState([]);
  const [currentMediaView, setCurrentMediaView] = useState(false);

  // USE_CONTEXT
  const messagesContext = useContext(MessagesContext);
  const messages = messagesContext.messages;
  const setMessages = messagesContext.handleSetMessages;

  const contactsContext = useContext(ContactsContext);
  const setContacts = contactsContext.handleSetContacts;
  const contacts = contactsContext.contacts;

  const roomStateContext = useContext(RoomStateContext);
  const roomState = roomStateContext.roomState;
  const setRoomState = roomStateContext.setRoomState;

  const currentRoomContext = useContext(CurrentRoomContext);
  const currentRoom = currentRoomContext.currentRoom;
  const setCurrentRoom = currentRoomContext.handleSetCurrentRoom;

  const newMessageContext = useContext(NewMessageContext);
  const newMessage = newMessageContext.newMessage;
  const setNewMessage = newMessageContext.setNewMessage;

  const mediaPreviewContext = useContext(MediaPreviewContext);
  const mediaPreview = mediaPreviewContext.mediaPreview;
  const setMediaPreview = mediaPreviewContext.setMediaPreview;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const socket = useContext(SocketContext);

  // USE_EFFECT

  // GET MESSAGE FROM DATABASE
  useEffect(() => {
    const params = {
      room_id,
      quantity: quantityMessages,
      last_seen_at: moment().valueOf(),
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    if (room_id) {
      axiosInstance
        .get(`/message-datas/${room_id}`, configurations)
        .then((result) => {
          setSeenInfo(result.data.lastSeenInfo);
          setRemovedMessageData(result.data.removeData);
          let messages = result.data.content;
          messages = messages.map((message) => {
            return { ...message, isSent: true };
          });
          setMessages(messages);
        })
        .catch((error) => {
          error = new Error();
        });
    }

    // SET ISSEEN FOR CONTACT
    const ind = contacts.findIndex((contact) => contact.room_id == room_id);

    if (ind != -1) {
      if (!contacts[ind].isSeen && new Date(contacts[ind].created_at) <= new Date(moment().valueOf())) {
        contacts[ind].isSeen = true;
        setContacts(JSON.parse(JSON.stringify(contacts)));
      }
    }
  }, [room_id]);

  // update runtime when other user seen message => in component
  useEffect(() => {
    socket?.on('readResponse', (data) => {
      if (data.room_id == room_id) {
        setSeenInfo((prev) => {
          const ind = prev.findIndex((member) => member.user_id == data.userSeen.user_id);
          if (ind != -1) prev[ind].last_seen_at = data.last_seen_at;
          return JSON.parse(JSON.stringify(prev));
        });
      }
    });
  }, [socket, room_id, seenInfo]);

  // emit read message when visit to any room => in component
  useEffect(() => {
    const receivers = currentRoom?.members.filter((member) => member.user_id !== user.user_id);
    currentRoom &&
      socket?.emit('read', {
        user,
        receivers,
        last_seen_at: moment().valueOf(),
        room_id: currentRoom.room_id,
        room_type: currentRoom.room_type,
      });
  }, [currentRoom]);

  // SOCKET_IO -- handle when receive remove-message-res => in component
  useEffect(() => {
    socket?.on('remove-message-res', (data) => {
      setRemovedMessage(data.message_id);
    });
  }, [socket]);

  // update message when a message is removed => in component
  useEffect(() => {
    if (removedMessage) {
      // const index = binarySearch(0, messages.length - 1, removedMessage, messages);

      const index = messages.findIndex((message) => message.message_id == removedMessage);

      if (index == -1) {
        return;
      }

      messages[index].isRemoved = true;
      setMessages(JSON.parse(JSON.stringify(messages)));
    }
  }, [removedMessage]);

  // => in component
  useEffect(() => {
    if (completedMessages) {
      if (currentRoom?.room_id === completedMessages?.room_id) {
        setMessages((prev) => {
          completedMessages.message_ids.forEach((completedMessageId) => {
            const index = prev.findIndex((message) => message.message_id === completedMessageId);
            if (index !== -1) {
              prev[index].isSent = true;
            }
          });
          return JSON.parse(JSON.stringify(prev));
        });
      }
    }
  }, [completedMessages?.message_ids]);

  // set messages when user is added to room => in component
  useEffect(() => {
    if (
      roomState &&
      roomState.state_type == 'add_member' &&
      roomState.members.some((member) => member.user_id == user.user_id)
    ) {
      const params = {
        room_id,
        quantity: quantityMessages,
        last_seen_at: moment().valueOf(),
      };

      const configurations = {
        params: params,
        headers: {
          Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
        },
      };

      if (room_id) {
        axiosInstance
          .get(`/message-datas/${room_id}`, configurations)
          .then((result) => {
            setSeenInfo(result.data.lastSeenInfo);
            setRemovedMessageData(result.data.removeData);
            let messages = result.data.content;
            messages = messages.map((message) => {
              return { ...message, isSent: true };
            });
            setMessages(messages);
          })
          .catch((error) => {
            error = new Error();
          });
      }

      // SET ISSEEN FOR CONTACT
      const ind = contacts.findIndex((contact) => contact.room_id == room_id);
      if (ind != -1) {
        if (!contacts[ind].isSeen && new Date(contacts[ind].created_at) <= new Date(moment().valueOf())) {
          contacts[ind].isSeen = true;
          setContacts(contacts);
        }
      }
    }
  }, [roomState]);

  // SOCKET_IO -- handle when sent messages successfully => in component
  useEffect(() => {
    socket?.on('sending_completed', ({ room_id, message_ids }) => {
      setCompletedMessages(JSON.parse(JSON.stringify({ room_id, message_ids })));
    });
  }, [socket]);

  // scroll into top when having new message => in component
  useEffect(() => {
    if (isAtBottom || newMessage?.author_id == user.user_id) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [newMessage, messages]);

  // => in component
  useEffect(() => {
    lastMessageRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [room_id, lastMessageRef?.current]);

  useEffect(() => {
    const params = {
      room_id: currentRoom?.room_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    currentRoom?.room_id &&
      axiosInstance
        .get(`/message-datas/media/${currentRoom?.room_id}`, configurations)
        .then((result) => {
          setMedia(result.data);
        })
        .catch((error) => {
          console.log(error);
        });
  }, [currentRoom?.room_id]);

  // Scroll into bottom when mount component

  // FUNCTION_HANDLER

  // user defined functions

  function useIsInViewport(ref) {
    const [isIntersecting, setIsIntersecting] = useState(false);

    const observer = useMemo(
      () =>
        new IntersectionObserver(([entry]) => {
          setIsIntersecting(entry.isIntersecting);
        }),
      [],
    );

    useEffect(() => {
      if (!ref?.current) {
        return;
      }
      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }, [ref, observer]);

    return isIntersecting;
  }

  const handleRemoveMessage = (removeType, message_id, message_index) => {
    const members = removeType === 0 ? [user] : currentRoom.members;
    setMessages((prev) => {
      prev.forEach((message) => {
        if (message.message_id == message_id) {
          message.isRemoved = true;
        }
      });

      return JSON.parse(JSON.stringify(prev));
    });

    const body = {
      message_id: message_id,
      room_id: room_id,
      users: members,
      user_id: user.user_id,
    };

    const payload = body;

    const configurations = {
      payload: payload,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .post(`/message-datas/remove/${message_id}`, payload, configurations)
      .then((res) => {})
      .catch((err) => console.log(err));
    // notify via socket

    if (removeType !== 0) {
      const req = {
        message_id: message_id,
        message_index,
        room_id: room_id,
        receivers: members.filter((member) => member.user_id !== user.user_id),
        user_id: user.user_id,
      };
      socket?.emit('remove-message-req', req);
    }
  };

  const renderMessages = () => {
    if (messages.length > 0) {
      removedMessageData?.forEach((removedMessage) => {
        const index = messages.findIndex((message) => message.message_id === removedMessage.message_id);
        if (index === -1) {
          return;
        }
        messages[index].isRemoved = true;
      });
      let tmp = JSON.parse(JSON.stringify(messages));

      seenInfo?.forEach((member) => {
        var value = indexOfNearestLessThan(messages, new Date(member.last_seen_at));

        if (value !== -1 && !tmp[value.index]?.last_seen_by) {
          tmp[value.index].last_seen_by = [];
          tmp[value.index].last_seen_by.push({
            user_id: member.user_id,
            full_name: member.full_name,
            avatar: member.user_avatar,
            last_seen_at: member.last_seen_at,
          });
        } else {
          value !== -1 &&
            tmp[value.index]?.last_seen_by.push({
              user_id: member.user_id,
              full_name: member.full_name,
              avatar: member.user_avatar,
              last_seen_at: member.last_seen_at,
            });
        }
      });

      return tmp.map((message, ind) => {
        const author_id = message.author_id;
        const following_author_id = messages[ind + 1]?.author_id;

        const author = {
          author_id: message.author_id,
          author_avatar: message.author_avatar,
        };

        return (
          <MessageTag
            className={cx('message-item')}
            key={message.message_id}
            message_index={message.message_index}
            author_id={author.author_id}
            author_avatar={author.author_avatar}
            created_at={message.created_at}
            isRemoved={message.isRemoved}
            isSent={message.isSent}
            type={message.type}
            message={message.message}
            file_size={message.file_size}
            file_name={message.file_name}
            message_id={message.message_id}
            room_id={message.room_id}
            seenInfo={message.last_seen_by}
            handleRemoveMessage={handleRemoveMessage}
            is_last_message={ind == tmp.length - 1}
            no_img={author_id === following_author_id}
            large
            onPreview={() => {
              if (message.type == 'image' || message.type == 'video') {
                const currentMediaView = { media_id: message.message_id, url: message.message, type: message.type };
                handleGetMedia(currentMediaView);
              }
            }}
          />
        );
      });
    }
  };

  // Function_handle show more messages
  const handleShowMoreMessages = () => {
    const params = {
      room_id,
      quantity: 10,
      last_message_index: messages[0].message_index,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    if (room_id) {
      axiosInstance
        .get(`/message-datas/more-messages/${room_id}`, configurations)
        .then((result) => {
          setMessages((prev) => {
            return [
              ...result.data.content.map((message) => {
                return { ...message, isSent: true };
              }),
              ...prev,
            ];
          });
          if (!result.data.content.length) {
            setIsNoMoreMessage(true);
          }
        })
        .catch((error) => {
          error = new Error();
        });
    }
  };

  const handleGetMedia = (currentMediaView) => {
    const params = {
      room_id: currentRoom?.room_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    currentRoom?.room_id &&
      axiosInstance
        .get(`/message-datas/media/${currentRoom?.room_id}`, configurations)
        .then((result) => {
          setMedia(result.data);
          setMediaPreview({
            media: result.data,
            currentMediaView: currentMediaView,
            setCurrentMediaView: setCurrentMediaView,
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  return (
    <div className={cx('wrapper')}>
      <div ref={topBorderRef} />
      <div className={cx('get-more-message-container', { ['slide-in']: isAtTop && !isNoMoreMessage })}>
        <div className={cx('get-more-messages-btn')} onClick={handleShowMoreMessages}>
          <FontAwesomeIcon className={cx('get-message-icon')} icon={faChevronUp} />
        </div>
      </div>

      <div className={cx('container')}>
        {messages && renderMessages()} <div ref={lastMessageRef} />
      </div>
    </div>
  );
}

export default memo(MessagesContainer);
