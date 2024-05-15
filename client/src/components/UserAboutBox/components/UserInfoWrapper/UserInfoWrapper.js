import classNames from 'classnames/bind';
import styles from './UserInfoWrapper.module.scss';
import UserInfoForm from '../UserInfoForm/UserInfoForm';
import AddUserInfoItem from '../AddUserInfoItem';
import UserInfoItem from '../UserInfoItem/UserInfoItem';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function UserInfoWrapper({
  info_code,
  header_title,
  info_description,
  info_icon,
  privacy,
  options,
  setPrivacy,
  privacies,
  fields,
  add_btn_title,
  className,
  onSubmit,
}) {
  const [isOpenEditBox, setIsOpenEditBox] = useState(false);

  return (
    <div className={cx('wrapper', { [className]: className })}>
      {info_description ? (
        <UserInfoItem
          className={cx('user-info-item')}
          header_title={header_title}
          info_description={info_description}
          icon={info_icon}
          privacy_icon={privacy?.icon}
          options={options}
          setIsOpenEditBox={setIsOpenEditBox}
          isOpenEditBox={isOpenEditBox}
          editable
        >
          <UserInfoForm
            setPrivacy={setPrivacy}
            selected_privacy={privacy}
            privacies={privacies}
            fields={fields}
            onSubmit={onSubmit}
            onClose={() => setIsOpenEditBox(false)}
            info_code={info_code}
          />
        </UserInfoItem>
      ) : (
        <AddUserInfoItem
          header_title={header_title}
          title={add_btn_title}
          setIsOpenEditBox={setIsOpenEditBox}
          isOpenEditBox={isOpenEditBox}
        >
          <UserInfoForm
            setPrivacy={setPrivacy}
            selected_privacy={privacy}
            privacies={privacies}
            fields={fields}
            onSubmit={onSubmit}
            onClose={() => setIsOpenEditBox(false)}
            info_code={info_code}
          />
        </AddUserInfoItem>
      )}
    </div>
  );
}

export default UserInfoWrapper;
