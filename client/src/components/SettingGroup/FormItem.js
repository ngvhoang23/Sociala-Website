import classNames from 'classnames/bind';
import styles from './SettingGroup.module.scss';

const cx = classNames.bind(styles);

function FormItem({ className, header, placeholder }) {
  return (
    <div className={cx('form-item-wrapper', { [className]: className })}>
      <label className={cx('form-item-header')}>{header}</label>
      <input placeholder={placeholder} />
    </div>
  );
}

export default FormItem;
