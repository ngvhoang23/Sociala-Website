import classNames from 'classnames/bind';
import styles from './MyProfile.module.scss';
import { EditIcon, SingleUserPlus, ThreeDotIcon } from '~/components/Icons';
import { createContext, useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import PostsContainer from '~/components/PostsContainer';
import PostCreation from '~/components/PostCreation';
import MyPostContainer from '~/components/MyPostContainer';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import Cookies from 'universal-cookie';
import IconBtn from '~/components/IconBtn';
import { IsOpenEditProfileModalContext } from '~/Context/IsOpenEditProfileModalContext';

const cx = classNames.bind(styles);
const cookies = new Cookies();

export const FriendsContext = createContext();

function MyProfile({ children }) {
  // USE_NAVIGATE
  const navigate = useNavigate();

  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const isOpenEditProfileModalContext = useContext(IsOpenEditProfileModalContext);
  const isOpenEditProfileModal = isOpenEditProfileModalContext.isOpen;
  const setIsOpenEditProfileModal = isOpenEditProfileModalContext.setIsOpen;

  // USE_STATE
  const [tab, setTab] = useState(window.location.pathname.split('/')[2]);
  const [friends, setFriends] = useState([]);

  const [avatarDim, setAvatarDim] = useState();
  const [bgDim, setBgDim] = useState();

  // USE_EFFECT
  useEffect(() => {
    setTab(window.location.pathname.split('/')[2]);
  }, [window.location.pathname.split('/')[2]]);

  useEffect(() => {
    const params = { queried_user_id: user.user_id };

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
  const handleSwitchTab = (tab_code) => {
    setTab(tab_code);
    navigate(`/my-profile/${tab_code}`, { replace: true });
  };

  const getDemension = (src) => {
    let width, height;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function () {
        width = this.width;
        height = this.height;
        resolve({ width: width, height: height });
      };
      img.src = src;
    });
  };

  useEffect(() => {
    getDemension(user?.user_avatar).then((result) => {
      setAvatarDim(result);
    });

    getDemension(user?.background_image).then((result) => {
      setBgDim(result);
    });
  }, [user?.user_avatar, user?.background_image]);

  const renderImage = (i, src, width, height) => {
    let _width = width;
    let _height = height;

    let _width_ratio = i?.width / _width;
    let _height_ratio = i?.height / _height;

    let style;

    if (_width_ratio < _height_ratio) {
      style = {
        width: i?.width >= _width ? '100%' : 'auto',
        height: i?.height >= _height && i?.width < _width ? '100%' : 'auto',
      };
      if (i?.width < _width) {
        if (i?.height >= _height) {
          style = {
            height: i?.height >= _height ? '100%' : 'auto',
            width: i?.width >= _width && i?.height < _height ? '100%' : 'auto',
          };
        }
      }
    } else {
      style = {
        height: i?.height >= _height ? '100%' : 'auto',
        width: i?.width >= _width && i?.height < _height ? '100%' : 'auto',
      };
      if (i?.height < _height) {
        if (i?.width >= _width) {
          style = {
            width: i?.width >= _width ? '100%' : 'auto',
            height: i?.height >= _height && i?.width < _width ? '100%' : 'auto',
          };
        }
      }
    }

    return <img src={src} style={{ ...style }} />;
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <div className={cx('header')}>
          <div className={cx('background-image')}>{renderImage(bgDim, user?.background_image, 982, 200)}</div>
          <div className={cx('user-container')}>
            <div className={cx('user-info')}>
              <div className={cx('user-avatar')}>{renderImage(avatarDim, user?.user_avatar, 200, 200)}</div>
              <div className={cx('user-title')}>
                <h3 className={cx('user-name')}>{user?.full_name}</h3>
                <p className={cx('friend-quantity')}>{friends?.length} friends</p>
              </div>
            </div>
            <div className={cx('operations')}>
              <IconBtn
                className={cx('profile-option', 'confirm-btn')}
                icon={<EditIcon height="2.4rem" width="2.4rem" />}
                title="Edit profile"
                medium
                onClick={() => setIsOpenEditProfileModal(true)}
              />
            </div>
          </div>

          <div className={cx('navigations')}>
            <div
              className={cx('navigation-item', { ['navigation-item-active']: tab == 'posts' })}
              onClick={() => handleSwitchTab('posts')}
            >
              Posts
            </div>

            <div
              className={cx('navigation-item', { ['navigation-item-active']: tab == 'about' })}
              onClick={() => handleSwitchTab('about')}
            >
              About
            </div>

            <div
              className={cx('navigation-item', { ['navigation-item-active']: tab == 'photos' })}
              onClick={() => handleSwitchTab('photos')}
            >
              Photos
            </div>
            <div
              className={cx('navigation-item', { ['navigation-item-active']: tab == 'friends' })}
              onClick={() => handleSwitchTab('friends')}
            >
              Friends
            </div>
          </div>
        </div>
        <FriendsContext.Provider value={{ friends }}>
          <div className={cx('body')}>{children}</div>
        </FriendsContext.Provider>
      </div>
    </div>
  );
}

export default MyProfile;
