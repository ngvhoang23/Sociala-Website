import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import Cookies from 'universal-cookie';

import classNames from 'classnames/bind';
import styles from './SearchFriends.module.scss';

import AccountItem from '~/components/AccountItem';
import ContactsModal from '~/components/ContactsModal';
import { SearchUserValueProvider } from '~/pages/SearchFriends/SearchUserValueContext';
import { SearchBtnClickSignProvider } from '../../Context/SearchBtnClickSignContext';
import SearchResults from '~/components/SearchResults';
import { useNavigate } from 'react-router-dom';
import OptionItem from '~/components/OptionItem';
import { FriendsContext } from '~/Context/FriendsContext';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cookies = new Cookies();

const cx = classNames.bind(styles);

function SearchFriends({ children }) {
  // VARIABLE
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_CONTEXT
  const relationshipContext = useContext(FriendsContext);
  const relationship = relationshipContext.relationship;
  const setRelationship = relationshipContext.setRelationship;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);
  const [filter, setFilter] = useState('suggested_friends');

  //================= GET SUGGESTED USERS ==================

  // USE_EFFECT

  useEffect(() => {
    if (filter === 'suggested_friends') {
      const config = {
        headers: {
          Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
        },
      };

      axiosInstance
        .get(`/users/suggested-users/`, config)
        .then((result) => {
          const suggestedUsers = result.data.filter((suggestedUser) => suggestedUser.user_id != user.user_id);
          setContacts(suggestedUsers);
        })
        .catch((error) => {
          error = new Error();
        });
    } else if (filter === 'your_friends') {
      const config = {
        headers: {
          Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
        },
      };

      axiosInstance
        .get(`/users/friends`, config)
        .then((result) => {
          setContacts(result.data);
        })
        .catch((error) => {
          error = new Error();
        });
    } else if (filter === 'friend_requests') {
      const config = {
        headers: {
          Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
        },
      };

      axiosInstance
        .get(`/users/friends/friend-requests/${user.user_id}`, config)
        .then((result) => {
          setContacts(result.data);
        })
        .catch((error) => {
          error = new Error();
        });
    } else if (filter === 'sent_friend_requests') {
      const config = {
        headers: {
          Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
        },
      };

      axiosInstance
        .get(`/users/friends/sent-friend-requests/${user.user_id}`, config)
        .then((result) => {
          setContacts(result.data);
        })
        .catch((error) => {
          error = new Error();
        });
    }
  }, [filter]);

  // FUNCTION_HANDLER

  const handleSearch = () => {
    navigate('/contacts', { replace: true });

    const params = {
      searchValue,
    };
    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };
    axiosInstance
      .get(`/users/search-users/${searchValue}`, configurations)
      .then((result) => {
        setFoundUsers(result.data);
      })
      .catch((error) => {
        error = new Error();
      });
  };

  return (
    <SearchBtnClickSignProvider>
      <SearchUserValueProvider>
        <div className={cx('wrapper')}>
          <div className={cx('side-bar')}>
            <ContactsModal
              className={cx('contact-container')}
              headerTitle="Friends"
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onSearch={handleSearch}
              chatFilter
              filters={[
                {
                  title: 'Suggested Friends',
                  onClick: () => {
                    setFilter('suggested_friends');
                  },
                },
                {
                  title: 'Your Friends',
                  onClick: () => {
                    setFilter('your_friends');
                  },
                },

                {
                  title: 'Friend Requests',
                  onClick: () => {
                    setFilter('friend_requests');
                  },
                },

                {
                  title: 'Sent Friend Requests',
                  onClick: () => {
                    setFilter('sent_friend_requests');
                  },
                },
              ]}
              options={[{ title: 'New Chat' }, { title: 'Create Group' }, { title: 'Invite Others' }]}
              searchBar
            >
              {contacts.map((user) => (
                <AccountItem
                  key={user.user_id}
                  className={cx('account-item')}
                  user_id={user.user_id}
                  avatar={user.user_avatar}
                  headerTitle={user.full_name}
                  to={`/contacts/${user.user_id}`}
                  m_friends
                />
              ))}
            </ContactsModal>
          </div>
          <div className={cx('content')}>{children ? children : <SearchResults foundUsers={foundUsers} />}</div>
        </div>
      </SearchUserValueProvider>
    </SearchBtnClickSignProvider>
  );
}

export default SearchFriends;
