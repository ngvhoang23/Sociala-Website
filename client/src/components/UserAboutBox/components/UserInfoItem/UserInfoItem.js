import classNames from 'classnames/bind';
import styles from './UserInfoItem.module.scss';
import {
  EarthIcon,
  EditIcon,
  PlusIcon,
  ThreeDotIcon,
  TrashBinIcon,
  UserGroupIcon,
  XMarkIcon,
} from '~/components/Icons';
import { useRef, useState } from 'react';
import TippyWrapper from '~/components/TippyWrapper';
import IconBtn from '~/components/IconBtn';
import AddUserInfoItem from '../AddUserInfoItem';
import UserInfoForm from '../UserInfoForm/UserInfoForm';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';

const cx = classNames.bind(styles);

function UserInfoItem({
  name,
  value,
  info_description,
  icon,
  header_title,
  privacy_icon,
  options,
  editable,
  isOpenEditBox,
  setIsOpenEditBox,
  children,
  className,
}) {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  // USE_REF
  const menuRef = useRef();

  useOutsideAlerter(menuRef, () => {
    setIsOpenMenu(false);
  });

  return (
    <div className={cx('wrapper', { [className]: className })}>
      {header_title && (
        <div className={cx('header')}>
          <h4 className={cx('header-title')}>{header_title}</h4>
        </div>
      )}
      {!isOpenEditBox && (
        <div className={cx('container')}>
          <div className={cx('body')}>
            {icon && <div className={cx('info-icon')}>{icon}</div>}
            <div className={cx('content')}>
              <p className={cx('info-des')}>{info_description}</p>
            </div>
          </div>
          {options && (
            <div className={cx('footer')}>
              <div className={cx('privacy')}>{privacy_icon}</div>
              {options && (
                <div ref={menuRef} className={cx('option-container')}>
                  <button className={cx('options-btn')} onClick={() => setIsOpenMenu((prev) => !prev)}>
                    <ThreeDotIcon className={cx('operation-icon')} width={'2.2rem'} height={'2.2rem'} />
                  </button>
                  {isOpenMenu && (
                    <TippyWrapper className={cx('menu-options')} onClick={() => setIsOpenMenu(false)}>
                      {options.map((option, index) => {
                        return (
                          <IconBtn
                            key={index}
                            small
                            className={cx('option-item')}
                            icon={option.icon}
                            title={option.title}
                            onClick={() => {
                              option.onClick();
                            }}
                          />
                        );
                      })}
                      {editable && (
                        <IconBtn
                          small
                          icon={<EditIcon height="2rem" width="2rem" />}
                          className={cx('option-item')}
                          title={`Edit ${header_title}`}
                          onClick={() => setIsOpenEditBox(true)}
                        />
                      )}
                    </TippyWrapper>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {isOpenEditBox && editable && <div className={cx('edit-contaier')}>{children}</div>}
    </div>
  );
}

export default UserInfoItem;
