import classNames from 'classnames/bind';
import styles from './TabLayout.module.scss';
import { LeftArrowIcon, PhotoIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function TabLayout({ header_title, icon, children, onClose }) {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <button
          className={cx('close-icon')}
          onClick={() => {
            onClose();
          }}
        >
          <LeftArrowIcon width={'2.4rem'} height={'2.4rem'} />
        </button>
        <div className={cx('header-label')}>
          <h5 className={cx('title')}>{header_title}</h5>

          {icon}
        </div>
      </div>
      <div className={cx('body')}>
        <div className={cx('container')}>{children}</div>
      </div>
    </div>
  );
}

export default TabLayout;
