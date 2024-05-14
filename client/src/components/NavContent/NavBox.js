import classNames from 'classnames/bind';
import styles from './NavContent.module.scss';
import NavItem from './NavItem';

const cx = classNames.bind(styles);

function NavBox({ header_title, children }) {
  return (
    <div className={cx('nav-box-wrapper')}>
      <div className={cx('nav-box-header')}>{header_title}</div>
      <div className={cx('nav-box-container')}>{children}</div>
    </div>
  );
}

export default NavBox;
