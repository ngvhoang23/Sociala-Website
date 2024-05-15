import classNames from 'classnames/bind';
import styles from './MyOverview.module.scss';
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

const cx = classNames.bind(styles);
const cookies = new Cookies();

function Overview() {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;
  const user_privacy = userInfoContext.user_privacy;

  console.log(user, user_privacy);

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
    workplace: { content: user.workplace, privacy: privacies[user_privacy.workplace] },
    education: { content: user.education, privacy: privacies[user_privacy.education] },
    address: { content: user.address, privacy: privacies[user_privacy.address] },
  });

  const setInfoItem = ({ name, value }) => {
    const newInfo = {
      ...info,
      [name]: { ...info[name], content: value },
    };

    setInfo(newInfo);
  };

  const setPrivacy = (name, privacy) => {
    setInfo((prev) => {
      return {
        ...prev,
        [name]: { ...prev[name], privacy: privacy },
      };
    });
  };

  const handleSubmit = (payload) => {
    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .put(`/users/user-info/contact-and-basic-info/${user.user_id}`, payload, configurations)
      .then((result) => {
        window.location.reload(false);
      })
      .catch((error) => {
        console.log('error:', error);
      });
  };

  const handleDeleteInfoItem = (info_code) => {
    const configurations = {
      data: {
        fields: [info_code],
      },
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .delete(`/users/user-info/contact-and-basic-info/${user.user_id}`, configurations)
      .then((result) => {
        window.location.reload(false);
      })
      .catch((error) => {
        console.log('error:', error);
      });
  };

  return (
    <div className={cx('wrapper')}>
      <UserInfoWrapper
        className={cx('user-info-wrapper')}
        info_code="workplace"
        add_btn_title={'Add a workplace'}
        header_title={`Workplace`}
        info_icon={<SuitcaseIcon width="3rem" height="3rem" />}
        info_description={user?.workplace}
        privacy={info.workplace.privacy}
        options={[
          {
            icon: <XMarkIcon height="2rem" width="2rem" />,
            title: 'Delete workplace',
            onClick: () => handleDeleteInfoItem('workplace'),
          },
        ]}
        setPrivacy={setPrivacy}
        selected_privacy={info.workplace.privacy}
        privacies={privacies}
        fields={[
          {
            name: 'workplace',
            value: info.workplace.content,
            setValue: setInfoItem,
            title: `Workplace`,
            placeholder: `Workplace...`,
            type: 'text',
            input_type: 'input',
          },
        ]}
        setValue={setInfoItem}
        onSubmit={() =>
          handleSubmit({
            workplace: { content: info.workplace.content, privacy: info.workplace.privacy.code },
          })
        }
      />

      <UserInfoWrapper
        className={cx('user-info-wrapper')}
        info_code="education"
        add_btn_title={'Add education'}
        header_title={`Education`}
        info_icon={<EducationIcon width="3rem" height="3rem" />}
        info_description={user?.education ? `Went to ${user?.education}` : null}
        privacy={info.education.privacy}
        options={[
          {
            icon: <XMarkIcon height="2rem" width="2rem" />,
            title: 'Delete education',
            onClick: () => handleDeleteInfoItem('education'),
          },
        ]}
        setPrivacy={setPrivacy}
        selected_privacy={info.education.privacy}
        privacies={privacies}
        fields={[
          {
            name: 'education',
            value: info.education.content,
            setValue: setInfoItem,
            title: `Education`,
            placeholder: `Education...`,
            type: 'text',
            input_type: 'input',
          },
        ]}
        setValue={setInfoItem}
        onSubmit={() =>
          handleSubmit({
            education: { content: info.education.content, privacy: info.education.privacy.code },
          })
        }
      />

      <UserInfoWrapper
        className={cx('user-info-wrapper')}
        info_code="address"
        add_btn_title={'Add a address'}
        header_title={`Address`}
        info_icon={<LocationIcon width="2.8rem" height="2.8rem" />}
        info_description={user?.address ? `From ${user?.address}` : null}
        privacy={info.address.privacy}
        options={[
          {
            icon: <XMarkIcon height="2rem" width="2rem" />,
            title: 'Delete address',
            onClick: () => handleDeleteInfoItem('address'),
          },
        ]}
        setPrivacy={setPrivacy}
        selected_privacy={info.address.privacy}
        privacies={privacies}
        fields={[
          {
            name: 'address',
            value: info.address.content,
            setValue: setInfoItem,
            title: `Address`,
            placeholder: `Address...`,
            type: 'text',
            input_type: 'input',
          },
        ]}
        setValue={setInfoItem}
        onSubmit={() =>
          handleSubmit({
            address: { content: info.address.content, privacy: info.address.privacy.code },
          })
        }
      />
    </div>
  );
}

export default Overview;
