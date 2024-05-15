import classNames from 'classnames/bind';
import styles from './MyContactAndBasicInfo.module.scss';
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

const cx = classNames.bind(styles);
const cookies = new Cookies();

function ContactAndBasicInfo() {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;
  const user_privacy = userInfoContext.user_privacy;

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
    website: { content: user.website, privacy: privacies[user_privacy.website] },
    phone_num: { content: user.phone_num, privacy: privacies[user_privacy.phone_num] },
    email: { content: user.email_address, privacy: privacies[user_privacy.email_address] },
    gender: { content: user.gender, privacy: privacies[user_privacy.gender] },
    birth_date: { content: user.birth_date, privacy: privacies[user_privacy.birth_date] },
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
        info_code="website"
        add_btn_title={'Add an website'}
        header_title={'Website'}
        info_description={user?.website}
        info_icon={<GlobalIcon width="2.6rem" height="2.6rem" />}
        privacy={info.website.privacy}
        options={[
          {
            icon: <XMarkIcon height="2rem" width="2rem" />,
            title: 'Delete website',
            onClick: () => handleDeleteInfoItem('website'),
          },
        ]}
        setPrivacy={setPrivacy}
        selected_privacy={info.website.privacy}
        privacies={privacies}
        fields={[
          {
            name: 'website',
            value: info.website.content,
            setValue: setInfoItem,
            title: 'Website Address',
            placeholder: 'Website Address...',
            type: 'text',
            input_type: 'input',
          },
        ]}
        setValue={setInfoItem}
        onSubmit={() =>
          handleSubmit({ website: { content: info.website.content, privacy: info.website.privacy.code } })
        }
      />

      <UserInfoWrapper
        className={cx('user-info-wrapper')}
        info_code="email"
        add_btn_title={'Add an email'}
        header_title={'Email'}
        info_description={user?.email_address}
        info_icon={<GmailIcon width="2.6rem" height="2.6rem" />}
        privacy={info.email.privacy}
        options={[
          {
            icon: <XMarkIcon height="2rem" width="2rem" />,
            title: 'Delete email',
            onClick: () => handleDeleteInfoItem('email_address'),
          },
        ]}
        setPrivacy={setPrivacy}
        selected_privacy={info.email.privacy}
        privacies={privacies}
        fields={[
          {
            name: 'email',
            value: info.email.content,
            setValue: setInfoItem,
            title: 'Email Address',
            placeholder: 'Email Address...',
            type: 'text',
            input_type: 'input',
          },
        ]}
        setValue={setInfoItem}
        onSubmit={() =>
          handleSubmit({ email_address: { content: info.email.content, privacy: info.email.privacy.code } })
        }
      />

      <UserInfoWrapper
        className={cx('user-info-wrapper')}
        info_code="phone_num"
        add_btn_title={'Add a phone number'}
        header_title={'Mobile Phone'}
        info_description={user?.phone_num}
        info_icon={<PhoneIcon width="2.6rem" height="2.6rem" />}
        privacy={info.phone_num.privacy}
        options={[
          {
            icon: <XMarkIcon height="2rem" width="2rem" />,
            title: 'Delete phone number',
            onClick: () => handleDeleteInfoItem('phone_num'),
          },
        ]}
        setPrivacy={setPrivacy}
        selected_privacy={info.phone_num.privacy}
        privacies={privacies}
        fields={[
          {
            name: 'phone_num',
            value: info.phone_num.content,
            setValue: setInfoItem,
            title: 'Phone Number',
            placeholder: 'Phone number...',
            type: 'text',
            input_type: 'input',
          },
        ]}
        setValue={setInfoItem}
        onSubmit={() =>
          handleSubmit({ phone_num: { content: info.phone_num.content, privacy: info.phone_num.privacy.code } })
        }
      />
    </div>
  );
}

export default ContactAndBasicInfo;
