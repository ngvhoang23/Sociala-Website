import { useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import Cookies from 'universal-cookie';
import classNames from 'classnames/bind';
import styles from './RemoveMessageModal.module.scss';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AccountItem from '../AccountItem';
import moment from 'moment';

const cookies = new Cookies();

const cx = classNames.bind(styles);

function RemoveMessageModal({ setIsOpenRemoveMessageModal, handleRemoveMessage, currentRoom }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const [members, setMembers] = useState([]);
  const [chosenMembers, setChosenMembers] = useState([]);
  const [removeType, setRemoveType] = useState(1);

  const handleSubmit = (e) => {
    setIsOpenRemoveMessageModal(false);
    handleRemoveMessage(removeType);
  };

  return (
    <div className={cx('wrapper')} onClick={() => setIsOpenRemoveMessageModal(false)}>
      <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
        <label className={cx('header')}>Choose Users That You Want To Remove For</label>
        <div className={cx('remove-option')}>
          <div className={cx('remove-for-everyone')} onClick={() => setRemoveType(1)}>
            <input className={cx('inp-option')} type="radio" checked={removeType == 1} />
            <span className={cx('option-title')}>Unsend for everyone</span>
          </div>
          <div className={cx('remove-for-you')} onClick={() => setRemoveType(0)}>
            <input className={cx('inp-option')} type="radio" checked={removeType == 0} />
            <span className={cx('option-title')}>Remove for you</span>
          </div>
        </div>
        <div className={cx('submit-btn')}>
          <button className={cx('cancel-btn')} onClick={() => setIsOpenRemoveMessageModal(false)}>
            Cancel
          </button>
          <button className={cx('submit-btn')} onClick={handleSubmit}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default RemoveMessageModal;
