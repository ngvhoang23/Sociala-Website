import classNames from 'classnames/bind';
import styles from './SentFriendRequestsTab.module.scss';
import FriendItem from '../../components/FriendItem';
import Cookies from 'universal-cookie';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function SentFriendRequestsTab() {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE
  const [sentFriendRequests, setSentFriendRequests] = useState([]);

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
      .get(`/users/friends/sent-friend-requests/${user.user_id}`, configurations)
      .then((result) => {
        setSentFriendRequests(result.data);
      })
      .catch((error) => {
        error = new Error();
      });
  }, []);

  return (
    <div className={cx('wrapper')}>
      <h3 className={cx('header-title')}>Sent Friend Requests</h3>
      <div className={cx('container')}>
        {sentFriendRequests.map((suggestion) => {
          return (
            <FriendItem
              key={suggestion.user_id}
              friend_id={suggestion.user_id}
              className={cx('friend-item')}
              friend_avatar={suggestion.user_avatar}
              friend_name={suggestion.full_name}
              suggestion
              width={176}
              height={176}
            />
          );
        })}
      </div>
    </div>
  );
}

export default SentFriendRequestsTab;
