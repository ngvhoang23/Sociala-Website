import classNames from 'classnames/bind';
import styles from './Overview.module.scss';
import Cookies from 'universal-cookie';
import { useContext, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import {
  EarthIcon,
  EducationIcon,
  LocationIcon,
  LockIcon,
  NameTagIcon,
  SuitcaseIcon,
  UserGroupIcon,
  XMarkIcon,
} from '~/components/Icons';
import UserInfoWrapper from '../../components/UserInfoWrapper/UserInfoWrapper';
import { ProfileInfoContext } from '~/pages/Profile/Tabs/AboutTab/AboutTab';
import UserInfoItem from '../../components/UserInfoItem/UserInfoItem';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function Overview() {
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
    workplace: { content: profileInfo?.workplace, privacy: privacies['public'] },
    education: { content: profileInfo?.education, privacy: privacies['public'] },
    address: { content: profileInfo?.address, privacy: privacies['public'] },
  });

  return (
    <div className={cx('wrapper')}>
      <UserInfoItem
        className={cx('user-info-item')}
        header_title={'Workplace'}
        info_description={info.workplace.content ? info.workplace.content : 'No workplace to show'}
        icon={<SuitcaseIcon height="3rem" width="3rem" />}
      ></UserInfoItem>
      <UserInfoItem
        className={cx('user-info-item')}
        header_title={'Education'}
        info_description={info.education.content ? info.education.content : 'No education to show'}
        icon={<EducationIcon height="3rem" width="3rem" />}
      ></UserInfoItem>
      <UserInfoItem
        className={cx('user-info-item')}
        header_title={'Address'}
        info_description={info.address.content ? info.address.content : 'No address to show'}
        icon={<LocationIcon height="3rem" width="3rem" />}
      ></UserInfoItem>
    </div>
  );
}

export default Overview;
