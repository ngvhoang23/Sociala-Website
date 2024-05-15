import classNames from 'classnames/bind';
import styles from './RoomInfoContainer.module.scss';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import RoomInfoSide from './RoomInfoSide';
import PhotosTab from './PhotosTab/PhotosTab';
import { useParams } from 'react-router-dom';
import DocumentsTab from './DocumentsTab/DocumentsTab';
import MembersTab from './MembersTab/MembersTab';
import { IsOpenRoomInfoContext } from '~/pages/Messenger/Contexts/IsOpenRoomInfo';

const cx = classNames.bind(styles);

function RoomInfoContainer() {
  const { room_id } = useParams();

  // USE_STATE
  const [currentTab, setCurrentTab] = useState();

  useEffect(() => {
    setCurrentTab();
  }, [room_id]);

  // FUNCTION_HANDLER
  const renderTab = () => {
    switch (currentTab) {
      case 'photos-tab':
        return <PhotosTab room_id={room_id} setCurrentTab={setCurrentTab} />;
      case 'documents-tab':
        return <DocumentsTab room_id={room_id} setCurrentTab={setCurrentTab} />;
      case 'members-tab':
        return <MembersTab room_id={room_id} setCurrentTab={setCurrentTab} />;
      default:
        break;
    }
  };

  return (
    <div className={cx('wrapper')}>
      <RoomInfoSide room_id={room_id} setCurrentTab={setCurrentTab} />
      {currentTab && <div className={cx('tab-container')}>{renderTab()}</div>}
    </div>
  );
}

export default RoomInfoContainer;
