import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { json, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ChatContainer.module.scss';
import moment from 'moment/moment';
import axios from 'axios';
import Cookies from 'universal-cookie';

import { binarySearch, createId, isImage, isVideo } from '~/UserDefinedFunctions';
import ChatHeader from '../ChatHeader';
import ChatFooter from '../ChatFooter/ChatFooter';
import Button from '../Button';

import { useCallback } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import MessagesContainer from '../MessagesContainer/MessagesContainer';
import { CurrentRoomContext } from '~/Context/CurrentRoomContext';
import { MessagesContext } from '~/Context/MessagesContext';
import { SocketContext } from '~/Context/SocketContext';
import { ContactsContext } from '~/Context/ContactsContext';
import { StrangeMessageContext } from '~/Context/StrangeMessageContext';
import { RoomStateContext } from '~/Context/RoomStateContext';
import { MediaContext } from '~/Context/MediaContext';
import { DocumentsContext } from '~/Context/DocumentsContext';
import { IsOpenRoomInfoBarContext } from '~/Context/IsOpenRoomInfoBarContext';
import { NewMessageContext } from '~/Context/NewMessageContext';
import { RoomIdsContext } from '~/Context/RoomIdsContext';
import { IsOpenRoomInfoContext } from '~/pages/Messenger/Contexts/IsOpenRoomInfo';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import MediaItem2 from '../MediaItem2/MediaItem2';

const cookies = new Cookies();
const cx = classNames.bind(styles);

function ChatContainer() {
  // CONSTANCE
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_REF
  const chatBox = useRef(null);

  // USE_CONTEXT
  const currentRoomContext = useContext(CurrentRoomContext);
  const currentRoom = currentRoomContext.currentRoom;
  const setCurrentRoom = currentRoomContext.handleSetCurrentRoom;

  const messagesContext = useContext(MessagesContext);
  const messages = messagesContext.messages;
  const setMessages = messagesContext.handleSetMessages;

  const socket = useContext(SocketContext);

  const contactsContext = useContext(ContactsContext);
  const setContacts = contactsContext.handleSetContacts;
  const contacts = contactsContext.contacts;

  const isOpenRoomInfoBarContext = useContext(IsOpenRoomInfoBarContext);
  const setIsOpenRoomInfoBar = isOpenRoomInfoBarContext.setIsOpenRoomInfoBar;

  const isStrangeContext = useContext(StrangeMessageContext);
  const setIsStrange = isStrangeContext.handleSetIsStrange;
  const isStrange = isStrangeContext.isStrange;

  const roomStateContext = useContext(RoomStateContext);
  const roomState = roomStateContext.roomState;
  const setRoomState = roomStateContext.setRoomState;

  const mediaContext = useContext(MediaContext);
  const media = mediaContext.media;
  const setMedia = mediaContext.setMedia;

  const documentsContext = useContext(DocumentsContext);
  const documents = documentsContext.Documents;
  const setDocuments = documentsContext.setDocuments;

  const newMessageContext = useContext(NewMessageContext);
  const newMessage = newMessageContext.newMessage;
  const setNewMessage = newMessageContext.setNewMessage;

  const roomIdsContext = useContext(RoomIdsContext);
  const roomIds = roomIdsContext.roomIds;
  const setRoomIds = roomIdsContext.setRoomIds;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_PARAMS
  const { room_id } = useParams();

  // USE_STATE
  const [userTyping, setUserTyping] = useState();
  const [timeOut, setTimeOut] = useState();

  const handleTyping = (e) => {
    if (e.code !== 'Enter') {
      const receivers = currentRoom.members.filter((member) => member.user_id !== user.user_id);
      socket.emit('typing', { user, receivers });
      clearTimeout(timeOut);
      const timeoutId = setTimeout(() => {
        socket.emit('noLongerTyping', { user, receivers });
      }, 1000);
      setTimeOut(timeoutId);
    }
  };

  // ================================================================================

  // USE_EFFECT
  // listen on typping
  useEffect(() => {
    socket?.on('typingResponse', (data) => setUserTyping(data));
    socket?.on('noLongerTypingResponse', (data) => {
      setUserTyping();
    });
  }, [socket]);

  // set User Typing
  useEffect(() => {
    if (userTyping) {
      const checkInclude = currentRoom?.members.filter((member) => member.user_id == userTyping?.user_id);
      checkInclude.length == 0 && setUserTyping(false);
    }
  }, [userTyping]);

  // GET ROOMINFO FROM DATABASE --- when user changes room => in component
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

    if (room_id) {
      axiosInstance
        .get(`/rooms/${room_id}`, configurations)
        .then((result) => {
          const currentRoom = result.data;
          if (!currentRoom?.room_name) {
            currentRoom.room_name = currentRoom?.members.filter(
              (member) => member.user_id != user.user_id,
            )[0]?.full_name;
          } else {
          }
          if (!currentRoom?.room_avatar) {
            currentRoom.room_avatar = currentRoom?.members.filter(
              (member) => member.user_id != user.user_id,
            )[0]?.user_avatar;
          }
          if (currentRoom.room_type == 1) {
            currentRoom.guest = currentRoom.members.filter((member) => member.user_id != user.user_id)[0];
          }
          setCurrentRoom(currentRoom);
        })
        .catch((error) => {
          error = new Error();
        });
    }
  }, [room_id, roomState]);

  // update messages when new room state is changed
  useEffect(() => {
    if (roomState && roomState.notifications.length > 0 && roomState.sender_id != user.user_id) {
      if (currentRoom?.room_id == roomState.room_id) {
        setMessages((prev) => [...prev, ...roomState.notifications]);
      }
    }
  }, [roomState]);

  // ================================================================================

  // FUNCTION_HANDLER
  // Function_handle Send Messages
  const handleSendMessage = ({ uploadFiles, messageText }) => {
    // console.log('new Date(): ', new Date());
    // const time = moment().valueOf();
    // console.log('moment().valueOf(): ', time);
    // console.log(moment(time).format('YYYY-MM-DD HH:mm:ss'));
    // return;

    const checkUser = currentRoom.members.findIndex((member) => member.user_id === user.user_id);
    if (!currentRoom || checkUser === -1) {
      return;
    }

    // GET RECEIVER USERS
    const receivers = currentRoom.members.filter((member) => member.user_id !== user.user_id);

    // CHECK RE_RENDER
    const checkReRender = contacts.filter((contact) => contact.room_id === currentRoom.room_id);
    checkReRender.length === 0 && setIsStrange((prev) => !prev);

    // CREATE MESSAGE INFO -- PACKAGE FOR SENDING TO SERVER
    const infoMessagePackage = {
      room_id: currentRoom.room_id,
      room_type: currentRoom.room_type,
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

    let _messages = [];

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
      _messages = [Messagepackage];
      // setMessages([...messages, Messagepackage]);
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
      console.log('fileArr', fileArr);
      // setMessages([...messages, ...fileArr]);
      _messages = [..._messages, ...fileArr];
      setNewMessage(fileArr[fileArr.length - 1]);
      setMedia((prev) => [...mediaArr, ...prev]);
      setDocuments((prev) => [...documentArr, ...prev]);
    }

    setMessages((prev) => [...prev, ..._messages]);

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

    if ((messageText.trim() || uploadFiles.length > 0) && currentRoom) {
      axiosInstance
        .post(`/message-datas/`, formData, config)
        .then((result) => {
          // update sent status for messages
          if (currentRoom?.room_id === infoMessagePackage.room_id) {
            const message_ids = [...fileIds, messageTextId];

            setMessages((prev) => {
              message_ids.forEach((id) => {
                const index = prev.findIndex((message) => message.message_id === id);
                if (index !== -1) {
                  prev[index].isSent = true;
                }
              });
              return JSON.parse(JSON.stringify(prev));
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

  const handleSetMessages = useCallback((value) => {
    setMessages(value);
  }, []);

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

  useEffect(() => {
    updateSeenMessages(room_id);
  }, [room_id]);

  return room_id ? (
    <div className={cx('chat-container')}>
      <ChatHeader setMessages={handleSetMessages} setIsOpenRoomInfoBar={setIsOpenRoomInfoBar} />
      <div ref={chatBox} className={cx('chat-box')}>
        <MessagesContainer />
        {/* <div className="typing-status">{userTyping && <TypingTag />}</div> */}
      </div>
      <ChatFooter handleSendMessage={handleSendMessage} />
    </div>
  ) : (
    <div className={cx('chat-page-start')}>
      <div className={cx('chat-page-start-container')}>
        <MediaItem2
          item={{ url: user.user_avatar, type: 'image' }}
          width={80}
          height={80}
          border_radius={1000}
          _styles={{
            boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
          }}
          className={cx('user-avatar')}
        />
        <h5 className={cx('welcom-text')}>{`Welcome, ${user.full_name}`}</h5>
        <p className={cx('guide-text')}>Please select a chat to Start messaging.</p>
        <Button primary title="Start A Conversation" />
      </div>
    </div>
  );
}

export default ChatContainer;
