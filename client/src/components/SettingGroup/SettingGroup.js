import classNames from 'classnames/bind';
import Button from '../Button';
import FormItem from './FormItem';
import styles from './SettingGroup.module.scss';

const cx = classNames.bind(styles);

function SettingGroup({ className, children, header, description }) {
  return (
    <div className={cx('wrapper', { [className]: className })}>
      <div className={cx('header')}>
        <h6>{header}</h6>
        <p>{description}</p>
      </div>
      <div className={cx('body')}>{children}</div>
      <div className={cx('footer')}>
        <Button className={cx('reset-btn')} noOuline title="Reset" />
        <Button primary title="Save Changes" />
      </div>
    </div>
  );
}

export default SettingGroup;
