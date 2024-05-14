import classNames from 'classnames/bind';
import styles from './FriendsTab.module.scss';
import { SearchIcon } from '~/components/Icons';
import FriendItem from '~/components/FriendItem';
import Cookies from 'universal-cookie';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function FriendsTab() {
  // CONSTANCE
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_PARAMS
  const { contact_id } = useParams();

  // USE_STATE
  const [friends, setFriends] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  // USE_EFFECT
  useEffect(() => {
    const params = { queried_user_id: contact_id };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/users/friends`, configurations)
      .then((result) => {
        setFriends(result.data);
      })
      .catch((error) => {
        error = new Error();
      });
  }, []);

  useEffect(() => {
    const params = { search_value: searchValue, queried_user_id: contact_id };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/users/friends/${contact_id}`, configurations)
      .then((result) => {
        setFriends(result.data);
      })
      .catch((error) => {
        error = new Error();
      });
  }, [searchValue]);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <h3 className={cx('header-title')}>Friends</h3>
        <div className={cx('tools')}>
          <div className={cx('search-friends-container')}>
            <SearchIcon width={'2rem'} height={'2rem'} />
            <input
              className={cx('search-input')}
              placeholder="Search friends"
              spellCheck={false}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={cx('body')}>
        {friends.map((friend) => {
          return (
            <FriendItem
              key={friend.user_id}
              className={cx('friend-item')}
              friend_name={friend.full_name}
              friend_avatar={friend.user_avatar}
              friend_id={friend.user_id}
            />
          );
        })}
      </div>
    </div>
  );
}

export default FriendsTab;
