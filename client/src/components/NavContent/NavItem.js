import classNames from 'classnames/bind';
import styles from './NavContent.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBlog, faTowerBroadcast } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function NavItem({ icon, title, background_color, onClick }) {
  return (
    <div className={cx('nav-item-wrapper')} onClick={onClick}>
      {icon}
      <p className={cx('nav-item-content')}>{title}</p>
    </div>
  );
}

export default NavItem;
