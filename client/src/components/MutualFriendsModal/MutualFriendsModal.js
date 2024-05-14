import classNames from 'classnames/bind';
import styles from './MutualFriendsModal.module.scss';
import { CloseIcon } from '../Icons';
import OnlineContactItem from '../OnlineContactItem';
import { CurrentMutualFriendsModalContext } from '~/Context/CurrentMutualFriendsModalContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function MutualFriendsModal({ onClose, friends }) {
  // USE_NAVIGATE
  const navigate = useNavigate();

  const handleOpenProfile = (friend_id) => {
    navigate(`/profiles/${friend_id}/posts`, { replace: true });
  };

  // USE_CONTEXT
  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const currentMutualFriendsModalContext = useContext(CurrentMutualFriendsModalContext);
  const currentMutualFriendsModal = currentMutualFriendsModalContext.currentMutualFriendsModal;
  const setCurrentMutualFriendsModal = currentMutualFriendsModalContext.setCurrentMutualFriendsModal;

  const handleOpenChatBox = (friend_id) => {
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

  // FUNCTION_HANDLER
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

  const handleGetMutualFriends = (user_id) => {
    getMutualFriends(user_id).then((result) => {
      setCurrentMutualFriendsModal(result);
    });
  };

  const renderFriends = () => {
    return friends.map((friend) => (
      <OnlineContactItem
        key={friend.user_id}
        contact_avatar={friend.user_avatar}
        contact_name={friend.full_name}
        description={'1 mutual group'}
        className={cx('account-item')}
        onClickDescription={() => {
          handleGetMutualFriends(friend.user_id);
        }}
        onOpenProfile={() => {
          handleOpenProfile(friend.user_id);
          onClose();
        }}
        operation={
          <button
            className={cx('operation-btn')}
            onClick={() => {
              onClose();
              handleOpenChatBox(friend.user_id);
            }}
          >
            Message
          </button>
        }
        avatar_width={36}
        avatar_height={36}
      />
    ));
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <div className={cx('header')}>
          <h3 className={cx('header-title')}>Mutual Friends</h3>
          <button className={cx('close-btn')} onClick={onClose}>
            <CloseIcon width={'2.4rem'} height="2.4rem" />
          </button>
        </div>
        <div className={cx('body')}>{renderFriends()}</div>
      </div>
    </div>
  );
}

export default MutualFriendsModal;
