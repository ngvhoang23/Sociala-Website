import classNames from 'classnames/bind';
import styles from './AllFriendsTab.module.scss';
import FriendItem from '../../components/FriendItem';
import Cookies from 'universal-cookie';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function AllFriendsTab() {
  // CONSTANCE
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_STATE
  const [friends, setFriends] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  // USE_EFFECT
  useEffect(() => {
    const params = {
      queried_user_id: user.user_id,
    };

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

  // FUNCTION_HANDLER
  const handleRedirectToProfile = (friend_id) => {
    navigate(`/profiles/${friend_id}/posts`, { replace: true });
  };

  return (
    <div className={cx('wrapper')}>
      <h3 className={cx('header-title')}>All Friends</h3>
      <div className={cx('container')}>
        {friends.map((friend) => {
          return (
            <FriendItem
              friend_id={friend.user_id}
              key={friend.user_id}
              className={cx('friend-item')}
              friend_avatar={friend.user_avatar}
              friend_name={friend.full_name}
              friend
              onRedirectToProfile={() => handleRedirectToProfile(friend.user_id)}
              width={176}
              height={176}
            />
          );
        })}
      </div>
    </div>
  );
}

export default AllFriendsTab;
