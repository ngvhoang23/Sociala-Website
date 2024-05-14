import classNames from 'classnames/bind';
import styles from './ConfirmingOptionModal.module.scss';
import { CloseIcon } from '../Icons';
import RadioInput from '../RadioInput';
import { useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';

const cx = classNames.bind(styles);

function ConfirmingOptionModal({ header_title, options, className, children, onDeny, onConfirm }) {
  const [currentChoice, setCurrentChoice] = useState();

  return (
    <div
      className={cx('wrapper')}
      onClick={() => {
        onDeny();
      }}
    >
      <div className={cx('container', { [className]: className })} onClick={(e) => e.stopPropagation()}>
        {header_title && (
          <div className={cx('header')}>
            <h3 className={cx('header-title')}>{header_title}</h3>
            <button
              className={cx('close-btn')}
              onClick={() => {
                onDeny();
              }}
            >
              <CloseIcon width={'2.6rem'} height={'2.6rem'} />
            </button>
          </div>
        )}
        <div className={cx('body')}>
          {options?.map((option, index) => {
            return (
              <RadioInput
                key={index}
                className={cx('option-item')}
                value={0}
                text={option?.option_title}
                checked={currentChoice == option?.value}
                description={option?.option_description}
                onClick={() => {
                  setCurrentChoice(option?.value);
                  option?.onClick();
                }}
              />
            );
          })}
        </div>
        <div className={cx('footer')}>
          <button
            className={cx('deny-btn')}
            onClick={() => {
              onDeny();
            }}
          >
            Cancel
          </button>
          <button
            className={cx('confirm-btn')}
            onClick={() => {
              onConfirm(currentChoice);
            }}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmingOptionModal;
