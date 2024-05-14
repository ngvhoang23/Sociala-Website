import classNames from 'classnames/bind';
import styles from './PostsTab.module.scss';
import PostCreation from '~/components/PostCreation';
import MyPostContainer from '~/components/MyPostContainer';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import PostGeneratorLable from '~/components/PostGeneratorLable';
import { CurrentMediaPreviewContext } from '~/Context/CurrentMediaPreviewContext';
import { IsOpenPostGeneratorContext } from '~/Context/IsOpenPostGeneratorContext';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import { ProfileInfoContext } from '../../Profile';
import FriendItem from '../../../Contacts/components/FriendItem/FriendItem';
import UserInfoItem from '~/components/UserAboutBox/components/UserInfoItem/UserInfoItem';
import { GlobalIcon, GmailIcon, PhoneIcon, SuitcaseIcon } from '~/components/Icons';
import { render } from '@testing-library/react';
import MediaItem2 from '~/components/MediaItem2/MediaItem2';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function PostsTab() {
  // CONSTANCE
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_PARAMS
  const { contact_id } = useParams();

  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_CONTEXT
  const profileInfoContext = useContext(ProfileInfoContext);
  const profileInfo = profileInfoContext.profileInfo;

  const currentMediaPreviewContext = useContext(CurrentMediaPreviewContext);
  const currentMediaPreview = currentMediaPreviewContext.currentMediaPreview;
  const setCurrentMediaPreview = currentMediaPreviewContext.setCurrentMediaPreview;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE
  const [photos, setPhotos] = useState([]);

  // USE_EFFECT
  useEffect(() => {
    const params = {
      queried_user_id: contact_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/posts/photos/${contact_id}`, configurations)
      .then((result) => {
        setPhotos(result.data);
      })
      .catch((error) => {
        error = new Error();
      });
  }, [contact_id]);

  // FUNCTION_HANDLER

  const handleRedirectToPhotos = () => {
    navigate(`/profiles/${contact_id}/photos`, { replace: true });
  };

  const handleRedirectToProfile = (profile_id) => {
    if (profile_id == user.user_id) {
      navigate(`/my-profile/posts`, { replace: true });
    } else {
      navigate(`/profiles/${profile_id}/posts`, { replace: true });
    }
  };

  const renderIntro = () => {
    const Intro = [];
    const { workplace, website, phone_num, email_address } = profileInfo;
    if (workplace) {
      Intro.push(
        <UserInfoItem
          no_header
          key={'workplace'}
          className={cx('user-info-item')}
          info_description={`Work at ${workplace}`}
          icon={<SuitcaseIcon height="2.8rem" width="2.8rem" />}
        ></UserInfoItem>,
      );
    }
    if (website) {
      Intro.push(
        <UserInfoItem
          no_header
          key={'website'}
          className={cx('user-info-item')}
          info_description={website}
          icon={<GlobalIcon height="2.8rem" width="2.8rem" />}
        ></UserInfoItem>,
      );
    }
    if (phone_num) {
      Intro.push(
        <UserInfoItem
          no_header
          key={'phone_num'}
          className={cx('user-info-item')}
          info_description={phone_num}
          icon={<PhoneIcon height="2.8rem" width="2.8rem" />}
        ></UserInfoItem>,
      );
    }
    if (email_address) {
      Intro.push(
        <UserInfoItem
          no_header
          key={'email_address'}
          className={cx('user-info-item')}
          info_description={email_address}
          icon={<GmailIcon height="2.8rem" width="2.8rem" />}
        ></UserInfoItem>,
      );
    }
    return Intro;
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('sub-info')}>
        <div className={cx('sub-info-item')}>
          <h3 className={cx('sub-info-item-header')}>Intro</h3>
          {renderIntro()}
        </div>

        <div className={cx('sub-info-item')}>
          <div className={cx('sub-info-item-header')}>
            <h3 className={cx('sub-info-item-header-title')}>Photos</h3>
            <button className={cx('see-all-photos-btn')}>See all photos</button>
          </div>
          <div className={cx('sub-info-item-content', 'photos-container')}>
            {photos.slice(0, 4).map((photo, index) => {
              return (
                <MediaItem2
                  key={photo.file_id}
                  item={{ url: photo.file_url, type: 'image' }}
                  width={198}
                  height={198}
                  border_radius={10}
                  className={cx('photo-item')}
                  onClick={() => setCurrentMediaPreview({ post_id: photo.post_id, media_id: photo.file_id })}
                />
              );
            })}
          </div>
        </div>
        <div className={cx('sub-info-item')}>
          <div className={cx('sub-info-item-header')}>
            <h3 className={cx('sub-info-item-header-title')}>Friends</h3>
            <button className={cx('see-all-photos-btn')}>See all friends</button>
          </div>
          <div className={cx('sub-info-item-content', 'friends-container')}>
            {profileInfo?.friends?.slice(0, 9)?.map((friend) => {
              return (
                <FriendItem
                  key={friend.friend_id}
                  className={cx('friend-item')}
                  friend_name={friend.full_name}
                  friend_avatar={friend.user_avatar}
                  friend_id={friend.user_id}
                  no_options
                  small
                  onClick={() => handleRedirectToProfile(friend.friend_id)}
                  width={122}
                  height={122}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className={cx('post-container')}>
        <MyPostContainer profile_id={contact_id} className={cx('post-list')} />
      </div>
    </div>
  );
}

export default PostsTab;
