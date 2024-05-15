import classNames from 'classnames/bind';
import { memo, useContext } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { IsOpenRoomInfoBarContext } from '~/Context/IsOpenRoomInfoBarContext';
import { CloseIcon } from '../../../../../components/Icons';
import styles from './RoomInfoHeader.module.scss';
import { IsOpenRoomInfoContext } from '~/pages/Messenger/Contexts/IsOpenRoomInfo';

const cx = classNames.bind(styles);

function RoomInfoHeader() {
  const isOpenRoomInfoContext = useContext(IsOpenRoomInfoContext);
  const isOpenRoomInfo = isOpenRoomInfoContext.isOpen;
  const setIsOpenRoomInfo = isOpenRoomInfoContext.setIsOpen;

  return (
    <div className={cx('wrapper')}>
      <h5 className={cx('title')}>Profile Details</h5>
      <button
        className={cx('close-icon')}
        onClick={() => {
          setIsOpenRoomInfo(false);
        }}
      >
        <CloseIcon width={'2.4rem'} height={'2.4rem'} />
      </button>
    </div>
  );
}

export default memo(RoomInfoHeader);
