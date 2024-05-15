import classNames from 'classnames/bind';
import styles from './AddUserInfoItem.module.scss';
import { PlusIcon } from '~/components/Icons';
import { useState } from 'react';

const cx = classNames.bind(styles);

function AddUserInfoItem({ header_title, title, children, isOpenEditBox, setIsOpenEditBox }) {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <h4 className={cx('header-title')}>{header_title}</h4>
      </div>
      <div className={cx('body')}>
        <button className={cx('add-info-btn')} onClick={() => setIsOpenEditBox((prev) => !prev)}>
          <PlusIcon height="2.4rem" width="2.4rem" />
          <p>{title}</p>
        </button>

        {isOpenEditBox && <div className={cx('container')}>{children}</div>}
      </div>
    </div>
  );
}

export default AddUserInfoItem;
