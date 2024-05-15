import classNames from 'classnames/bind';
import styles from './SettingItem.module.scss';
import { RightArrowIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function SettingItem({ onClick, className, title }) {
  return (
    <div className={cx('wrapper', { [className]: className })} onClick={onClick}>
      <div className={cx('header')}>
        <h3 className={cx('header-title')}>{title}</h3>
      </div>
      <div className={cx('footer')}>
        <button className={cx('open-setting-item-btn')}>
          <RightArrowIcon height="2.4rem" width="2.4rem" />
        </button>
      </div>
    </div>
  );
}

export default SettingItem;
