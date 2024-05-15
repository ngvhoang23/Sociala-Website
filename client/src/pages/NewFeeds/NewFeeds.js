import classNames from 'classnames/bind';
import styles from './NewFeeds.module.scss';
import NavContent from '~/components/NavContent/NavContent';
import StoryContent from '~/components/StoryContent';
import PostsContainer from '~/components/PostsContainer';
import OnlineContactContainer from '~/components/OnlineContactContainer';
import MiniChatBox from '~/components/MiniChatBox';
import { useContext, useEffect, useRef } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { ChatBoxesContext } from '~/Context/ChatBoxesContext';
import Cookies from 'universal-cookie';
import moment from 'moment';
import { IsOpenPostGeneratorContext } from '~/Context/IsOpenPostGeneratorContext';
import PostGeneratorLable from '~/components/PostGeneratorLable';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import { NeedToReLoadContext } from '~/Context/NeedToReLoadContext';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function NewFeeds() {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  //  USE_REF
  const topPageRef = useRef();

  // USE_CONTEXT
  const chatBoxesContext = useContext(ChatBoxesContext);
  const setChatBoxes = chatBoxesContext.setChatBoxes;
  const chatBoxes = chatBoxesContext.chatBoxes;

  const isOpenPostGeneratorContext = useContext(IsOpenPostGeneratorContext);
  const isOpenPostGenerator = isOpenPostGeneratorContext.isOpen;
  const setIsOpenPostGenerator = isOpenPostGeneratorContext.setIsOpen;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const needToReLoadSignalContext = useContext(NeedToReLoadContext);
  const reLoadingSignal = needToReLoadSignalContext.reLoadingSignal;
  const setReLoadingSignal = needToReLoadSignalContext.setReLoadingSignal;

  // USE_STATE

  // USE_EFFECT
  useEffect(() => {
    const room_ids = chatBoxes.map((chatBox) => chatBox.contact.room_id);

    const params = {
      room_ids,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };
    room_ids.length > 0 &&
      axiosInstance
        .get(`/message-datas/chat-boxes`, configurations)
        .then((result) => {
          const chatBoxesData = [];
          let i = 0;
          const chat_boxes_length = result.data.length;

          let messages;

          while (i < chat_boxes_length) {
            messages = result.data[i + 2].map((message) => {
              return { ...message, isSent: true };
            });
            chatBoxesData.push({
              contact: { ...result.data[i][0], members: result.data[i + 1] },
              messages,
              read_message_data: result.data[i + 3],
              removed_message_data: result.data[i + 4],
            });
            i += 5;
          }

          setChatBoxes(chatBoxesData);
        })
        .catch((error) => {
          console.log(error);
        });
  }, []);

  useEffect(() => {
    topPageRef?.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [reLoadingSignal?.status]);

  // Function_Handler
  const handleCloseChatBox = (room_id) => {
    setChatBoxes((prev) => prev.filter((chatBox) => chatBox.contact.room_id != room_id));
  };

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

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <div className={cx('nav-content')}>
          <NavContent />
        </div>
        <div className={cx('new-feeds-content')}>
          <div ref={topPageRef}></div>
          <StoryContent className={cx('story-content')} />
          <PostGeneratorLable
            onOpenPostGenerator={() => {
              setIsOpenPostGenerator((prev) => !prev);
            }}
          />
          <PostsContainer />
        </div>
        <div className={cx('contacts-content')}>
          <OnlineContactContainer className={cx('online-contacts')} handleOpenChatBox={handleOpenChatBox} />
        </div>
      </div>
      <div className={cx('mini-chat-box-list')}>
        {chatBoxes.map((chatBox) => {
          let contactName = '';
          let contactAvatar = '';
          if (chatBox.contact.room_type === 1) {
            const member = chatBox.contact.members.filter((member) => member.user_id !== user.user_id)[0];

            contactName = member?.full_name;
            contactAvatar = member?.user_avatar;
          } else {
            contactName = chatBox.contact.room_name;
            contactAvatar = chatBox.contact.room_avatar;
          }
          return (
            <MiniChatBox
              room_type={chatBox.contact.room_type}
              admin_id={chatBox.contact.admin_id}
              room_id={chatBox.contact.room_id}
              members={chatBox.contact.members}
              messages={chatBox.messages}
              key={chatBox.contact.room_id}
              room_name={contactName}
              room_avatar={contactAvatar}
              onClose={() => handleCloseChatBox(chatBox.contact.room_id)}
              className={cx('mini-chat-box-wrapper')}
              read_message_data={chatBox.read_message_data}
              removed_message_data={chatBox.removed_message_data}
            />
          );
        })}
      </div>
    </div>
  );
}

export default NewFeeds;
