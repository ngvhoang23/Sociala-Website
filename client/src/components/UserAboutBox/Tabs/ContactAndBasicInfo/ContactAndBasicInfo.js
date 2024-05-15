import classNames from 'classnames/bind';
import styles from './ContactAndBasicInfo.module.scss';
import AddUserInfoItem from '../../components/AddUserInfoItem';
import UserInfoForm from '../../components/UserInfoForm/UserInfoForm';
import { useContext, useEffect, useState } from 'react';
import {
  EarthIcon,
  EditIcon,
  GlobalIcon,
  GmailIcon,
  LockIcon,
  PhoneIcon,
  UserGroupIcon,
  XMarkIcon,
} from '~/components/Icons';
import Cookies from 'universal-cookie';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import UserInfoItem from '../../components/UserInfoItem/UserInfoItem';
import UserInfoWrapper from '../../components/UserInfoWrapper/UserInfoWrapper';
import { ProfileInfoContext } from '~/pages/Profile/Tabs/AboutTab/AboutTab';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function ContactAndBasicInfo({ profile_id }) {
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
    website: { content: profileInfo?.website, privacy: privacies['public'] },
    email: { content: profileInfo?.email_address, privacy: privacies['public'] },
    phone_num: { content: profileInfo?.phone_num, privacy: privacies['public'] },
  });

  return (
    <div className={cx('wrapper')}>
      <UserInfoItem
        className={cx('user-info-item')}
        header_title={'Workplace'}
        info_description={info.website.content ? info.website.content : 'No website to show'}
        icon={<GlobalIcon height="3rem" width="3rem" />}
      ></UserInfoItem>
      <UserInfoItem
        className={cx('user-info-item')}
        header_title={'Education'}
        info_description={info.email.content ? info.email.content : 'No email to show'}
        icon={<GmailIcon height="3rem" width="3rem" />}
      ></UserInfoItem>
      <UserInfoItem
        className={cx('user-info-item')}
        header_title={'Address'}
        info_description={info.phone_num.content ? info.phone_num.content : 'No phone number to show'}
        icon={<PhoneIcon height="3rem" width="3rem" />}
      ></UserInfoItem>
    </div>
  );
}

export default ContactAndBasicInfo;
