import classNames from 'classnames/bind';
import styles from './ConfirmModal.module.scss';
import { CloseIcon } from '../Icons';

const cx = classNames.bind(styles);

function ConfirmModal({ alert_title, alert_content, onConfirm, onDeny }) {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <div className={cx('header')}>
          <h3 className={cx('alert-title')}>{alert_title}</h3>
          <button className={cx('close-btn')} onClick={onDeny}>
            <CloseIcon height="2.2rem" width="2.2rem" />
          </button>
        </div>
        <div className={cx('body')}>
          <p className={cx('alert-content')}>{alert_content}</p>
        </div>
        <div className={cx('footer')}>
          <button className={cx('deny-btn')} onClick={onDeny}>
            No
          </button>
          <button className={cx('confirm-btn')} onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
