import classNames from 'classnames/bind';
import styles from './RoomInfoSide.module.scss';
import { memo, useContext, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import Cookies from 'universal-cookie';
import { DocumentIcon, InfoIcon, PhotoIcon, UserGroupIcon } from '~/components/Icons';
import RoomInfoGroup from '~/components/RoomInfoGroup';
import RoomInfoHeader from '~/MainLayout/components/RoomInfoContainer/RoomInfoSide/RoomInfoHeader';
import { CurrentRoomContext } from '~/Context/CurrentRoomContext';
import { IsOpenRoomInfoBarContext } from '~/Context/IsOpenRoomInfoBarContext';
import RoomInfoCenter from './RoomInfoCenter';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function RoomInfoSide({ room_id, setCurrentTab }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const navigate = useNavigate();

  // USE_PARAMS

  // USE_STATE
  const [mediaView, setMediaView] = useState();

  // // USE_CONTEXT

  const currentRoomContext = useContext(CurrentRoomContext);
  const currentRoom = currentRoomContext.currentRoom;

  const isOpenRoomInfoBarContext = useContext(IsOpenRoomInfoBarContext);
  const isOpenRoomInfoBar = isOpenRoomInfoBarContext.isOpenRoomInfoBar;

  // USE_STATE

  // USE_EFFECT

  return currentRoom && isOpenRoomInfoBar && currentRoom?.room_id == room_id ? (
    <>
      <div className={cx('wrapper')}>
        <div className={cx('container')}>
          <div className={cx('header')}>
            <RoomInfoHeader />
          </div>
          <div className={cx('content')}>
            <RoomInfoCenter />
            {currentRoom?.room_type === 1 ? (
              <RoomInfoGroup
                className={cx('user-info-group', 'group-info-item')}
                title={'User-infomation'}
                icon={<InfoIcon width={'2rem'} height={'2rem'} />}
              >
                <ul className={cx('user-info-group-container')}>
                  <li className={cx('user-info-item')}>
                    <p className={cx('user-info-item-title')}>Phone</p>
                    <p className={cx('user-info-item-content')}>+01-222-364522</p>
                  </li>
                  <li className={cx('user-info-item')}>
                    <p className={cx('user-info-item-title')}>Email</p>
                    <p className={cx('user-info-item-content')}>catherine.richardson@gmail.com</p>
                  </li>
                  <li className={cx('user-info-item')}>
                    <p className={cx('user-info-item-title')}>Address</p>
                    <p className={cx('user-info-item-content')}>1134 Ridder Park Road, San Fransisco, CA 94851</p>
                  </li>
                </ul>
              </RoomInfoGroup>
            ) : (
              <RoomInfoGroup
                className={cx('members-group', 'group-info-item')}
                title={'Group Participants'}
                icon={<UserGroupIcon className={cx('members-icon')} width={'2.6rem'} height={'2.6rem'} />}
                onClick={() => setCurrentTab('members-tab')}
              >
                {/* <ul className={cx('members-group-container')}>
                  {currentRoom?.members.map((member) => (
                    <AccountItem
                      key={member.user_id}
                      className={cx('member-item')}
                      user_id={member.user_id}
                      avatar={member.user_avatar}
                      headerTitle={member.full_name}
                      description={member.user_id === currentRoom?.admin_id ? 'Admin' : 'Member'}
                      option={
                        member.user_id !== user.user_id && (
                          <DropDownMenu className={cx('member-item-drop-down')} ellipsis>
                            {member.user_id !== currentRoom?.admin_id && user.user_id === currentRoom?.admin_id && (
                              <>
                                <OptionItem
                                  title="Make Admin"
                                  onClick={() => {
                                    handleSetAdmin(currentRoom?.room_id, user.user_id, member);
                                  }}
                                />
                                <OptionItem
                                  title="Remove from Group"
                                  onClick={() => {
                                    handleRemoveUserFromRoom(member, currentRoom?.room_id);
                                  }}
                                />
                              </>
                            )}
                            <OptionItem title="Block" />
                            <OptionItem title="Profile" onClick={() => handleRedirectToProfile(member.user_id)} />
                          </DropDownMenu>
                        )
                      }
                    />
                  ))}
                </ul> */}
              </RoomInfoGroup>
            )}

            <RoomInfoGroup
              className={cx('media-group', 'group-info-item')}
              title={'Last Media'}
              icon={<PhotoIcon className={cx('photo-icon')} width={'2.8rem'} height={'2.8rem'} />}
              onClick={() => setCurrentTab('photos-tab')}
            >
              {/* <ul className={cx('media-group-container')}>
                {media.map((item, ind) => {
                  if (item.type == 'image') {
                    return (
                      <MediaItem
                        className={cx('media-item')}
                        key={item.media_id}
                        type="image"
                        src={item.url}
                        large
                        removable={false}
                        onClick={() => {
                          setMediaPreview({
                            media: media,
                            currentMediaView: { url: item.url, type: item.type },
                            setCurrentMediaView: setCurrentMediaView,
                          });
                        }}
                      />
                    );
                  } else if (item.type == 'video') {
                    return (
                      <MediaItem
                        className={cx('media-item')}
                        key={item.media_id}
                        type="video"
                        src={item.url}
                        large
                        removable={false}
                        onClick={() => {
                          setMediaPreview({
                            media: media,
                            currentMediaView: { url: item.url, type: item.type },
                            setCurrentMediaView: setCurrentMediaView,
                          });
                        }}
                      />
                    );
                  }
                })}
              </ul> */}
            </RoomInfoGroup>

            <RoomInfoGroup
              className={cx('document-group', 'group-info-item')}
              title={'Documents'}
              icon={<DocumentIcon width={'2.8rem'} height={'2.8rem'} />}
              onClick={() => setCurrentTab('documents-tab')}
            ></RoomInfoGroup>
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}

export default memo(RoomInfoSide);
