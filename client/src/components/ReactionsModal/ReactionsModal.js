import classNames from 'classnames/bind';
import styles from './ReactionsModal.module.scss';
import { CloseIcon, MessageDot, MessengerIcon, SingleUserPlus, UserCheck, UserMinus, UserXMark } from '../Icons';
import OnlineContactItem from '../OnlineContactItem';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import { CurrentReactionsModalContext } from '~/Context/CurrentReactionsModalContext';
import { FriendsContext } from '~/Context/FriendsContext';
import { NotificationsContext } from '~/Context/NotificationsContext';
import { SocketContext } from '~/Context/SocketContext';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import moment from 'moment';
import IconBtn from '../IconBtn';
import { CurrentMutualFriendsModalContext } from '~/Context/CurrentMutualFriendsModalContext';
import { AngryIcon, HeartIcon, LaughIcon, LikeIcon, SadIcon, WowIcon } from '../EmotionIcon/EmotionIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function ReactionsModal({ onClose, _reactions }) {
  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_CONTEXT
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const relationshipContext = useContext(FriendsContext);
  const relationship = relationshipContext.relationship;
  const setRelationship = relationshipContext.setRelationship;

  const notificationsContext = useContext(NotificationsContext);
  const notifications = notificationsContext.notifications;
  const setNotifications = notificationsContext.setNotifications;

  const currentMutualFriendsModalContext = useContext(CurrentMutualFriendsModalContext);
  const currentMutualFriendsModal = currentMutualFriendsModalContext.currentMutualFriendsModal;
  const setCurrentMutualFriendsModal = currentMutualFriendsModalContext.setCurrentMutualFriendsModal;

  const socket = useContext(SocketContext);

  // USE_STATE
  const [reactions, setReactions] = useState(_reactions);
  const [currentReactions, setCurrentReactions] = useState();
  const [currentTab, setCurrentTab] = useState('all');

  // USE_EFFECT
  useEffect(() => {
    setReactions((prev) => {
      return _reactions.map((reaction) => {
        return { ...reaction, status: checkFriendStatus(reaction.user_id) };
      });
    });
  }, [relationship]);

  useEffect(() => {
    setCurrentReactions((prev) => {
      let reactions_type = [];
      if (currentTab === 'all') {
        reactions_type = reactions;
        return reactions_type;
      }
      reactions.forEach((reaction) => {
        if (reaction.type === currentTab) {
          reactions_type.push(reaction);
        }
      });
      return reactions_type;
    });
  }, [reactions, currentTab]);

  // FUNCTION_HANDLER

  const renderReactions = () => {
    return currentReactions.map((reaction) => (
      <div key={reaction.user_id} className={cx('reaction-item')}>
        <OnlineContactItem
          contact_avatar={reaction.user_avatar}
          contact_name={reaction.full_name}
          className={cx('account-item')}
          onOpenProfile={() => {
            if (reaction.user_id !== user.user_id) {
              handleOpenProfile(reaction.user_id);
              onClose();
            }
          }}
          operation={reaction.user_id !== user.user_id ? renderFriendBtn(reaction) : ''}
          avatar_width={36}
          avatar_height={36}
        />
        <span className={cx('reaction-icon')}>{renderIcon(reaction.type, '18rem', '18rem')}</span>
      </div>
    ));
  };

  const handleOpenProfile = (contact_id) => {
    navigate(`/profiles/${contact_id}/posts`, { replace: true });
  };

  const handleOpenChatBox = (contact_id) => {
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

  const checkFriendStatus = (contact_id) => {
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

  const handleSendFriendReq = (contact_id) => {
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
        setCurrentReactions((currentReactions) => {
          currentReactions.forEach((reaction) => {
            if (reaction.user_id === contact_id) {
              reaction.status = 0;
            }
          });
          return JSON.parse(JSON.stringify(currentReactions));
        });
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

  const handleCancelFriendReq = (contact_id) => {
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
        setCurrentReactions((currentReactions) => {
          currentReactions.forEach((reaction) => {
            if (reaction.user_id === contact_id) {
              reaction.statu = 0 - 1;
            }
          });
          return JSON.parse(JSON.stringify(currentReactions));
        });

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

  const handleResponseFriendReq = (status, contact) => {
    const payload = {
      friendId: contact.user_id,
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
          setRelationship((prev) => prev.filter((relationship) => relationship.guest_id != contact.user_id));
        } else {
          const newRelationship = {
            created_at: moment().valueOf(),
            friend_id: contact.user_id,
            guest_id: contact.user_id,
            status: 1,
            user_avatar: contact.user_avatar,
            user_id: user.user_id,
            user_name: contact.full_name,
          };

          setRelationship((prev) => [
            ...prev.filter((relationship) => relationship.guest_id != contact.user_id),
            newRelationship,
          ]);
        }
        setNotifications((prev) =>
          prev.filter(
            (notification) =>
              !(
                notification.user_id == contact.user_id &&
                notification.target_user_id == user.user_id &&
                notification.defined_noti_id == 'noti_01'
              ),
          ),
        );
        setCurrentReactions((currentReactions) => {
          currentReactions.forEach((reaction) => {
            if (reaction.user_id === contact.contact_id) {
              reaction.statusstatu = 0;
            }
          });
          return JSON.parse(JSON.stringify(currentReactions));
        });
        return new Promise((resolve, reject) => {
          if (status == 1) {
            let data = {
              defined_noti_id: 'noti_02',
              target_user_id: contact.user_id,
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
            user_id: contact?.user_id,
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
            .delete(`/notifications/${contact.user_id}/${user.user_id}/noti_01`, configurations)
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
            target_user_id: contact.user_id,
            sender_id: user.user_id,
            created_at: moment().valueOf(),
          };

          socket.emit('reject-friend-req', data);
        } else {
          const data = {
            target_user_id: contact.user_id,
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

  const renderFriendBtn = (contact) => {
    if (contact.status === -1) {
      return (
        <IconBtn
          className={cx('friend-option', 'primary-btn')}
          icon={<SingleUserPlus height="2rem" width="2rem" />}
          title="Add Friend"
          small
          onClick={() => handleSendFriendReq(contact.user_id)}
        />
      );
    } else if (contact.status === 0) {
      return (
        <IconBtn
          className={cx('friend-option')}
          icon={<UserXMark height="2rem" width="2rem" />}
          title="Cancel Request"
          small
          onClick={() => handleCancelFriendReq(contact.user_id)}
        />
      );
    } else if (contact.status === 1) {
      return (
        <IconBtn
          className={cx('friend-option', 'primary-btn')}
          icon={<FontAwesomeIcon icon={faFacebookMessenger} style={{ width: '1.8rem' }} />}
          title="Message"
          small
          onClick={() => {
            onClose();
            handleOpenChatBox(contact.user_id);
          }}
        />
      );
    } else if (contact.status === 2) {
      return (
        <>
          <IconBtn
            className={cx('friend-option')}
            icon={<UserCheck height="2rem" width="2rem" />}
            title="Confirm Request"
            small
            onClick={() => handleResponseFriendReq(1, contact)}
          />
          <IconBtn
            className={cx('friend-option')}
            icon={<UserXMark height="2rem" width="2rem" />}
            title="Delete Request"
            small
            onClick={() => handleResponseFriendReq(-1, contact)}
          />
        </>
      );
    }
  };

  const renderIcon = (code, width = '24px', height = '24px') => {
    switch (code) {
      case 'like':
        return <LikeIcon width={width} height={height} className={cx('emotion-icon')} />;
      case 'love':
        return <HeartIcon width={width} height={height} className={cx('emotion-icon')} />;

      case 'haha':
        return <LaughIcon width={width} height={height} className={cx('emotion-icon')} />;

      case 'sad':
        return <SadIcon width={width} height={height} className={cx('emotion-icon')} />;

      case 'wow':
        return <WowIcon width={width} height={height} className={cx('emotion-icon')} />;

      case 'angry':
        return <AngryIcon width={width} height={height} className={cx('emotion-icon')} />;
      default:
    }
  };

  const renderTabs = () => {
    const reaction_types = {
      all: 0,
      like: 0,
      love: 0,
      haha: 0,
      sad: 0,
      wow: 0,
      angry: 0,
    };

    reactions.forEach((reaction) => {
      reaction_types[reaction.type]++;
      reaction_types['all']++;
    });

    const comps = [];

    for (const key in reaction_types) {
      if (reaction_types[key] > 0) {
        comps.push(
          <div
            key={key}
            className={cx('tab-item', { [`${key}-active`]: currentTab === key })}
            onClick={() => {
              setCurrentTab(key);
            }}
          >
            {renderIcon(key)}
            <p className={cx('reaction-quantity')}>{key === 'all' ? 'All' : reaction_types[key]}</p>
          </div>,
        );
      }
    }

    return comps;
  };

  return (
    <div className={cx('wrapper')} onClick={onClose}>
      <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
        <div className={cx('header')}>
          <div className={cx('tabs-container')}>{renderTabs()}</div>
          <button className={cx('close-btn')} onClick={onClose}>
            <CloseIcon width={'2.4rem'} height="2.4rem" />
          </button>
        </div>
        <div className={cx('body')}>{currentReactions && renderReactions()}</div>
      </div>
    </div>
  );
}

export default ReactionsModal;
