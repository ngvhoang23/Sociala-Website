import classNames from 'classnames/bind';
import styles from './FriendItem.module.scss';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { SocketContext } from '~/Context/SocketContext';
import { FriendsContext } from '~/Context/FriendsContext';
import Cookies from 'universal-cookie';
import axios from 'axios';
import moment from 'moment';
import { NotificationsContext } from '~/Context/NotificationsContext';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import { CurrentMutualFriendsModalContext } from '~/Context/CurrentMutualFriendsModalContext';
import TippyHeadless from '@tippyjs/react/headless';
import ReactionListTippy from '~/components/ReactionListTippy';
import MediaItem2 from '~/components/MediaItem2/MediaItem2';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function FriendItem({
  friend_id,
  friend_name,
  friend_avatar,
  friend,
  friend_request,
  suggestion,
  className,
  no_options,
  onRedirectToProfile,
  small,
  onClick,
  width,
  height,
}) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_NAVIGATE
  const navigate = useNavigate();

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
  const [mutualFriends, setMutualFriends] = useState([]);

  // USE_EFFECT
  useEffect(() => {
    setFriendStatus(checkFriendStatus());
  }, [friend_id, relationship]);

  useEffect(() => {
    getMutualFriends(friend_id)
      .then((result) => {
        setMutualFriends(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // FUNCTION_HANDLER
  const handleCancelFriendReq = () => {
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
      .delete(`/users/friend-req`, configurations)
      .then((result) => {
        setRelationship((prev) => {
          return prev.filter((friend) => friend.guest_id != friend_id);
        });
        setFriendStatus(-1);

        // delete notification
        return new Promise((resolve, reject) => {
          const payload = {
            user_id: user.user_id,
            target_user_id: friend_id,
            defined_noti_id: 'noti_01',
          };

          const configurations = {
            data: payload,
            headers: {
              Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
            },
          };

          axiosInstance
            .delete(`/notifications/${friend_id}/${user.user_id}/noti_01`, configurations)
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
        socket.emit('cancel-friend-req', data);
      })
      .catch((error) => {
        error = new Error();
        console.log(error);
      });
  };

  const handleResponseFriendReq = (status) => {
    const payload = {
      friendId: friend_id,
      status,
    };

    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .put(`/users/friend-req`, payload, configurations)
      .then((result) => {
        if (status == -1) {
          setRelationship((prev) => prev.filter((relationship) => relationship.guest_id != friend_id));
        } else {
          const newRelationship = {
            created_at: moment().valueOf(),
            friend_id: friend_id,
            guest_id: friend_id,
            status: 1,
            user_avatar: friend_avatar,
            user_id: user.user_id,
            user_name: friend_name,
          };

          setRelationship((prev) => [
            ...prev.filter((relationship) => relationship.guest_id != friend_id),
            newRelationship,
          ]);
        }
        setNotifications((prev) =>
          prev.filter(
            (notification) =>
              !(
                notification.user_id == friend_id &&
                notification.target_user_id == user.user_id &&
                notification.defined_noti_id == 'noti_01'
              ),
          ),
        );
        setFriendStatus(status);
        return new Promise((resolve, reject) => {
          if (status == 1) {
            let data = {
              defined_noti_id: 'noti_02',
              target_user_id: friend_id,
              user_id: user.user_id,
              created_at: moment().valueOf(),
            };

            const payload = data;

            const config = {
              headers: {
                Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
              },
            };

            axiosInstance
              .post(`/notifications/single-noti`, payload, configurations)
              .then((result) => {
                resolve(result.data);
              })
              .catch((error) => {
                reject(error);
              });
          } else if (status == -1) {
            resolve(-1);
          }
        });
      })
      .then((result) => {
        return new Promise((resolve, reject) => {
          const payload = {
            user_id: friend_id,
            target_user_id: user.user_id,
            defined_noti_id: 'noti_01',
          };

          const configurations = {
            data: payload,
            headers: {
              Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
            },
          };

          axiosInstance
            .delete(`/notifications/${friend_id}/${user.user_id}/noti_01`, configurations)
            .then((result) => {
              resolve(result);
            })
            .catch((err) => {
              reject(err);
            });
        });
      })
      .then((result) => {
        if (status == -1) {
          const data = {
            target_user_id: friend_id,
            sender_id: user.user_id,
            created_at: moment().valueOf(),
          };

          socket.emit('reject-friend-req', data);
        } else {
          const data = {
            target_user_id: friend_id,
            sender_id: user.user_id,
            created_at: moment().valueOf(),
          };
          socket.emit('accept-friend-req', data);
        }
      })
      .catch((error) => {
        error = new Error();
        console.log(error);
      });
  };

  const handleRedirectToProfile = () => {
    navigate(`/profiles/${friend_id}/posts`, { replace: true });
  };

  const checkFriendStatus = () => {
    let status = -1;
    relationship.forEach((friend) => {
      if (status != -1) {
        return;
      }
      if (friend.guest_id == friend_id) {
        if (friend.friend_id == user.user_id && friend.status == 0) {
          status = 2;
          return;
        }
        status = friend.status;
        return;
      }
    });
    return status;
  };

  const handleSendFriendReq = () => {
    const payload = {
      friendId: friend_id,
    };

    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .post(`/users/friend-req`, payload, configurations)
      .then((result) => {
        setRelationship((prev) => {
          return [
            ...prev,
            {
              guest_id: friend_id,
              user_id: user.userId,
              friend_id: friend_id,
              status: 0,
              created_at: moment().valueOf(),
            },
          ];
        });
        setFriendStatus(0);
        return new Promise((resolve, reject) => {
          let data = {
            defined_noti_id: 'noti_01',
            target_user_id: friend_id,
            user_id: user.user_id,
            created_at: moment().valueOf(),
          };

          const payload = data;
          const config = {
            headers: {
              Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
            },
          };

          axiosInstance
            .post(`/notifications/single-noti`, payload, configurations)
            .then((result) => {
              resolve(result.data);
            })
            .catch((error) => {
              reject(error);
            });
        });
      })
      .then((result) => {
        const data = {
          target_user_id: friend_id,
          sender_id: user.user_id,
          created_at: moment().valueOf(),
        };
        socket.emit('send-friend-req', data);
      })
      .catch((error) => {
        error = new Error();
        console.log(error);
      });
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

  const [imgSrc, setImgSrc] = useState(require('../../../../assets/images/default_user_avatar.jpg'));

  useEffect(() => {
    const img = new Image();
    img.src = friend_avatar;
    img.onload = () => {
      setImgSrc(friend_avatar);
    };
  }, [friend_avatar]);

  return (
    <div className={cx('wrapper', { [className]: className }, { small: small })} onClick={onClick}>
      <MediaItem2
        item={{ url: imgSrc, type: 'image' }}
        width={width}
        height={height}
        border_radius={10}
        _styles={
          {
            // boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
          }
        }
        className={cx('user-avatar')}
      />
      <div className={cx('body')}>
        <h4 className={cx('friend-name')} onClick={handleRedirectToProfile}>
          {friend_name}
        </h4>
        {!no_options && mutualFriends.length > 0 && (
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
            <p className={cx('mutual-friends')} onClick={() => setCurrentMutualFriendsModal(mutualFriends)}>
              {`${mutualFriends.length} mutual friends`}
            </p>
          </TippyHeadless>
        )}
        {!no_options && mutualFriends.length === 0 && <p className={cx('mutual-friends')}></p>}
        {!no_options && (
          <div className={cx('options')}>
            {friendStatus == 2 && (
              <>
                <button className={cx('confirm-btn')} onClick={() => handleResponseFriendReq(1)}>
                  Confirm
                </button>
                <button className={cx('cancel-btn')} onClick={() => handleResponseFriendReq(-1)}>
                  Cancel
                </button>
              </>
            )}
            {friendStatus == -1 && (
              <>
                <button className={cx('add-friend-btn')} onClick={handleSendFriendReq}>
                  Add friend
                </button>
                <button className={cx('cancel-btn')}>Cancel</button>
              </>
            )}

            {friendStatus == 1 && (
              <>
                <button className={cx('see-profile-btn')} onClick={() => handleRedirectToProfile(friend_id)}>
                  See profile
                </button>
                <button className={cx('message-btn')} onClick={handleOpenChatBox}>
                  Message
                </button>
              </>
            )}

            {friendStatus == 0 && (
              <>
                <button className={cx('see-profile-btn')} onClick={() => handleRedirectToProfile(friend_id)}>
                  See profile
                </button>
                <button className={cx('cancel-req-btn')} onClick={handleCancelFriendReq}>
                  Cancel Request
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendItem;
