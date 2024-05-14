import classNames from 'classnames/bind';
import styles from './NotificationItem.module.scss';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { EllipsisIcon } from '~/components/Icons';
import TippyWrapper from '~/components/TippyWrapper';
import IconBtn from '~/components/IconBtn';

const cx = classNames.bind(styles);

function NotificationItem({
  noti_id,
  status,
  avatar,
  header_title,
  timeStamp,
  options,
  href,
  noti_code,
  className,
  is_read,
  description,
  onClick,
}) {
  // USE_STATE
  const [isOpenOptions, setIsOpenOptions] = useState(false);
  const [isOpenOptionBtn, setIsOpenOptionBtn] = useState(false);

  return (
    <a
      className={cx('wrapper', {
        [className]: className,
        is_read: is_read,
        un_read: !is_read,
      })}
      href={href}
      onClick={onClick}
      onMouseEnter={() => setIsOpenOptionBtn(true)}
      onMouseLeave={() => !isOpenOptions && setIsOpenOptionBtn(false)}
    >
      <div className={cx('container')}>
        <div className={cx('header')}>
          <img className={cx('account-avatar')} src={avatar} alt="account-avatar" />
          {status && <div className={cx('online-icon')}></div>}
        </div>
        <div className={cx('body')}>
          <div className={cx('account-name')}>
            {header_title && <p className={cx('account-name')}>{header_title}</p>}
            {timeStamp && <span className={cx('status')}>{timeStamp}</span>}
          </div>
          {description && <p className={cx('description')}>{description}</p>}
        </div>
        <div
          className={cx('footer')}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {!is_read && <div className={cx('un-read-point')}></div>}
        </div>
      </div>
      {options && isOpenOptionBtn && (
        <div className={cx('options-container')} onClick={(e) => e.stopPropagation()}>
          <button
            className={cx('open-options-btn')}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsOpenOptions((prev) => !prev);
            }}
          >
            <EllipsisIcon className={cx('operation-icon')} width={'2.2rem'} height={'2.2rem'} />
          </button>
          {isOpenOptions && (
            <div className={cx('options-content')}>
              <TippyWrapper
                className={cx('menu-options')}
                onClick={() => {
                  setIsOpenOptionBtn(false);
                  setIsOpenOptions(false);
                }}
              >
                {options.map((option, index) => {
                  return (
                    <IconBtn
                      key={index}
                      className={cx('option-item')}
                      icon={option.icon}
                      title={option.title}
                      medium
                      onClick={option.onClick}
                    />
                  );
                })}
              </TippyWrapper>
            </div>
          )}
        </div>
      )}
    </a>
  );
}

export default NotificationItem;
