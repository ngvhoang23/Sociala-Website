import classNames from 'classnames/bind';
import styles from './RadioInput.module.scss';

const cx = classNames.bind(styles);

const RadioInput = ({ value, onClick, checked, text, description, className }) => {
  return (
    <label className={cx('radio-label', { [className]: className })} onClick={onClick}>
      <input className={cx('radio-input')} type="radio" value={value} onChange={() => {}} checked={checked} />
      <span className={cx('custom-radio')} />
      <div className={cx('content')}>
        <h5>{text}</h5>
        <p>{description}</p>
      </div>
    </label>
  );
};

export default RadioInput;
