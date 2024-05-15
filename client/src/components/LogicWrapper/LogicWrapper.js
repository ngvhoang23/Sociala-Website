import axios from 'axios';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import Cookies from 'universal-cookie';
import { ChatBoxesContext } from '~/Context/ChatBoxesContext';
import { ContactsContext } from '~/Context/ContactsContext';
import { CurrentRoomContext } from '~/Context/CurrentRoomContext';
import { FriendsContext } from '~/Context/FriendsContext';
import { IsMessengerContext } from '~/Context/IsMessengerContext';
import { IsOpenNotificationContext } from '~/Context/IsOpenNotificationContext';
import { MessagesContext } from '~/Context/MessagesContext';
import { NewMessageContext } from '~/Context/NewMessageContext';
import { NotificationsContext } from '~/Context/NotificationsContext';
import { RoomIdsContext } from '~/Context/RoomIdsContext';
import { RoomStateContext } from '~/Context/RoomStateContext';
import { SocketContext } from '~/Context/SocketContext';
import { StrangeMessageContext } from '~/Context/StrangeMessageContext';
import { createId } from '~/UserDefinedFunctions';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cookies = new Cookies();

function LogicWrapper({ children }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_CONTEXT
  const relationshipContext = useContext(FriendsContext);
  const relationship = relationshipContext.relationship;
  const setRelationship = relationshipContext.setRelationship;

  const notificationsContext = useContext(NotificationsContext);
  const notifications = notificationsContext.notifications;
  const setNotifications = notificationsContext.setNotifications;

  const contactsContext = useContext(ContactsContext);
  const setContacts = contactsContext.handleSetContacts;
  const contacts = contactsContext.contacts;

  const newMessageContext = useContext(NewMessageContext);
  const newMessage = newMessageContext.newMessage;
  const setNewMessage = newMessageContext.setNewMessage;

  const currentRoomContext = useContext(CurrentRoomContext);
  const currentRoom = currentRoomContext.currentRoom;
  const setCurrentRoom = currentRoomContext.handleSetCurrentRoom;

  const isStrangeContext = useContext(StrangeMessageContext);
  const setIsStrange = isStrangeContext.handleSetIsStrange;
  const isStrange = isStrangeContext.isStrange;

  const roomStateContext = useContext(RoomStateContext);
  const roomState = roomStateContext.roomState;
  const setRoomState = roomStateContext.setRoomState;

  const roomIdsContext = useContext(RoomIdsContext);
  const roomIds = roomIdsContext.roomIds;
  const setRoomIds = roomIdsContext.setRoomIds;

  const messagesContext = useContext(MessagesContext);
  const messages = messagesContext.messages;
  const setMessages = messagesContext.handleSetMessages;

  const chatBoxesContext = useContext(ChatBoxesContext);
  const setChatBoxes = chatBoxesContext.setChatBoxes;
  const chatBoxes = chatBoxesContext.chatBoxes;

  const isMessengerContext = useContext(IsMessengerContext);
  const isMessenger = isMessengerContext.isMessenger;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const socket = useContext(SocketContext);

  // USE_STATE
  const [arrivalMessage, setArrivalMessage] = useState();
  const [newRelationshipCode, setNewRelationshipCode] = useState(false);
  const [newNotificationCode, setNewNotificationCode] = useState(false);

  // USE_EFFECT

  // init data
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/users/friends/relationship/${user.user_id}`, config)
      .then((result) => {
        setRelationship(result.data);
      })
      .catch((error) => {
        error = new Error();
      });
  }, [user.user_id, newRelationshipCode]);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/notifications/${user.user_id}`, config)
      .then((result) => {
        const notificaitons = result.data;
        notificaitons.forEach((notification) => {
          notification.noti_id = `${notification.user_id}${notification.target_user_id}${notification.defined_noti_id}${
            notification.post_id || ''
          }`;
        });
        setNotifications(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user.user_id, newNotificationCode]);

  useEffect(() => {
    socket?.emit('addUser', user);
  }, [socket]);

  useEffect(() => {
    socket?.once('receive-friend-req', (data) => {
      const { target_user_id, sender_id } = data;

      setNewRelationshipCode((prev) => !prev);
      setNewNotificationCode((prev) => !prev);
    });
    return () => socket?.off('receive-friend-req');
  }, [socket, notifications, relationship]);

  useEffect(() => {
    socket?.once('accept-friend-req', (data) => {
      const { target_user_id, sender_id } = data;

      setNewRelationshipCode((prev) => !prev);
      setNewNotificationCode((prev) => !prev);
    });
    return () => socket?.off('accept-friend-req');
  }, [socket, notifications, relationship]);

  useEffect(() => {
    socket?.once('reject-friend-req', (data) => {
      const { target_user_id, sender_id } = data;

      setNewRelationshipCode((prev) => !prev);
      setNewNotificationCode((prev) => !prev);
    });
    return () => socket?.off('reject-friend-req');
  }, [socket, notifications]);

  useEffect(() => {
    socket?.once('cancel-friend-req', (data) => {
      const { target_user_id, sender_id } = data;

      setNewRelationshipCode(`${sender_id}${target_user_id}cancel-friend-req`);
      setNewNotificationCode(`${sender_id}${target_user_id}cancel-friend-req`);
    });
    return () => socket?.off('cancel-friend-req');
  }, [socket, notifications, relationship]);

  useEffect(() => {
    socket?.once('un-friend', (data) => {
      const { target_user_id, sender_id } = data;

      setNewRelationshipCode((prev) => !prev);
      setNewNotificationCode((prev) => !prev);
    });
    return () => socket?.off('un-friend');
  }, [socket, notifications]);

  useEffect(() => {
    const params = {
      user_id: user.user_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/message-datas/contacts/`, configurations)
      .then((result) => {
        setRoomIds((prev) => {
          return result.data.map((contact) => {
            return {
              room_id: contact.room_id,
              room_type: contact.room_type,
              joined_at: contact.joined_at,
              left_at: contact.left_at,
            };
          });
        });
      })
      .catch((error) => {
        error = new Error();
      });
  }, [isStrange, roomState]);

  // On new Post
  useEffect(() => {
    socket?.once('new-post', (data) => {
      setNewNotificationCode((prev) => !prev);
    });
    return () => socket?.off('new-post');
  }, [socket, notifications]);

  // On new reaction
  useEffect(() => {
    socket?.off('react-post');
    socket?.on('react-post', (data) => {
      setNewNotificationCode((prev) => !prev);
    });
  }, [socket, notifications]);

  // On new comment
  useEffect(() => {
    socket?.off('comment-post');
    socket?.on('comment-post', (data) => {
      setNewNotificationCode((prev) => !prev);
    });
  }, [socket, notifications]);

  // =========================================================================================================

  // handle send/receive messages

  // SOCKET_IO -- handle when receive messages from server via socket => in wrapper
  useEffect(() => {
    socket?.on('receive_message', (data) => {
      const { infoMessagePackage, content } = data;
      socket.emit('received_message', {
        user_id: infoMessagePackage.author.user_id,
        room_id: infoMessagePackage.room_id,
        message_ids: [content.message_id],
      });
      const Messagepackage = {
        message_id: content.message_id,
        author_id: infoMessagePackage.author.user_id,
        author_avatar: infoMessagePackage.author.user_avatar,
        author_name: infoMessagePackage.author.full_name,
        created_at: infoMessagePackage.created_at,
        file_name: null,
        file_size: null,
        message: content.message,
        room_id: infoMessagePackage.room_id,
        type: content.type,
        room_type: infoMessagePackage.room_type,
      };
      setNewMessage(Messagepackage);
      setArrivalMessage([Messagepackage]);
    });
  }, [socket]);

  // SOCKET_IO -- handle when receive messages(type: file) from server via socket => in wrapper
  useEffect(() => {
    socket?.on('receive-file', async (data) => {
      const fileArr = [];
      const message_ids = [];
      const { infoMessagePackage, content } = data;
      content.message.forEach((fileData) => {
        const buffer = new Uint8Array(fileData.file);
        const blob = new Blob([buffer], { type: fileData.type });
        const url = URL.createObjectURL(blob);
        const Messagepackage = {
          message_id: fileData.file_id,
          author_id: infoMessagePackage.author.user_id,
          author_avatar: infoMessagePackage.author.user_avatar,
          author_name: infoMessagePackage.author.full_name,
          created_at: infoMessagePackage.created_at,
          file_name: fileData.file_name,
          file_size: fileData.file_size,
          message: url,
          room_id: infoMessagePackage.room_id,
          type: fileData.type,
          room_type: infoMessagePackage.room_type,
        };
        message_ids.push(fileData.file_id);
        fileArr.push(Messagepackage);
      });
      socket.emit('received_message', {
        user_id: infoMessagePackage.author.user_id,
        room_id: infoMessagePackage.room_id,
        message_ids,
      });
      setNewMessage(fileArr[fileArr.length - 1]);
      setArrivalMessage(fileArr);
    });
  }, [socket]);

  // Handle when any message arrive => in wrapper
  useEffect(() => {
    if (arrivalMessage) {
      if (isMessenger) {
        const room_id = arrivalMessage?.room_id || arrivalMessage[0]?.room_id;
        const author_id = arrivalMessage?.author_id || arrivalMessage[0]?.author_id;
        // if (arrivalMessage?.length > 0) {
        // lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
        // check if arrivalMessage belong to current room and having author in that current room
        const checkInclude = currentRoom?.members.some((member) => member.user_id === author_id);
        if (currentRoom?.room_id === room_id && checkInclude) {
          setMessages([...messages, ...arrivalMessage]);
        }
        // } else {
        //   // check if arrivalMessage belong to current room and having author in that current room
        //   const checkInclude = currentRoom?.members.some((member) => member.user_id === author_id);
        //   if (currentRoom?.room_id === room_id && checkInclude) {
        //     setMessages([...messages, arrivalMessage]);
        //   }
        // }
        // check if need to rerender
        const checkReRender = contacts.some((contact) => contact.room_id === room_id);
        !checkReRender && setIsStrange((prev) => !prev);

        // update read/unread contacts
        // if (currentRoom && currentRoom.room_id === room_id) {
        //   const ind = contacts.findIndex((contact) => contact.room_id == room_id);
        //   if (ind !== -1) {
        //     contacts[ind].isSeen = true;
        //   }
        // } else {
        //   const ind = contacts.findIndex((contact) => contact.room_id == room_id);
        //   if (ind !== -1) {
        //     contacts[ind].isSeen = false;
        //   }
        // }

        // setContacts(JSON.parse(JSON.stringify(contacts)));

        if (currentRoom && currentRoom.room_id == room_id) {
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
          // update runtime by socket
          const receivers = currentRoom?.members.filter((member) => member.user_id !== user.user_id);
          socket?.emit('read', {
            user,
            receivers,
            last_seen_at: moment().valueOf(),
            room_id: currentRoom.room_id,
            room_type: currentRoom.room_type,
          });
        }
      } else {
        const room_id = arrivalMessage?.room_id || arrivalMessage[0]?.room_id;
        const author_id = arrivalMessage?.author_id || arrivalMessage[0]?.author_id;
        const room_type = arrivalMessage?.room_type || arrivalMessage[0]?.room_type;

        // check this arrivalMessage belong to which rooms
        let isIncludedInChatBoxes = false;

        setChatBoxes((prev) => {
          return prev.map((chatBox) => {
            if (chatBox.contact.room_id == room_id) {
              isIncludedInChatBoxes = true;
              chatBox.messages.push(...arrivalMessage);
            }
            return chatBox;
          });
        });

        const checkReRender = contacts.some((contact) => contact.room_id === room_id);
        !checkReRender && setIsStrange((prev) => !prev);

        if (isIncludedInChatBoxes) {
          // const payload = {
          //   room_id: room_id,
          //   last_seen_at: moment().valueOf(),
          // };
          // const configurations = {
          //   headers: {
          //     Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
          //   },
          // };
          // axiosInstance
          //   .post(`/message-datas/update-last-seen-message`, payload, configurations)
          //   .then((res) => {})
          //   .catch((err) => console.log(err));
          // update runtime by socket
          // const receivers = currentRoom?.members.filter((member) => member.user_id !== user.user_id);
          // let receivers = [];
          // chatBoxes.forEach((chatBox) => {
          //   if (chatBox.contact.room_id === room_id) {
          //     receivers = chatBox.contact.members.filter((member) => member.user_id !== user.user_id);
          //     return;
          //   }
          // });
          // socket?.emit('read', {
          //   user,
          //   receivers,
          //   last_seen_at: moment().valueOf(),
          //   room_id: room_id,
          //   room_type: room_type,
          // });
        } else {
          const params = {
            room_id: room_id,
            quantity: 10,
            last_seen_at: moment().valueOf(),
          };

          const configurations = {
            params: params,
            headers: {
              Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
            },
          };

          axiosInstance
            .get(`/message-datas/${room_id}`, configurations)
            .then((result) => {
              let messages = result.data.content;
              let read_message_data = result.data.lastSeenInfo;
              let removed_message_data = result.data.removeData;

              const params = {
                room_id: room_id,
              };

              const configurations = {
                params: params,
                headers: {
                  Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
                },
              };

              axiosInstance
                .get(`/rooms/${room_id}`, configurations)
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
      }
    }
  }, [arrivalMessage]);

  // init rooms when user log in => in wrapper
  useEffect(() => {
    roomIds?.forEach((room) => {
      if (room.room_type == 2 && (room.joined_at > room.left_at || room.left_at === null)) {
        socket?.emit('join_room', room.room_id);
      }
    });
  }, [roomIds]);

  // listen room state change => in wrapper
  useEffect(() => {
    socket?.on('room-state-changed', ({ room_id, notificationPackage }) => {
      setRoomState(notificationPackage);
    });

    socket?.on('invite-to-room', ({ room_id, notificationPackage }) => {
      setRoomState(notificationPackage);
    });
  }, [socket]);

  // update room info when new room state is changed => in wrapper
  useEffect(() => {
    if (roomState && roomState.notifications.length > 0) {
      if (!chatBoxes.some((chatBox) => chatBox.contact.room_id == roomState.room_id)) {
        return;
      }

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
        .get(`/rooms/${roomState?.room_id}`, configurations)
        .then((result) => {
          setChatBoxes((prev) => {
            return prev.map((chatBox) => {
              if (chatBox.contact.room_id == roomState.room_id) {
                chatBox.contact = result.data;
                chatBox.messages.push(...roomState.notifications);
              }
              return chatBox;
            });
          });
        })
        .catch((error) => {
          error = new Error(error);
          console.log(error);
        });
    }
  }, [roomState]);

  // add new contact when joining to new room => in wrapper
  useEffect(() => {
    socket?.on('invite-to-new-room', (contact) => {
      if (!contact) {
        return;
      }
      if (contact.room_avatar) {
        const buffer = new Uint8Array(contact.room_avatar);
        const blob = new Blob([buffer], { type: 'image' });
        const url = URL.createObjectURL(blob);
        contact.room_avatar = url;
      } else {
        contact.room_avatar = 'http://127.0.0.1:5000/images/avatardefault_92824.jpg';
      }
      const checkIncluded = chatBoxes.some((chatBox) => chatBox.room_id == contact.room_id);

      if (checkIncluded) {
        return;
      }

      setContacts((prev) => {
        return [contact, ...prev];
      });
      setChatBoxes((prev) => [...prev, { contact: contact, messages: [] }]);

      setRoomIds((prev) => [
        ...prev,
        { room_id: contact.room_id, room_type: 2, joined_at: contact.joined_at, left_at: contact.left_at },
      ]);
    });
  }, [socket]);

  // update contacts when any stranger send message
  useEffect(() => {
    const params = {
      user_id: user.user_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/message-datas/contacts/`, configurations)
      .then((result) => {
        setContacts(result.data);
      })
      .catch((error) => {
        error = new Error();
      });
  }, [isStrange, roomState]);

  // update contacts when new message is comming => in component
  useEffect(() => {
    if (newMessage) {
      let updatedContact = {};
      let newContacts = {};
      contacts.forEach((contact) => {
        if (contact?.room_id === newMessage?.room_id) {
          updatedContact = contact;
          const type = newMessage.type;
          if (type === 'text') {
            updatedContact.message = newMessage.message;
            updatedContact.created_at = newMessage.created_at;
          } else if (type === 'image') {
            updatedContact.message = `${newMessage.author_name} sent an ${newMessage.type}`;
            updatedContact.created_at = newMessage.created_at;
          } else {
            updatedContact.message = `${newMessage.author_name} sent a ${newMessage.type}`;
            updatedContact.created_at = newMessage.created_at;
          }
          if (currentRoom?.room_id == newMessage?.room_id) {
            updatedContact.isSeen = true;
          } else {
            if (newMessage.author_id === user.user_id) {
              updatedContact.isSeen = true;
            } else {
              updatedContact.isSeen = false;
            }
          }
        }
      });
      newContacts = contacts?.filter((contact) => contact?.room_id !== newMessage.room_id);
      newContacts.unshift(updatedContact);
      setContacts(newContacts);
    }
  }, [newMessage]);

  return <div>{children}</div>;
}

export default LogicWrapper;
