import classNames from 'classnames/bind';
import styles from './SearchUsersTab.module.scss';
import FriendItem from '../../components/FriendItem';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { SocketContext } from '~/Context/SocketContext';
import { FriendsContext } from '~/Context/FriendsContext';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import { useParams } from 'react-router-dom';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function SearchUsersTab() {
  // CONSTANCE
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_PARAMS
  const { search_value } = useParams();

  // USE_STATE
  const [contacts, setContacts] = useState([]);

  // USE_EFFECT
  useEffect(() => {
    handleSearchUsers(search_value);
  }, [search_value]);

  // FUNCTION_HANDLER

  const handleSearchUsers = (search_value) => {
    const params = {
      searchValue: search_value,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    search_value &&
      axiosInstance
        .get(`/users/search-users`, configurations)
        .then((result) => {
          console.log(result);
          setContacts(result.data);
        })
        .catch((error) => {
          error = new Error();
        });
  };

  return (
    <div className={cx('wrapper')}>
      <h3 className={cx('header-title')}>Search results</h3>
      <div className={cx('container')}>
        {contacts.map((contact) => {
          return (
            <FriendItem
              key={contact.user_id}
              friend_id={contact.user_id}
              className={cx('friend-item')}
              friend_avatar={contact.user_avatar}
              friend_name={contact.full_name}
              mutual_friends={12}
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

export default SearchUsersTab;
