import { useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import { PhoneIcon } from '../Icons';
import { NavLink } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cookies = new Cookies();

const cx = classNames.bind(styles);

function AccountItem({
  user_id,
  status,
  avatar,
  headerTitle,
  description,
  timeStamp,
  option,
  to,
  href,
  className,
  m_friends,
  small,
  no_border,
  is_read,
  active,
  onClick,
}) {
  let Comp = 'div';

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  if (to) {
    Comp = NavLink;
  } else if (href) {
    Comp = 'a';
  }

  // USE_STATE

  const [mutualFriends, setMultualFriends] = useState([]);

  // USE_EFFECT
  useEffect(() => {
    if (m_friends) {
      getMutualFriends(user_id)
        .then((result) => {
          setMultualFriends(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  // FUNCTION_HANDLER
  const renderMultualFriends = (mutualFriends) => {
    if (!mutualFriends) {
      return;
    }

    let mutualFriendsComp = [];

    mutualFriendsComp = mutualFriends?.map((friend, ind) => {
      if (ind >= 6) {
        return <></>;
      }

      return (
        <span key={friend.user_id} className={cx('mutual-friend-item')}>
          <img src={friend.user_avatar} alt="" />
        </span>
      );
    });

    if (mutualFriends.length != 0) {
      mutualFriendsComp = [
        ...mutualFriendsComp,
        <p
          key={mutualFriends.length}
          className={cx('rest-mutual-friends-title')}
        >{`${mutualFriends.length} mutual friends`}</p>,
      ];
    }

    return mutualFriendsComp;
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

  return (
    <Comp
      className={
        Comp === NavLink
          ? (nav) => cx('wrapper', { active: nav.isActive || active, small: small, [className]: className })
          : cx('wrapper', { [className]: className, small: small, active: active, is_read: is_read, un_read: !is_read })
      }
      to={to}
      href={href}
      onClick={onClick}
    >
      <div className={cx('header')}>
        <img className={cx('account-avatar')} src={avatar} alt="account-avatar" />
        {status && <div className={cx('online-icon')}></div>}
      </div>
      <div className={cx('body')}>
        <div className={cx('account-name')}>
          {headerTitle && <p className={cx('account-name')}>{headerTitle}</p>}
          {timeStamp && <span className={cx('status')}>{timeStamp}</span>}
        </div>
        {description && <p className={cx('description')}>{description}</p>}
        {mutualFriends && <div className={cx('mutual-friends-container')}>{renderMultualFriends(mutualFriends)}</div>}
      </div>
      <div
        className={cx('footer')}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {option}
      </div>
    </Comp>
  );
}

export default AccountItem;
