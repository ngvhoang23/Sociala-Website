import classNames from 'classnames/bind';
import styles from './MiniChatBox.module.scss';
import { CloseIcon, EditIcon, LogOutIcon, MessageDot, UserGroupIcon, UserIcon, UserPlus } from '../Icons';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import MessageTag from '../MessageTag';
import Cookies from 'universal-cookie';
import moment from 'moment';
import { createId, indexOfNearestLessThan, isImage, isVideo } from '~/UserDefinedFunctions';
import { SocketContext } from '~/Context/SocketContext';
import { NewMessageContext } from '~/Context/NewMessageContext';
import { ChatBoxesContext } from '~/Context/ChatBoxesContext';
import MiniChatBoxTyper from '../MiniChatBoxTyper';
import { RoomStateContext } from '~/Context/RoomStateContext';
import TippyHeadless from '@tippyjs/react/headless';
import TippyWrapper from '../TippyWrapper';
import { useNavigate } from 'react-router-dom';
import AddMembersModal from '../AddingGroupChatMembersModal';
import MemberListModal from '../MemberListModal';
import IconBtn from '../IconBtn';
import { MediaPreviewContext } from '~/Context/MediaPreviewContext';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import { RoomCustomizingContext } from '~/Context/RoomCustomizingContext';
import { CheckingLayerContext } from '~/Context/CheckingLayerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { ContactsContext } from '~/Context/ContactsContext';
import { RoomAddingMembersContext } from '~/Context/RoomAddingMembersContext';
import MediaItem2 from '../MediaItem2/MediaItem2';

const cookies = new Cookies();
const cx = classNames.bind(styles);

function MiniChatBox({
  room_type,
  room_id,
  members,
  room_name,
  room_avatar,
  messages,
  read_message_data,
  admin_id,
  removed_message_data,
  className,
  onClose,
}) {
  // CONSTANCE
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_REF
  const lastMessageRef = useRef(null);
  const topBorderRef = useRef(null);
  const isAtBottom = useIsInViewport(lastMessageRef);
  const isAtTop = useIsInViewport(topBorderRef);

  // USE_CONTEXT
  const socket = useContext(SocketContext);

  const newMessageContext = useContext(NewMessageContext);
  const newMessage = newMessageContext.newMessage;
  const setNewMessage = newMessageContext.setNewMessage;

  const chatBoxesContext = useContext(ChatBoxesContext);
  const setChatBoxes = chatBoxesContext.setChatBoxes;
  const chatBoxes = chatBoxesContext.chatBoxes;

  const roomStateContext = useContext(RoomStateContext);
  const roomState = roomStateContext.roomState;
  const setRoomState = roomStateContext.setRoomState;

  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_CONTEXT
  const mediaPreviewContext = useContext(MediaPreviewContext);
  const mediaPreview = mediaPreviewContext.mediaPreview;
  const setMediaPreview = mediaPreviewContext.setMediaPreview;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const roomCustomizingContext = useContext(RoomCustomizingContext);
  const setCustomizingRoomInfo = roomCustomizingContext.setRoomInfo;
  const customizingRoomInfo = roomCustomizingContext.roomInfo;

  const checkingLayerContext = useContext(CheckingLayerContext);
  const functionHandlers = checkingLayerContext.functionHandlers;
  const setFunctionHandlers = checkingLayerContext.setFunctionHandlers;

  const contactsContext = useContext(ContactsContext);
  const setContacts = contactsContext.handleSetContacts;
  const contacts = contactsContext.contacts;

  const roomAddingMembersContext = useContext(RoomAddingMembersContext);
  const setInfoAdding = roomAddingMembersContext.setInfoAdding;
  const infoAdding = roomAddingMembersContext.infoAdding;

  // USE_STATE
  const [removedMessage, setRemovedMessage] = useState();
  const [isOpenRoomOptions, setIsOpenRoomOptions] = useState(false);
  const [contactInfo, setContactInfo] = useState();
  const [isOpenMemberList, setIsOpenMemberList] = useState();
  const [isLeavedRoom, setIsLeavedRoom] = useState(false);
  const [currentMediaView, setCurrentMediaView] = useState(false);
  const [media, setMedia] = useState([]);
  const [isNoMoreMessage, setIsNoMoreMessage] = useState(false);

  function useIsInViewport(ref) {
    const [isIntersecting, setIsIntersecting] = useState(false);

    const observer = useMemo(
      () =>
        new IntersectionObserver(([entry]) => {
          setIsIntersecting(entry.isIntersecting);
        }),
      [],
    );

    useEffect(() => {}, [isIntersecting]);

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

  // USE_EFFECT

  useEffect(() => {
    setIsLeavedRoom(!members.some((member) => member.user_id == user.user_id));
  }, [members]);

  useEffect(() => {
    setContactInfo(members.filter((member) => member.user_id != user.user_id));
  }, []);

  useEffect(() => {
    if (isAtBottom || newMessage?.author_id == user.user_id) {
      lastMessageRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [newMessage, chatBoxes]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, 10);
  }, []);

  // socket listener

  // update runtime when other user seen message => in component
  useEffect(() => {
    const onReadResponse = (data) => {
      const user_read_info = {
        full_name: data.userSeen.full_name,
        last_seen_at: data.last_seen_at,
        room_id: data.room_id,
        user_avatar: data.userSeen.user_avatar,
        user_id: data.userSeen.user_id,
        full_name: data.userSeen.full_name,
      };
      setChatBoxes((prev) => {
        return prev.map((chatBox) => {
          if (chatBox.contact.room_id == data.room_id) {
            const targetId = chatBox?.read_message_data?.findIndex(
              (user_read) => user_read.user_id == data.userSeen.user_id,
            );
            if (targetId == -1) {
              chatBox.read_message_data.push(user_read_info);
            } else {
              chatBox.read_message_data[targetId] = user_read_info;
            }
          }
          return chatBox;
        });
      });
    };
    socket?.on('readResponse', onReadResponse);
    return () => socket?.off('readResponse', onReadResponse);
  }, [socket]);

  // SOCKET_IO -- handle when receive remove-message-res => in component
  useEffect(() => {
    socket?.on('remove-message-res', (data) => {
      setRemovedMessage(data);
    });
  }, [socket]);

  // update message when a message is removed => in component
  useEffect(() => {
    if (removedMessage) {
      setChatBoxes((prev) => {
        return prev.map((chatBox) => {
          if (chatBox.contact.room_id == removedMessage.room_id) {
            let removedId;
            removedId = chatBox.messages.findIndex((message) => message.message_id == removedMessage.message_id);
            if (removedId != -1) {
              chatBox.messages[removedId].isRemoved = true;
            }
          }
          return chatBox;
        });
      });
    }
  }, [removedMessage]);

  // set messages when user is added to room => in component
  useEffect(() => {
    if (
      roomState &&
      roomState.state_type == 'add_member' &&
      roomState.members.some((member) => member.user_id == user.user_id)
    ) {
      if (!chatBoxes.some((chatBox) => chatBox.contact.room_id == roomState.room_id)) {
        return;
      }

      const params = {
        room_id: roomState.room_id,
        quantity: 5,
        last_seen_at: moment().valueOf(),
      };

      const configurations = {
        params: params,
        headers: {
          Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
        },
      };

      axiosInstance
        .get(`/message-datas/${roomState.room_id}`, configurations)
        .then((result) => {
          let messages = result.data.content;
          let read_message_data = result.data.lastSeenInfo;
          let removed_message_data = result.data.removeData;

          const params = {
            room_id: roomState.room_id,
          };

          const configurations = {
            params: params,
            headers: {
              Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
            },
          };

          axiosInstance
            .get(`/rooms/${roomState.room_id}`, configurations)
            .then((result) => {
              messages = messages.map((message) => {
                return { ...message, isSent: true };
              });

              setChatBoxes((prev) => {
                return prev.map((chatBox) => {
                  if (chatBox.contact.room_id == roomState.room_id) {
                    chatBox = {
                      contact: { ...result.data },
                      messages: messages,
                      read_message_data,
                      removed_message_data,
                    };
                  }
                  return chatBox;
                });
              });
            })
            .catch((error) => {
              error = new Error(error);
              console.log(error);
            });
        })
        .catch((error) => {
          error = new Error();
        });
    }
  }, [roomState]);

  useEffect(() => {
    const params = {
      room_id,
    };
    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };
    room_id &&
      axiosInstance
        .get(`/message-datas/media/${room_id}`, configurations)
        .then((result) => {
          setMedia(result.data);
        })
        .catch((error) => {
          console.log(error);
        });
  }, []);

  // Function_handler
  const renderMessages = () => {
    if (messages.length > 0) {
      removed_message_data?.forEach((removedMessage) => {
        const index = messages.findIndex((message) => message.message_id === removedMessage.message_id);
        if (index === -1) {
          return;
        }
        messages[index].isRemoved = true;
      });

      let tmp = JSON.parse(JSON.stringify(messages));

      read_message_data?.forEach((member) => {
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
            className={cx('message-item', { 'last-message': author_id != following_author_id })}
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
            small
            is_last_message={ind == tmp.length - 1}
            no_img={author_id === following_author_id}
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

  // Function_handle Send Messages
  const handleSendMessage = ({ uploadFiles, messageText }) => {
    const checkUser = members.findIndex((member) => member.user_id === user.user_id);
    if (checkUser === -1) {
      return;
    }

    // GET RECEIVER USERS
    const receivers = members.filter((member) => member.user_id !== user.user_id);

    // CHECK RE_RENDER

    // CREATE MESSAGE INFO -- PACKAGE FOR SENDING TO SERVER
    const infoMessagePackage = {
      room_id: room_id,
      room_type: room_type,
      receivers,
      author: user,
      created_at: moment().valueOf(),
    };

    // PACKAGE FOR SOCKET
    const messageTextId = createId(user.user_id, infoMessagePackage.room_id);

    const createContentPackage = (type, content, message_id) => {
      return {
        message_id,
        message: content,
        type,
      };
    };

    if (messageText.trim()) {
      const Messagepackage = {
        message_id: messageTextId,
        author_id: infoMessagePackage.author.user_id,
        author_name: infoMessagePackage.author.full_name,
        author_avatar: infoMessagePackage.author.user_avatar,
        created_at: infoMessagePackage.created_at,
        file_name: null,
        file_size: null,
        message: messageText,
        room_id: infoMessagePackage.room_id,
        type: 'text',
      };

      setChatBoxes((prev) => {
        return prev.map((chatBox) => {
          if (chatBox.contact.room_id == room_id) {
            chatBox.messages.push(Messagepackage);
          }
          return chatBox;
        });
      });

      setNewMessage(Messagepackage);
    }

    const fileIds = [];

    uploadFiles?.forEach((file, ind) => {
      const message_id = createId(user.user_id, infoMessagePackage.room_id, ind);
      fileIds.push(message_id);
    });

    const fileArr = [];
    if (uploadFiles.length > 0) {
      const mediaArr = [];
      const documentArr = [];
      uploadFiles.forEach((fileData, ind) => {
        const url = URL.createObjectURL(fileData);
        let type;
        if (isImage(fileData.name)) {
          type = 'image';
          mediaArr.push({
            message_id: fileIds[ind],
            room_id: infoMessagePackage.room_id,
            author_id: infoMessagePackage.author.user_id,
            author_name: infoMessagePackage.author.full_name,
            created_at: infoMessagePackage.created_at,
            file_name: fileData.name,
            file_size: fileData.size,
            message: url,
            type,
          });
        } else if (isVideo(fileData.name)) {
          type = 'video';
          mediaArr.push({
            message_id: fileIds[ind],
            room_id: infoMessagePackage.room_id,
            author_id: infoMessagePackage.author.user_id,
            author_name: infoMessagePackage.author.full_name,
            created_at: infoMessagePackage.created_at,
            file_name: fileData.name,
            file_size: fileData.size,
            message: url,
            type,
          });
        } else {
          type = 'document';
          documentArr.push({
            message_id: fileIds[ind],
            room_id: infoMessagePackage.room_id,
            author_id: infoMessagePackage.author.user_id,
            author_name: infoMessagePackage.author.full_name,
            created_at: infoMessagePackage.created_at,
            file_name: fileData.name,
            file_size: fileData.size,
            message: url,
            type,
          });
        }
        const Messagepackage = {
          message_id: fileIds[ind],
          author_id: infoMessagePackage.author.user_id,
          author_avatar: infoMessagePackage.author.user_avatar,
          author_name: infoMessagePackage.author.full_name,
          created_at: infoMessagePackage.created_at,
          file_name: fileData.name,
          file_size: fileData.size,
          message: url,
          room_id: infoMessagePackage.room_id,
          type,
        };

        fileArr.push(Messagepackage);
      });

      // setMessages([...messages, ...fileArr]);
      setChatBoxes((prev) => {
        return prev.map((chatBox) => {
          if (chatBox.contact.room_id == room_id) {
            chatBox.messages.push(...fileArr);
          }
          return chatBox;
        });
      });
      setNewMessage(fileArr[fileArr.length - 1]);
      // setMedia((prev) => [...mediaArr, ...prev]);
      // setDocuments((prev) => [...documentArr, ...prev]);
    }

    // CREATE FORM DATA CONTAINING INFO MESSAGE
    const formData = new FormData();

    // GENERAL INFO
    formData.append('infoMessagePackage', JSON.stringify(infoMessagePackage));

    // APPEND MESSAGE TEXT IF EXITS
    const messageTextData = {
      messageText,
      message_id: messageTextId,
    };
    messageText.trim() && formData.append('messageTextData', JSON.stringify(messageTextData));

    // APPEND FILE_UPLOADS IF EXITS
    uploadFiles?.forEach((file, ind) => {
      formData.append(`fileIds`, fileIds[ind]);
      formData.append(`upload-files`, file);
    });

    // CONFIG MULTIPART FORM
    const config = {
      headers: { 'content-type': 'multipart/form-data', Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}` },
    };

    if (messageText.trim() || uploadFiles.length > 0) {
      axiosInstance
        .post(`/message-datas/`, formData, config)
        .then((result) => {
          // update sent status for messages
          if (room_id === infoMessagePackage.room_id) {
            const message_ids = [...fileIds, messageTextId];

            // setMessages((prev) => {
            //   message_ids.forEach((id) => {
            //     const index = prev.findIndex((message) => message.message_id === id);
            //     if (index !== -1) {
            //       prev[index].isSent = true;
            //     }
            //   });
            //   return JSON.parse(JSON.stringify(prev));
            // });

            setChatBoxes((prev) => {
              return prev.map((chatBox) => {
                if (chatBox.contact.room_id == room_id) {
                  message_ids.forEach((id) => {
                    const index = chatBox.messages.findIndex((message) => message.message_id === id);
                    if (index !== -1) {
                      chatBox.messages[index].isSent = true;
                    }
                  });
                }
                return chatBox;
              });
            });

            // SEND REAL TIME MESSAGE
            if (messageText.trim()) {
              const newMessage = createContentPackage('text', messageText, messageTextId);
              socket.emit('send_message', { infoMessagePackage, content: newMessage });
            }

            if (uploadFiles.length > 0) {
              const data = uploadFiles.map((file, index) => {
                const data = {
                  file_id: fileIds[index],
                  file,
                  type: fileArr[index].type,
                  file_name: file.name,
                  file_size: file.size,
                  index,
                };
                return data;
              });

              const newMessage = createContentPackage('file', data);
              socket.emit('send_files', { infoMessagePackage, content: newMessage });
            }
          }
        })
        .catch((error) => {
          error = new Error();
        });
    }
  };

  const handleRemoveMessage = (removeType, message_id, message_index) => {
    const room_members = removeType === 0 ? [user] : members;

    setChatBoxes((prev) => {
      return prev.map((chatBox) => {
        if (chatBox.contact.room_id == room_id) {
          chatBox.messages.forEach((message) => {
            if (message.message_id == message_id) {
              message.isRemoved = true;
            }
          });
        }
        return JSON.parse(JSON.stringify(chatBox));
      });
    });

    const body = {
      message_id: message_id,
      room_id: room_id,
      users: room_members,
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
        receivers: room_members.filter((member) => member.user_id !== user.user_id),
        user_id: user.user_id,
      };
      socket?.emit('remove-message-req', req);
    }
  };

  const handleLeaveRoom = () => {
    if (admin_id === user.user_id) {
      setFunctionHandlers({
        alert_title: 'Before Leaving Requirement',
        alert_content: 'You have to give the admin permision to another member before leaving',
        confirmFunction: () => {},
      });
      return;
    }
    if (isLeavedRoom) {
      return;
    }

    if (room_type == 1) {
      return;
    }

    const payload = {
      user_id: user.user_id,
      room_id: room_id,
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
          const messageId = createId(0, room_id, user.user_id);
          let notificationPackage = {
            room_id: room_id,
            sender_id: user.user_id,
            member_id: user.user_id,
            state_type: 'leave_room',
            notifications: [
              {
                message_id: messageId,
                room_id: room_id,
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
        socket.emit('change-room-state', { user, room_id: room_id, notificationPackage });
        socket?.emit('leave_room', room_id);
        setRoomState(notificationPackage);
        // setChatBoxes((prev) => {
        //   return prev.map((chatBox) => {
        //     if (chatBox.room_id == room_id) {
        //       chatBox.messages.push(...notificationPackage.notifications);
        //     }
        //   });
        // });
      })
      .catch((error) => {
        error = new Error();
      });
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
          setChatBoxes((prev) => {
            return prev.map((chatBox) => {
              if (chatBox.contact.room_id == room_id) {
                chatBox.messages = [
                  ...result.data.content.map((message) => {
                    return { ...message, isSent: true };
                  }),
                  ...chatBox.messages,
                ];
              }
              return JSON.parse(JSON.stringify(chatBox));
            });
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
      room_id: room_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    room_id &&
      axiosInstance
        .get(`/message-datas/media/${room_id}`, configurations)
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

  const updateSeenMessages = (room_id) => {
    const payload = {
      room_id: room_id,
      last_seen_at: moment().valueOf(),
    };
    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };
    axiosInstance
      .post(`/message-datas/update-last-seen-message`, payload, configurations)
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  const handleEmitReadMessage = (room_id) => {
    updateSeenMessages(room_id);
    setContacts((contacts) => {
      contacts.forEach((contact) => {
        if (contact.room_id === room_id) contact.isSeen = true;
      });
      return JSON.parse(JSON.stringify(contacts));
    });
    const receivers = members.filter((member) => member.user_id !== user.user_id);
    socket?.emit('read', {
      user,
      receivers,
      last_seen_at: moment().valueOf(),
      room_id: room_id,
      room_type: room_type,
    });
  };

  return (
    <>
      <div className={cx('wrapper', { [className]: className })}>
        <div className={cx('header')}>
          <TippyHeadless
            visible={isOpenRoomOptions}
            interactive={true}
            offset={[0, 20]}
            delay={[100, 0]}
            placement="left-start"
            render={(attrs) => (
              <div className="box" tabIndex="-1" {...attrs}>
                {!isLeavedRoom && (
                  <TippyWrapper className={cx('user-options')}>
                    {room_type == 1 && (
                      <>
                        <IconBtn
                          className={cx('menu-item')}
                          title={'See Profile'}
                          icon={<UserIcon height="2.8rem" width="2.8rem" />}
                          onClick={() => {
                            navigate(`/profiles/${contactInfo[0].user_id}`, { replace: true });
                            setIsOpenRoomOptions(false);
                          }}
                        />

                        <IconBtn
                          className={cx('menu-item')}
                          title={'Open In Messenger'}
                          icon={<MessageDot height="2.4rem" width="2.4rem" />}
                          onClick={() => {
                            navigate(`/messenger/${contactInfo[0].room_id}`, { replace: true });
                            setIsOpenRoomOptions(false);
                          }}
                        />
                      </>
                    )}

                    {room_type == 2 && (
                      <>
                        {admin_id == user.user_id && (
                          <>
                            <IconBtn
                              className={cx('menu-item')}
                              title="Add users"
                              icon={<UserPlus width={'2.2rem'} height={'2.2rem'} />}
                              onClick={() => {
                                setInfoAdding({ members: members, room_id: room_id });
                                setIsOpenRoomOptions(false);
                              }}
                            />
                            <IconBtn
                              className={cx('menu-item')}
                              title="Change room info"
                              icon={<EditIcon width={'2.2rem'} height={'2.2rem'} />}
                              onClick={() => {
                                setCustomizingRoomInfo({
                                  isOpenRoomCustomizing: true,
                                  room_id: room_id,
                                });
                                setIsOpenRoomOptions(false);
                              }}
                            />
                          </>
                        )}

                        <IconBtn
                          className={cx('menu-item')}
                          title="Leave room"
                          icon={<LogOutIcon width={'2.2rem'} height={'2.2rem'} />}
                          onClick={() => {
                            handleLeaveRoom();
                            setIsOpenRoomOptions(false);
                          }}
                        />
                        <IconBtn
                          className={cx('menu-item')}
                          title="Members"
                          icon={<UserGroupIcon width={'2.2rem'} height={'2.2rem'} />}
                          onClick={() => {
                            setIsOpenMemberList(true);
                            setIsOpenRoomOptions(false);
                          }}
                        />
                      </>
                    )}
                  </TippyWrapper>
                )}
              </div>
            )}
          >
            <div className={cx('contact-content')} onClick={() => setIsOpenRoomOptions((prev) => !prev)}>
              <MediaItem2
                item={{ url: room_avatar, type: 'image' }}
                width={36}
                height={36}
                border_radius={1000}
                _styles={{
                  boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                }}
              />
              <div className={cx('contact-info')}>
                <p className={cx('contact-name')}>{room_name}</p>
                <div className={cx('contact-status')}>
                  <span className={cx('online-dot')}></span>
                  <p>Available</p>
                </div>
              </div>
            </div>
          </TippyHeadless>
          <button className={cx('close-btn')} onClick={onClose}>
            <CloseIcon width={'2.2rem'} height={'2.2rem'} />
          </button>
        </div>
        <div className={cx('body')} onClick={() => handleEmitReadMessage(room_id)}>
          <div ref={topBorderRef} />
          <div className={cx('get-more-message-container', { ['slide-in']: isAtTop && !isNoMoreMessage })}>
            <div className={cx('get-more-messages-btn')} onClick={handleShowMoreMessages}>
              <FontAwesomeIcon className={cx('get-message-icon')} icon={faChevronUp} />
            </div>
          </div>
          {renderMessages()}
          <div ref={lastMessageRef} />
        </div>
        <MiniChatBoxTyper
          room_type={room_type}
          room_id={room_id}
          members={members}
          handleSendMessage={handleSendMessage}
          handleEmitReadMessage={handleEmitReadMessage}
        />
      </div>
      {isOpenMemberList && (
        <div className={cx('modal-wrapper')}>
          <MemberListModal
            admin_id={admin_id}
            members={members}
            room_id={room_id}
            setIsOpenMemberList={setIsOpenMemberList}
          />
        </div>
      )}
    </>
  );
}

export default MiniChatBox;
