import classNames from 'classnames/bind';
import styles from './FriendRequestsTab.module.scss';
import FriendItem from '../../components/FriendItem';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { SocketContext } from '~/Context/SocketContext';
import { FriendsContext } from '~/Context/FriendsContext';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function FriendRequestsTab() {
  // CONSTANCE
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE
  const [friendRequests, setFriendRequests] = useState([]);

  // USE_EFFECT
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/users/friends/friend-requests/${user.user_id}`, config)
      .then((result) => {
        setFriendRequests(result.data);
      })
      .catch((error) => {
        error = new Error();
      });
  }, []);

  return (
    <div className={cx('wrapper')}>
      <h3 className={cx('header-title')}>Friend Requests</h3>
      <div className={cx('container')}>
        {friendRequests.map((friend_request) => {
          return (
            <FriendItem
              key={friend_request.user_id}
              friend_id={friend_request.user_id}
              className={cx('friend-item')}
              friend_name={friend_request.full_name}
              friend_avatar={friend_request.user_avatar}
              friend_request
              width={176}
              height={176}
            />
          );
        })}
      </div>
    </div>
  );
}

export default FriendRequestsTab;
