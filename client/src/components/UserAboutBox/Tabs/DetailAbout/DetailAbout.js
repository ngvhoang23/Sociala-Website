import classNames from 'classnames/bind';
import styles from './DetailAbout.module.scss';
import UserInfoWrapper from '../../components/UserInfoWrapper/UserInfoWrapper';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { EarthIcon, GlobalIcon, LockIcon, NameTagIcon, QuoteIcon, UserGroupIcon, XMarkIcon } from '~/components/Icons';
import Cookies from 'universal-cookie';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import { ProfileInfoContext } from '~/pages/Profile/Tabs/AboutTab/AboutTab';
import UserInfoItem from '../../components/UserInfoItem/UserInfoItem';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function DetailAbout() {
  const profileInfoContext = useContext(ProfileInfoContext);
  const profileInfo = profileInfoContext.profileInfo;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const privacies = {
    public: {
      code: 'public',
      icon: <EarthIcon className={cx('privacy-icon')} height="1.8rem" width="1.8rem" />,
      title: 'Public',
    },

    only_me: {
      code: 'only_me',
      icon: <LockIcon width="2rem" height="2rem" />,
      title: 'Only me',
    },

    friends: {
      code: 'friends',
      icon: <UserGroupIcon width="2rem" height="2rem" />,
      title: 'Friends',
    },
  };

  const [info, setInfo] = useState({
    detail_about: { content: profileInfo?.detail_about, privacy: privacies['public'] },
    another_name: { content: profileInfo?.another_name, privacy: privacies['public'] },
    favorite_quote: { content: profileInfo?.favorite_quote, privacy: privacies['public'] },
  });

  return (
    <div className={cx('wrapper')}>
      <UserInfoItem
        className={cx('user-info-item')}
        header_title={'About'}
        info_description={info.detail_about.content ? info.detail_about.content : 'No detail_about to show'}
      ></UserInfoItem>
      <UserInfoItem
        className={cx('user-info-item')}
        header_title={'Another name'}
        info_description={info.another_name.content ? info.another_name.content : 'No another_name to show'}
        icon={<NameTagIcon height="3rem" width="3rem" />}
      ></UserInfoItem>
      <UserInfoItem
        className={cx('user-info-item')}
        header_title={'Favorite quote'}
        info_description={info.favorite_quote.content ? info.favorite_quote.content : 'No favorite_quote to show'}
        icon={<QuoteIcon height="3rem" width="3rem" />}
      ></UserInfoItem>
    </div>
  );
}

export default DetailAbout;
