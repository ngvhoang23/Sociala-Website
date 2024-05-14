import classNames from 'classnames/bind';
import styles from './OnlineContactItem.module.scss';
import moment from 'moment';
import { EditIcon, EllipsisIcon, XMarkIcon } from '../Icons';
import { useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import TippyWrapper from '../TippyWrapper';
import IconBtn from '../IconBtn';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';
import MediaItem2 from '../MediaItem2/MediaItem2';

const cx = classNames.bind(styles);

function OnlineContactItem({
  des_timestamp,
  description,
  contact_name,
  contact_avatar,
  online_info,
  options,
  onClick,
  className,
  large,
  active,
  avatar_border,
  medium,
  unread,
  operation,
  onOpenProfile,
  onClickDescription,
  avatar_width,
  avatar_height,
}) {
  // USE_STATE
  const [isOpenOptions, setIsOpenOptions] = useState(false);
  const [isOpenOptionBtn, setIsOpenOptionBtn] = useState(false);

  // USE_REF
  const optionsRef = useRef();

  // USE_CLICKING_OUT_SIDE
  useOutsideAlerter(optionsRef, () => {
    setIsOpenOptions(false);
    setIsOpenOptionBtn(false);
  });

  return (
    <div
      className={cx(
        'wrapper',
        { large: large },
        { [className]: className },
        { unread: active },
        { 'avatar-border': avatar_border },
      )}
      onClick={onClick}
      onMouseEnter={() => setIsOpenOptionBtn(true)}
      onMouseLeave={() => !isOpenOptions && setIsOpenOptionBtn(false)}
    >
      <div className={cx('container')}>
        <div className={cx('contact-info')}>
          <MediaItem2
            item={{ url: contact_avatar, type: 'image' }}
            width={avatar_width}
            height={avatar_height}
            border_radius={1000}
            _styles={
              {
                // boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
              }
            }
            onClick={onOpenProfile}
            className={cx('contact-avatar')}
          />
          <div className={cx('')}>
            <p className={cx('contact-name')} onClick={onOpenProfile}>
              {contact_name}
            </p>
            {description && (
              <div className={cx('description')}>
                <p className={cx('description-text', { unread: unread })} onClick={onClickDescription}>
                  {description}
                </p>
                {des_timestamp && (
                  <span className={cx('time-stamp')}>
                    <span className={cx('middle-dot')}></span>
                    {moment(des_timestamp).fromNow().replace(' ago', '')}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        {online_info?.status && <div className={cx('online-dot')}></div>}
        {unread ? <div className={cx('online-dot')}></div> : <></>}
        {online_info?.timestamp && <div className={cx('offline-time')}>{moment(online_info?.timestamp).fromNow()}</div>}
        {operation && operation}
      </div>
      {options && isOpenOptionBtn && (
        <div className={cx('options-container')} onClick={(e) => e.stopPropagation()}>
          <button className={cx('open-options-btn')} onClick={() => setIsOpenOptions((prev) => !prev)}>
            <EllipsisIcon className={cx('operation-icon')} width={'2.2rem'} height={'2.2rem'} />
          </button>
          {isOpenOptions && (
            <div ref={optionsRef} className={cx('options-content')}>
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
                      className={cx(
                        'option-item',
                        { 'option-item-medium': medium },
                        { 'option-item-red': option.color == 'red' },
                      )}
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
    </div>
  );
}

export default OnlineContactItem;
