import classNames from 'classnames/bind';
import styles from './MyDetailAbout.module.scss';
import UserInfoWrapper from '../../components/UserInfoWrapper/UserInfoWrapper';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { EarthIcon, GlobalIcon, LockIcon, NameTagIcon, QuoteIcon, UserGroupIcon, XMarkIcon } from '~/components/Icons';
import Cookies from 'universal-cookie';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function DetailAbout() {
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
    detail_about: { content: user.detail_about, privacy: privacies[user_privacy.detail_about] },
    another_name: { content: user.another_name, privacy: privacies[user_privacy.another_name] },
    favorite_quote: { content: user.favorite_quote, privacy: privacies[user_privacy.favorite_quote] },
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
        info_code="detail_about"
        add_btn_title={'Add detail about you'}
        header_title={`About`}
        info_description={user?.detail_about}
        privacy={info.detail_about.privacy}
        options={[
          {
            icon: <XMarkIcon height="2rem" width="2rem" />,
            title: 'Delete about',
            onClick: () => handleDeleteInfoItem('detail_about'),
          },
        ]}
        setPrivacy={setPrivacy}
        selected_privacy={info.detail_about.privacy}
        privacies={privacies}
        fields={[
          {
            name: 'detail_about',
            value: info.detail_about.content,
            setValue: setInfoItem,
            title: `About ${user?.full_name}`,
            placeholder: `About ${user?.full_name}...`,
            type: 'text',
            input_type: 'text_area',
            maximum_characters: 355,
          },
        ]}
        setValue={setInfoItem}
        onSubmit={() =>
          handleSubmit({
            detail_about: { content: info.detail_about.content, privacy: info.detail_about.privacy.code },
          })
        }
      />

      <UserInfoWrapper
        className={cx('user-info-wrapper')}
        info_code="another_name"
        add_btn_title={'Add another name'}
        header_title={`Another name`}
        info_icon={<NameTagIcon width="3rem" height="3rem" />}
        info_description={user?.another_name}
        privacy={info.another_name.privacy}
        options={[
          {
            icon: <XMarkIcon height="2rem" width="2rem" />,
            title: 'Delete another name',
            onClick: () => handleDeleteInfoItem('another_name'),
          },
        ]}
        setPrivacy={setPrivacy}
        selected_privacy={info.another_name.privacy}
        privacies={privacies}
        fields={[
          {
            name: 'another_name',
            value: info.another_name.content,
            setValue: setInfoItem,
            title: `Another name`,
            placeholder: `Another name...`,
            type: 'text',
            input_type: 'input',
          },
        ]}
        setValue={setInfoItem}
        onSubmit={() =>
          handleSubmit({
            another_name: { content: info.another_name.content, privacy: info.another_name.privacy.code },
          })
        }
      />

      <UserInfoWrapper
        className={cx('user-info-wrapper')}
        info_code="favorite_quote"
        add_btn_title={'Add a favorite quote'}
        header_title={`Favorite quote`}
        info_icon={<QuoteIcon width="3rem" height="3rem" />}
        info_description={user?.favorite_quote}
        privacy={info.favorite_quote.privacy}
        options={[
          {
            icon: <XMarkIcon height="2rem" width="2rem" />,
            title: 'Delete favorite quote',
            onClick: () => handleDeleteInfoItem('favorite_quote'),
          },
        ]}
        setPrivacy={setPrivacy}
        selected_privacy={info.favorite_quote.privacy}
        privacies={privacies}
        fields={[
          {
            name: 'favorite_quote',
            value: info.favorite_quote.content,
            setValue: setInfoItem,
            title: `Favorite quote`,
            placeholder: `Favorite quote...`,
            type: 'text',
            input_type: 'input',
          },
        ]}
        setValue={setInfoItem}
        onSubmit={() =>
          handleSubmit({
            favorite_quote: { content: info.favorite_quote.content, privacy: info.favorite_quote.privacy.code },
          })
        }
      />
    </div>
  );
}

export default DetailAbout;
