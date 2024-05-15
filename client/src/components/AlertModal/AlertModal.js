import classNames from 'classnames/bind';
import Button from '../Button';
import { CloseIcon } from '../Icons';
import styles from './AlertModal.module.scss';

const cx = classNames.bind(styles);

function AlertModal({ headerTitle, setIsShowAlert, children, className, onSubmit }) {
  return (
    <div
      className={cx('wrapper')}
      onClick={() => {
        setIsShowAlert(false);
      }}
    >
      <div className={cx('container', { [className]: className })} onClick={(e) => e.stopPropagation()}>
        {headerTitle && (
          <div className={cx('header')}>
            <p className={cx('header-title')}>{headerTitle}</p>
            <button
              className={cx('close-btn')}
              onClick={() => {
                setIsShowAlert(false);
              }}
            >
              <CloseIcon width={'2.8rem'} height={'2.8rem'} />
            </button>
          </div>
        )}
        <div className={cx('body')}>{children}</div>
        <div className={cx('footer')}>
          <Button
            className={cx('cancel-btn')}
            noOuline
            title="Cancel"
            onClick={() => {
              setIsShowAlert(false);
            }}
          />
          <Button
            className={cx('footer-btn')}
            primary
            title="OK"
            onClick={() => {
              setIsShowAlert(false);
              if (onSubmit) {
                onSubmit();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AlertModal;
