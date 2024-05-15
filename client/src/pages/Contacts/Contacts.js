import classNames from 'classnames/bind';
import styles from './Contacts.module.scss';
import {
  CoupleUserIcon,
  GearIcon,
  SearchIcon,
  SingleUserPlus,
  ThreeDotIcon,
  UserCheck,
  UserGroupIcon,
  UserMinus,
  UserPlus,
  UserXMark,
} from '~/components/Icons';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import AllFriendsTab from './Tabs/AllFriendsTab/AllFriendsTab';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function Contacts({ children }) {
  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_CONTEXT
  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE
  const [tab, setTab] = useState(window.location.pathname.split('/')[2]);
  const [searchValue, setSearchValue] = useState('');

  // USE_EFFECT
  useEffect(() => {
    setTab(window.location.pathname.split('/')[2]);
  }, [window.location.pathname.split('/')[2]]);

  // FUNCTION_HANDLER
  const handleSwitchTab = (tab_code) => {
    setTab(tab_code);
    navigate(`/contacts/${tab_code}`, { replace: true });
  };

  const handleKey = (e) => {
    if (e.code === 'Enter' && e.getModifierState('Composition')) {
      e.preventDefault(); // Ngăn chặn sự kiện Enter thừa
    }
    if (e.code === 'Enter') {
      handleOpenSearchBox();
    }
  };

  const handleOpenSearchBox = () => {
    navigate(`/contacts/searching/${searchValue}`, { replace: true });
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('side-bar')}>
        <div className={cx('side-bar-header')}>
          <h3 className={cx('header-title')}>Contacts</h3>
          <div className={cx('search-bar')}>
            <input
              className={cx('search-inp')}
              spellCheck={false}
              value={searchValue}
              placeholder="Search friends"
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKey}
            />
            <span className={cx('search-icon')} onClick={handleOpenSearchBox}>
              <SearchIcon width="2.4rem" height="2.4rem" />
            </span>
          </div>
        </div>
        <div className={cx('navs-container')}>
          <div
            className={cx('nav-item', { 'nav-item-active': tab == 'all-friends' })}
            onClick={() => {
              setTab('all-friends');
              handleSwitchTab('all-friends');
            }}
          >
            <div className={cx('nav-item-icon')}>
              <SingleUserPlus className={cx('ellipsis-icon')} width={'2.6rem'} height={'2.6rem'} />
            </div>
            <h4 className={cx('nav-item-title')}>All Friends</h4>
          </div>

          <div
            className={cx('nav-item', { 'nav-item-active': tab == 'friend-requests' })}
            onClick={() => {
              setTab('friend-requests');
              handleSwitchTab('friend-requests');
            }}
          >
            <div className={cx('nav-item-icon')}>
              <UserPlus className={cx('ellipsis-icon')} width={'2.6rem'} height={'2.6rem'} />
            </div>
            <h4 className={cx('nav-item-title')}>Friend Requests</h4>
          </div>

          <div
            className={cx('nav-item', { 'nav-item-active': tab == 'sent-friend-requests' })}
            onClick={() => {
              setTab('sent-friend-requests');
              handleSwitchTab('sent-friend-requests');
            }}
          >
            <div className={cx('nav-item-icon')}>
              <UserPlus className={cx('ellipsis-icon')} width={'2.6rem'} height={'2.6rem'} />
            </div>
            <h4 className={cx('nav-item-title')}>Sent Friend Requests</h4>
          </div>

          <div
            className={cx('nav-item', { 'nav-item-active': tab == 'suggestions' })}
            onClick={() => {
              setTab('suggestions');
              handleSwitchTab('suggestions');
            }}
          >
            <div className={cx('nav-item-icon')}>
              <UserGroupIcon className={cx('ellipsis-icon')} width={'2.6rem'} height={'2.6rem'} />
            </div>
            <h4 className={cx('nav-item-title')}>Suggestions</h4>
          </div>
        </div>
      </div>
      <div className={cx('content')}>{children}</div>
    </div>
  );
}

export default Contacts;
