import classNames from 'classnames/bind';
import styles from './AboutTab.module.scss';
import UserAboutBox from '~/components/UserAboutBox/UserAboutBox';
import DetailAbout from '~/components/UserAboutBox/Tabs/MyDetailAbout/MyDetailAbout';
import DetailInfoBox from './components/DetailInfoBox/DetailInfoBox';
import { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

export const ProfileInfoContext = createContext();

function AboutTab() {
  // USE_PARAMS
  const { contact_id } = useParams();

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const [profileInfo, setProfileInfo] = useState();

  useEffect(() => {
    const params = {
      profile_id: contact_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/users/${contact_id}`, configurations)
      .then((result) => {
        const profile_package = result.data;
        setProfileInfo(profile_package.profile_info);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [contact_id]);

  return (
    <div className={cx('wrapper')}>
      <ProfileInfoContext.Provider value={{ profileInfo: profileInfo }}>
        {profileInfo && <DetailInfoBox profileInfo />}
      </ProfileInfoContext.Provider>

      <div className={cx('friends-container')}></div>
    </div>
  );
}

export default AboutTab;
