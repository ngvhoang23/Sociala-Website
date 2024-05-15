import classNames from 'classnames/bind';
import styles from './CheckBoxInput.module.scss';
import { TickBoxIcon, UnCheckTickBox } from '../Icons';
import { useState } from 'react';

const cx = classNames.bind(styles);

function CheckBoxInput({ title, isCheck, onClick, className }) {
  return (
    <div className={cx('wrapper', { [className]: className })}>
      <div className={cx('check-box-container')} onClick={onClick}>
        {isCheck ? (
          <TickBoxIcon className={cx('check-icon', 'check-box-icon')} />
        ) : (
          <UnCheckTickBox className={cx('check-box-icon')} />
        )}
        <h4 className={cx('input-title')}>{title}</h4>
      </div>
    </div>
  );
}

export default CheckBoxInput;
