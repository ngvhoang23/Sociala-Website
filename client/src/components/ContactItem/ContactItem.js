import { memo, useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { NavLink } from 'react-router-dom';
import styles from './ContactItem.module.scss';
import classNames from 'classnames/bind';
import Cookies from 'universal-cookie';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import MediaItem2 from '../MediaItem2/MediaItem2';

// Component

const cx = classNames.bind(styles);
const cookies = new Cookies();

function ContactItem({
  isOnline,
  contactName,
  contactAvatar,
  type,
  author_name,
  isSeen,
  room_id,
  created_at,
  message,
  onClick,
}) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_STATE

  const lastedMessage = () => {
    if (type === 'document') {
      return `${author_name} sent an attachment`;
    } else if (type === 'image') {
      return `${author_name} sent an image`;
    } else if (type === 'video') {
      return `${author_name} sent a video`;
    } else {
      return message;
    }
  };

  return (
    <NavLink
      className={(nav) => cx('wrapper', { active: nav.isActive }, { isSeen: !isSeen })}
      to={`/messenger/${room_id}`}
      onClick={onClick}
    >
      <div className={cx('account-avatar-container')}>
        {/* <img className={cx('account-avatar')} src={contactAvatar} alt="account img" /> */}
        <MediaItem2
          item={{ url: contactAvatar, type: 'image' }}
          width={48}
          height={48}
          border_radius={1000}
          _styles={
            {
              // boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
            }
          }
          className={cx('account-avatar')}
        />
        {isOnline ? <div className={cx('online-icon')}></div> : <></>}
      </div>
      <div className={cx('contact-info')}>
        <div>
          <p className={cx('account-name')}>{contactName}</p>
          <span className={cx('time-stamp-message')}>{created_at ? moment(created_at).fromNow() : ''}</span>
        </div>
        <p className={cx('lasted-message')}>{lastedMessage()}</p>
      </div>
      {!isSeen && <div className={cx('un-read-state')}></div>}
    </NavLink>
  );
}

export default memo(ContactItem);
