import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { MessageDot, SingleUserPlus, UserCheck, UserMinus, UserXMark } from '~/components/Icons';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FriendsContext } from '~/Context/FriendsContext';
import { SocketContext } from '~/Context/SocketContext';
import Cookies from 'universal-cookie';
import moment from 'moment';
import IconBtn from '~/components/IconBtn';
import { NotificationsContext } from '~/Context/NotificationsContext';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

export const ProfileInfoContext = createContext();

function Profile({ children }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_PARAMS
  const { contact_id } = useParams();

  useEffect(() => {
    if (contact_id == user.user_id) {
      navigate(`/my-profile/posts`, { replace: true });
    }
  }, [contact_id]);

  const wrapperRef = useRef(null);

  // USE_STATE
  const [tab, setTab] = useState(window.location.pathname.split('/')[2]);

  // USE_CONTEXT
  const relationshipContext = useContext(FriendsContext);
  const relationship = relationshipContext.relationship;
  const setRelationship = relationshipContext.setRelationship;

  const notificationsContext = useContext(NotificationsContext);
  const notifications = notificationsContext.notifications;
  const setNotifications = notificationsContext.setNotifications;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const socket = useContext(SocketContext);

  // USE_STATE
  const [profileInfo, setProfileInfo] = useState({});
  const [friendStatus, setFriendStatus] = useState();

  const [avatarDim, setAvatarDim] = useState();
  const [bgDim, setBgDim] = useState();

  // USE_EFFECT

  useEffect(() => {
    setTab(window.location.pathname.split('/')[3]);
  }, [window.location.pathname.split('/')[3]]);

  useEffect(() => {
    const params = {
      profile_id: contact_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/users/${contact_id}`, configurations)
      .then((result) => {
        const profile_package = result.data;
        const profile_info = profile_package.profile_info;
        profile_info.friends = profile_package.friends;
        profile_info.mutual_friends = profile_package.mutual_friends;
        setProfileInfo(profile_info);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [contact_id]);

  useEffect(() => {
    wrapperRef?.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [contact_id, wrapperRef?.current]);

  useEffect(() => {
    setFriendStatus(checkFriendStatus());
  }, [contact_id, relationship]);

  // FUNCTION_HANDLER

  const handleSwitchTab = (tab_code) => {
    setTab(tab_code);
    navigate(`/profiles/${contact_id}/${tab_code}`, { replace: true });
  };

  const handleOpenChatBox = () => {
    const params = {
      user_id: contact_id,
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

  const checkFriendStatus = () => {
    let status = -1;
    relationship.forEach((friend) => {
      if (friend.guest_id == contact_id) {
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

  const handleSendFriendReq = () => {
    const payload = {
      friendId: contact_id,
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
              guest_id: contact_id,
              user_id: user.userId,
              friend_id: contact_id,
              status: 0,
              created_at: moment().valueOf(),
            },
          ];
        });
        setFriendStatus(0);
        return new Promise((resolve, reject) => {
          let data = {
            defined_noti_id: 'noti_01',
            target_user_id: contact_id,
            user_id: user.user_id,
            created_at: moment().valueOf(),
          };

          const payload = data;

          const configurations = {
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
          target_user_id: contact_id,
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

  const handleCancelFriendReq = () => {
    const payload = {
      friendId: contact_id,
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
          return prev.filter((friend) => friend.guest_id != contact_id);
        });
        setFriendStatus(-1);

        // delete notification
        return new Promise((resolve, reject) => {
          const payload = {
            user_id: user.user_id,
            target_user_id: contact_id,
            defined_noti_id: 'noti_01',
          };

          const configurations = {
            data: payload,
            headers: {
              Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
            },
          };

          axiosInstance
            .delete(`/notifications/${contact_id}/${user.user_id}/noti_01`, configurations)
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
          target_user_id: contact_id,
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
      friendId: contact_id,
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
          setRelationship((prev) => prev.filter((relationship) => relationship.guest_id != contact_id));
        } else {
          const newRelationship = {
            created_at: moment().valueOf(),
            friend_id: contact_id,
            guest_id: contact_id,
            status: 1,
            user_avatar: profileInfo.user_avatar,
            user_id: user.user_id,
            user_name: profileInfo.full_name,
          };

          setRelationship((prev) => [
            ...prev.filter((relationship) => relationship.guest_id != contact_id),
            newRelationship,
          ]);
        }
        setNotifications((prev) =>
          prev.filter(
            (notification) =>
              !(
                notification.user_id == contact_id &&
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
              target_user_id: contact_id,
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
            user_id: profileInfo?.user_id,
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
            .delete(`/notifications/${contact_id}/${user.user_id}/noti_01`, configurations)
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
            target_user_id: profileInfo.user_id,
            sender_id: user.user_id,
            created_at: moment().valueOf(),
          };

          socket.emit('reject-friend-req', data);
        } else {
          const data = {
            target_user_id: profileInfo.user_id,
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

  const handleUnFriend = () => {
    const payload = {
      friendId: contact_id,
    };

    const configurations = {
      data: payload,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };
    axiosInstance
      .delete(`/users/friends/${contact_id}`, configurations)
      .then((result) => {
        setRelationship((prev) => prev.filter((relationship) => relationship.guest_id != contact_id));
        setNotifications((prev) =>
          prev.filter(
            (notification) =>
              !(
                notification.user_id == contact_id &&
                notification.target_user_id == user.user_id &&
                (notification.defined_noti_id == 'noti_01' || notification.defined_noti_id == 'noti_02')
              ),
          ),
        );
        setFriendStatus(-1);

        return new Promise((resolve, reject) => {
          const payload = {
            user_id1: user.user_id,
            user_id2: contact_id,
          };

          const configurations = {
            data: payload,
            headers: {
              Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
            },
          };
          axiosInstance
            .delete(`/notifications/${contact_id}/${user.user_id}`, configurations)
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
          target_user_id: profileInfo.user_id,
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

  const renderFriendBtn = () => {
    if (friendStatus === -1) {
      return (
        <IconBtn
          className={cx('friend-option', 'confirm-btn')}
          icon={<SingleUserPlus height="2.4rem" width="2.4rem" />}
          title="Add Friend"
          medium
          onClick={handleSendFriendReq}
        />
      );
    } else if (friendStatus === 0) {
      return (
        <IconBtn
          className={cx('friend-option', 'delete-btn')}
          icon={<UserXMark height="2.4rem" width="2.4rem" />}
          title="Cancel Request"
          medium
          onClick={handleCancelFriendReq}
        />
      );
    } else if (friendStatus === 1) {
      return (
        <IconBtn
          className={cx('friend-option')}
          icon={<UserMinus height="2.4rem" width="2.4rem" />}
          title="UnFriend"
          medium
          onClick={() => handleUnFriend()}
        />
      );
    } else if (friendStatus === 2) {
      return (
        <>
          <IconBtn
            className={cx('friend-option', 'confirm-btn')}
            icon={<UserCheck height="2.4rem" width="2.4rem" />}
            title="Confirm Request"
            medium
            onClick={() => handleResponseFriendReq(1)}
          />
          <IconBtn
            className={cx('friend-option', 'delete-btn')}
            icon={<UserXMark height="2.4rem" width="2.4rem" />}
            title="Delete Request"
            medium
            onClick={() => handleResponseFriendReq(-1)}
          />
        </>
      );
    }
  };

  const getDemension = (src) => {
    let width, height;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function () {
        width = this.width;
        height = this.height;
        resolve({ width: width, height: height });
      };
      img.src = src;
    });
  };

  useEffect(() => {
    getDemension(profileInfo?.user_avatar).then((result) => {
      setAvatarDim(result);
    });

    getDemension(profileInfo?.background_image).then((result) => {
      setBgDim(result);
    });
  }, [profileInfo?.user_avatar, profileInfo?.background_image]);

  const renderImage = (i, src, width, height) => {
    let _width = width;
    let _height = height;

    let _width_ratio = i?.width / _width;
    let _height_ratio = i?.height / _height;

    let style;

    if (_width_ratio < _height_ratio) {
      style = {
        width: i?.width >= _width ? '100%' : 'auto',
        height: i?.height >= _height && i?.width < _width ? '100%' : 'auto',
      };
      if (i?.width < _width) {
        if (i?.height >= _height) {
          style = {
            height: i?.height >= _height ? '100%' : 'auto',
            width: i?.width >= _width && i?.height < _height ? '100%' : 'auto',
          };
        }
      }
    } else {
      style = {
        height: i?.height >= _height ? '100%' : 'auto',
        width: i?.width >= _width && i?.height < _height ? '100%' : 'auto',
      };
      if (i?.height < _height) {
        if (i?.width >= _width) {
          style = {
            width: i?.width >= _width ? '100%' : 'auto',
            height: i?.height >= _height && i?.width < _width ? '100%' : 'auto',
          };
        }
      }
    }

    return <img src={src} style={{ ...style }} />;
  };

  return (
    <div ref={wrapperRef} className={cx('wrapper')}>
      <div className={cx('container')}>
        <div className={cx('header')}>
          <div className={cx('background-image')}>{renderImage(bgDim, profileInfo?.background_image, 982, 200)}</div>
          <div className={cx('user-container')}>
            <div className={cx('user-info')}>
              <div className={cx('user-avatar')}>{renderImage(avatarDim, profileInfo?.user_avatar, 200, 200)}</div>
              <div className={cx('user-title')}>
                <h3 className={cx('user-name')}>{profileInfo?.full_name}</h3>
                <div className={cx('friend-quantity')}>
                  {profileInfo?.friends?.length > 0 ? <p>{`${profileInfo?.friends?.length} friends`}</p> : <></>}
                  {profileInfo?.mutual_friends?.length ? (
                    <p>{`${profileInfo?.mutual_friends?.length} mutual friends`}</p>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            <div className={cx('operations')}>
              {renderFriendBtn()}
              <IconBtn
                className={cx('message-btn')}
                icon={<MessageDot height="2.4rem" width="2.4rem" />}
                title="Message"
                medium
                onClick={handleOpenChatBox}
              />
            </div>
          </div>

          <div className={cx('navigations')}>
            <div
              className={cx('navigation-item', { ['navigation-item-active']: tab == 'posts' })}
              onClick={() => handleSwitchTab('posts')}
            >
              Posts
            </div>

            <div
              className={cx('navigation-item', { ['navigation-item-active']: tab == 'about' })}
              onClick={() => handleSwitchTab('about')}
            >
              About
            </div>

            <div
              className={cx('navigation-item', { ['navigation-item-active']: tab == 'photos' })}
              onClick={() => handleSwitchTab('photos')}
            >
              Photos
            </div>
            <div
              className={cx('navigation-item', { ['navigation-item-active']: tab == 'friends' })}
              onClick={() => handleSwitchTab('friends')}
            >
              Friends
            </div>
          </div>
        </div>
        <ProfileInfoContext.Provider value={{ profileInfo }}>
          <div className={cx('body')}>{children}</div>
        </ProfileInfoContext.Provider>
      </div>
    </div>
  );
}

export default Profile;
