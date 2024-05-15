import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import classNames from 'classnames/bind';
import styles from './SearchResults.module.scss';
import AccountItem from '../AccountItem';
import { SearchUserValueContext } from '~/pages/SearchFriends/SearchUserValueContext';
import { SearchBtnClickSignContext } from '~/Context/SearchBtnClickSignContext';
import Cookies from 'universal-cookie';
import axios from 'axios';
import IconBtn from '../IconBtn';
import { MessageDot, PhoneIcon, UserIcon } from '../Icons';
import { Navigate, useNavigate } from 'react-router-dom';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function SearchResults({ foundUsers }) {
  // VARIABLE
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_NAVIGATE
  const navigate = useNavigate();

  // FUNCTION_HANDLER
  const handleOpenChatBox = (user_id) => {
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

  const handleRedirectToProfile = (user_id) => {
    navigate(`/contacts/${user_id}`);
  };

  return (
    <div className={cx('wrapper')}>
      {foundUsers.map((user) => (
        <AccountItem
          key={user.user_id}
          user_id={user.user_id}
          avatar={user.user_avatar}
          headerTitle={user.full_name}
          m_friends
          option={
            <>
              <IconBtn
                className={cx('message-option')}
                icon={<MessageDot width={'2.4rem'} height={'2.4rem'} />}
                medium
                onClick={() => {
                  handleOpenChatBox(user.user_id);
                }}
              />
              <IconBtn
                className={cx('see-profile-option')}
                icon={<UserIcon width={'2.4rem'} height={'2.4rem'} />}
                medium
                onClick={() => {
                  handleRedirectToProfile(user.user_id);
                }}
              />
            </>
          }
        />
      ))}
    </div>
  );
}

export default SearchResults;
