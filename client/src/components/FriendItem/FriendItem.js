import classNames from 'classnames/bind';
import styles from './FriendItem.module.scss';
import { MessageDot, ThreeDotIcon, UserXMark } from '../Icons';
import TippyWrapper from '../TippyWrapper';
import IconBtn from '../IconBtn';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { SocketContext } from '~/Context/SocketContext';
import moment from 'moment';
import { FriendsContext } from '~/Context/FriendsContext';
import { NotificationsContext } from '~/Context/NotificationsContext';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';
import TippyHeadless from '@tippyjs/react/headless';
import ReactionListTippy from '../ReactionListTippy';
import { CurrentMutualFriendsModalContext } from '~/Context/CurrentMutualFriendsModalContext';
import MediaItem2 from '../MediaItem2/MediaItem2';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function FriendItem({ friend_id, className, friend_name, friend_avatar }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_REF
  const optionsRef = useRef();

  // USE_CONTEXT
  const socket = useContext(SocketContext);

  const relationshipContext = useContext(FriendsContext);
  const relationship = relationshipContext.relationship;
  const setRelationship = relationshipContext.setRelationship;

  const notificationsContext = useContext(NotificationsContext);
  const notifications = notificationsContext.notifications;
  const setNotifications = notificationsContext.setNotifications;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const currentMutualFriendsModalContext = useContext(CurrentMutualFriendsModalContext);
  const currentMutualFriendsModal = currentMutualFriendsModalContext.currentMutualFriendsModal;
  const setCurrentMutualFriendsModal = currentMutualFriendsModalContext.setCurrentMutualFriendsModal;

  // USE_STATE
  const [friendStatus, setFriendStatus] = useState();
  const [isOpenOptions, setIsOpenOptions] = useState(false);
  const [mutualFriends, setMutualFriends] = useState([]);

  // USE_EFFECT
  useEffect(() => {
    setFriendStatus(checkFriendStatus());
  }, [relationship]);

  // FUNCTION_HANDLER
  const handleRedirectToProfile = () => {
    navigate(`/profiles/${friend_id}/posts`, { replace: true });
  };

  const handleOpenChatBox = () => {
    const params = {
      user_id: friend_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/message-datas/check-exist`, configurations)
      .then((result) => {
        const room_id = result.data.room_id;
        navigate(`/messenger/${room_id}`, { replace: true });
      })
      .catch((error) => {
        error = new Error();
        console.log(error);
      });
  };

  const handleUnFriend = () => {
    const payload = {
      friendId: friend_id,
    };

    const configurations = {
      data: payload,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .delete(`/users/friends/${friend_id}`, configurations)
      .then((result) => {
        setRelationship((prev) => prev.filter((relationship) => relationship.guest_id != friend_id));
        setNotifications((prev) =>
          prev.filter(
            (notification) =>
              !(
                notification.user_id == friend_id &&
                notification.target_user_id == user.user_id &&
                (notification.defined_noti_id == 'noti_01' || notification.defined_noti_id == 'noti_02')
              ),
          ),
        );
        setFriendStatus(-1);

        return new Promise((resolve, reject) => {
          const payload = {
            user_id1: user.user_id,
            user_id2: friend_id,
          };

          const configurations = {
            data: payload,

            headers: {
              Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
            },
          };

          axiosInstance
            .delete(`/notifications/${friend_id}/${user.user_id}`, configurations)
            .then((result) => {
              resolve(result);
            })
            .catch((err) => {
              reject(err);
            });
        });
      })
      .then((result) => {
        const data = {
          target_user_id: friend_id,
          sender_id: user.user_id,
          created_at: moment().valueOf(),
        };

        socket.emit('un-friend', data);
      })
      .catch((error) => {
        error = new Error();
        console.log(error);
      });
  };

  const checkFriendStatus = () => {
    let status = -1;
    relationship.forEach((friend) => {
      if (friend.guest_id == friend_id) {
        if (friend.friend_id == user.user_id && friend.status != 1 && friend.status != -1) {
          status = 2;
          return;
        }
        status = friend.status;
        return;
      }
    });
    return status;
  };

  useOutsideAlerter(optionsRef, () => {
    setIsOpenOptions(false);
  });

  useEffect(() => {
    getMutualFriends(friend_id)
      .then((result) => {
        setMutualFriends(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getMutualFriends = (user_id) => {
    return new Promise((resolve, reject) => {
      const params = {
        user_id,
      };
      const configurations = {
        params: params,
        headers: {
          Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
        },
      };
      axiosInstance
        .get(`/users/mutual-friends/${user_id}`, configurations)
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          error = new Error();
          reject(error);
        });
    });
  };

  return (
    <div className={cx('wrapper', { [className]: className })}>
      <div className={cx('user-info')}>
        <div className={cx('friend-avatar')}>
          <MediaItem2
            item={{ url: friend_avatar, type: 'image' }}
            width={86}
            height={86}
            border_radius={10}
            _styles={{
              boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
            }}
            className={cx('user-avatar')}
          />
        </div>
        <div className={cx('user-title')}>
          <h3 className={cx('user-name')} onClick={handleRedirectToProfile}>
            {friend_name}
          </h3>
          {mutualFriends.length > 0 && (
            <TippyHeadless
              interactive={true}
              offset={[0, 0]}
              delay={[300, 0]}
              placement="top-start"
              render={(attrs) => (
                <div className="box" tabIndex="-1" {...attrs}>
                  <ReactionListTippy
                    _key="reactions"
                    user_reactions={mutualFriends}
                    reaction_count={mutualFriends.length}
                  />
                </div>
              )}
            >
              <p
                className={cx('mutual-friend-quantity')}
                onClick={() => setCurrentMutualFriendsModal(mutualFriends)}
              >{`${mutualFriends.length} mutual friends`}</p>
            </TippyHeadless>
          )}
        </div>
      </div>
      {user.user_id != friend_id && (
        <div ref={optionsRef} className={cx('tools')}>
          <button
            className={cx('options-btn', { 'options-btn-active': isOpenOptions })}
            onClick={() => setIsOpenOptions((prev) => !prev)}
          >
            <ThreeDotIcon className={cx('operation-icon')} width={'2.2rem'} height={'2.2rem'} />
          </button>
          {isOpenOptions && (
            <TippyWrapper className={cx('menu-options')} onClick={() => setIsOpenOptions(false)}>
              <IconBtn
                className={cx('friend-option')}
                icon={<MessageDot width="2.4rem" height="2.4rem" />}
                title="Message"
                medium
                onClick={handleOpenChatBox}
              />
              {friendStatus == 1 && (
                <IconBtn
                  className={cx('friend-option', 'un-friend-option')}
                  icon={<UserXMark width="2.1rem" height="2.1rem" />}
                  title="UnFriend"
                  medium
                  onClick={handleUnFriend}
                />
              )}
            </TippyWrapper>
          )}
        </div>
      )}
    </div>
  );
}

export default FriendItem;
