import styles from './MainNavigation.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const cx = classNames.bind(styles);

function Option({ icon, to, bottom, noti_tag, active, className, onClick }) {
  return to ? (
    <NavLink
      className={(nav) => cx('option-wrapper', { active: nav.isActive, [className]: className })}
      to={to}
      onClick={onClick}
    >
      <span className={cx('option-icon')}>{icon}</span>
      {noti_tag ? <div className={cx('noti_tag')}>{noti_tag}</div> : null}
    </NavLink>
  ) : (
    <div className={cx('option-wrapper', { active: active, [className]: className })} onClick={onClick}>
      <span className={cx('option-icon')}>{icon}</span>
      {noti_tag ? <div className={cx('noti_tag')}>{noti_tag}</div> : null}
    </div>
  );
}

export default Option;
