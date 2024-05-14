import classNames from 'classnames/bind';
import styles from './NavContent.module.scss';
import NavBox from './NavBox';
import NavItem from './NavItem';
import { useContext, useEffect } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { GearIcon, MessageIcon, UserGroupIcon } from '../EmotionIcon/EmotionIcon';
import { FriendsContext } from '~/Context/FriendsContext';
import { ContactsContext } from '~/Context/ContactsContext';
import { useNavigate } from 'react-router-dom';
import { ChatBoxesContext } from '~/Context/ChatBoxesContext';
import moment from 'moment';
import Cookies from 'universal-cookie';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import { NeedToLoadContext } from '~/Context/NeedToReLoadContext';
import MediaItem2 from '../MediaItem2/MediaItem2';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function NavContent() {
  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_CONTEXT
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const relationshipContext = useContext(FriendsContext);
  const relationship = relationshipContext.relationship;
  const setRelationship = relationshipContext.setRelationship;

  const contactsContext = useContext(ContactsContext);
  const setContacts = contactsContext.handleSetContacts;
  const contacts = contactsContext.contacts;

  const chatBoxesContext = useContext(ChatBoxesContext);
  const setChatBoxes = chatBoxesContext.setChatBoxes;
  const chatBoxes = chatBoxesContext.chatBoxes;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const renderFriends = () => {
    const comps = [];
    relationship.forEach((friend, ind) => {
      if (ind >= 6) {
        return;
      } else {
        comps.push(
          <NavItem
            key={friend.guest_id}
            icon={
              <MediaItem2
                item={{ url: friend.user_avatar, type: 'image' }}
                width={36}
                height={36}
                border_radius={1000}
                _styles={
                  {
                    // boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                  }
                }
                className={cx('profile_avatar')}
              />
            }
            title={friend.full_name}
            onClick={() => handleRedirectToProfile(friend.guest_id)}
          />,
        );
      }
    });
    return comps;
  };

  const renderGroups = () => {
    let quantity = 0;
    const comps = [];
    contacts.forEach((contact, ind) => {
      if (contact.room_type === 2) {
        if (quantity >= 5) {
          return;
        }
        quantity++;
        comps.push(
          <NavItem
            key={quantity}
            icon={
              <MediaItem2
                item={{ url: contact.room_avatar, type: 'image' }}
                width={36}
                height={36}
                border_radius={1000}
                _styles={
                  {
                    // boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                  }
                }
                className={cx('profile_avatar')}
              />
            }
            title={contact.room_name}
            onClick={() => handleOpenChatBox(contact)}
          />,
        );
      } else {
        return;
      }
    });
    return comps;
  };

  const handleRedirectToMyProfile = () => {
    navigate(`/my-profile/posts`, { replace: true });
  };

  const handleRedirectToProfile = (profile_id) => {
    navigate(`/profiles/${profile_id}/posts`, { replace: true });
  };

  const handleRedirectToContacts = () => {
    navigate(`/contacts`, { replace: true });
  };

  const handleRedirectToMessenger = () => {
    navigate(`/messenger`, { replace: true });
  };

  const handleRedirectToSettingDashboard = () => {
    navigate(`/user/setting`, { replace: true });
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
      <NavBox header_title="Shortcuts">
        <NavItem
          // icon={<img className={cx('profile_avatar')} src={user.user_avatar} alt="" />}
          icon={
            <MediaItem2
              item={{ url: user.user_avatar, type: 'image' }}
              width={36}
              height={36}
              border_radius={1000}
              _styles={
                {
                  // boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                }
              }
              className={cx('profile_avatar')}
            />
          }
          title={user.full_name}
          onClick={handleRedirectToMyProfile}
        />

        <NavItem
          background_color={'linear-gradient(to right,#f2994a,#f2c94c)'}
          icon={<UserGroupIcon width="36px" height="36px" />}
          title={'Friends'}
          onClick={handleRedirectToContacts}
        />

        <NavItem
          background_color={'linear-gradient(to right,#ee0979,#ff6a00)'}
          icon={<MessageIcon width="34px" height="34px" />}
          title={'Messenger'}
          onClick={handleRedirectToMessenger}
        />

        <NavItem
          background_color={'linear-gradient(to right,#ee0979,#ff6a00)'}
          icon={<GearIcon width="36px" height="36px" />}
          title={'Settings'}
          onClick={handleRedirectToSettingDashboard}
        />
      </NavBox>

      <NavBox header_title="Your Friends">{renderFriends()}</NavBox>

      <NavBox header_title="Your Groups">{renderGroups()}</NavBox>
    </div>
  );
}

export default NavContent;
