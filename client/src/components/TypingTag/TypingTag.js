import classNames from 'classnames/bind';
import styles from './TypingTag.module.scss';

const cx = classNames.bind(styles);

function TypingTag() {
  return (
    <div className={cx('typing')}>
      <div className={cx('typing__dot')}></div>
      <div className={cx('typing__dot')}></div>
      <div className={cx('typing__dot')}></div>
    </div>
  );
}

export default TypingTag;
