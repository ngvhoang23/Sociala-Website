import classNames from 'classnames/bind';
import styles from './SettingGroup.module.scss';

const cx = classNames.bind(styles);

function GroupItem({ className, children, header, description }) {
  return (
    <div className={cx('group-item-wrapper', { [className]: className })}>
      <div className={cx('group-item-content')}>
        <p className={cx('group-item-header')}>{header}</p>
        <p className={cx('group-item-description')}>{description}</p>
      </div>
      <div className={cx('group-item-option')}>{children}</div>
    </div>
  );
}

export default GroupItem;
