import { useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import Cookies from 'universal-cookie';
import classNames from 'classnames/bind';
import styles from './GroupChatGenerator.module.scss';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AccountItem from '../AccountItem';
import moment from 'moment';
import { createId } from '~/UserDefinedFunctions';
import { SocketContext } from '~/Context/SocketContext';
import OnlineContactItem from '../OnlineContactItem';
import { TickBoxIcon, UnCheckTickBox } from '../Icons';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import InputItem from '../InputItem';
import useForm from '~/hooks/useForm';

const cookies = new Cookies();

const cx = classNames.bind(styles);

function GroupChatGenerator({ onClose }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_REF
  const inputUpload = useRef();

  // USE_CONTEXT
  const socket = useContext(SocketContext);

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE
  const [suggestedUsers, setSuggestedUsers] = useState();
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([{ user_id: user.user_id, full_name: user.full_name }]);
  const [roomAvatar, setRoomAvatar] = useState();

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/users/suggested-users/`, config)
      .then((result) => {
        setSuggestedUsers(result.data);
      })
      .catch((error) => {
        error = new Error();
      });
  }, []);

  const handleSearchUsers = (e) => {
    const params = {
      searchValue: e.target.value,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/users/search-users`, configurations)
      .then((result) => {
        setSuggestedUsers(result.data);
      })
      .catch((error) => {
        console.log(error);
        error = new Error();
      });
  };

  const handleUploadAvatar = () => {
    inputUpload.current.click();
  };

  const handleAddNewContact = (room_id, message_id) => {
    const default_group_name = members
      .map((member, ind) => {
        if (ind !== members.length - 1) {
          return `${member.full_name}, `;
        } else {
          return `${member.full_name}`;
        }
      })
      .join('');
    const contact = {
      admin_id: user.user_id,
      author_id: null,
      author_name: null,
      created_at: null,
      isSeen: true,
      joined_at: '2023-08-17T08:12:19.000Z',
      left_at: null,
      members,
      message: `${user.full_name} created this room`,
      message_id,
      room_avatar: roomAvatar ? roomAvatar : null,
      room_id,
      room_name: groupName || default_group_name,
      room_type: 2,
      type: 'text',
    };

    socket?.emit('invite-to-new-room', contact);
  };

  const _handleSubmit = (e) => {
    const formData = new FormData();
    roomAvatar && formData.append('roomAvatar', roomAvatar);
    groupName && formData.append('groupName', groupName);
    formData.append('members', JSON.stringify(members));
    formData.append('created_at', moment().valueOf());
    const config = {
      headers: { 'content-type': 'multipart/form-data', Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}` },
    };

    if (!groupName) {
      const default_group_name = members
        .map((member, ind) => {
          if (ind !== members.length - 1) {
            return `${member.full_name}, `;
          } else {
            return `${member.full_name}`;
          }
        })
        .join('');
      formData.append('groupName', default_group_name);
    }

    axiosInstance
      .post(`/rooms/create-new-room`, formData, config)
      .then((result) => {
        const room_id = result.data;
        const message_id = createId(0, room_id);
        handleAddNewContact(result.data, message_id);
        onClose();
        return new Promise((resolve, reject) => {
          let notifications = [
            {
              message_id,
              room_id,
              message: `${user.full_name} created this room`,
              created_at: moment().valueOf(),
              type: 'text',
              author_id: null,
            },
          ];

          const payload = {
            notifications: notifications,
          };

          const configurations = {
            headers: {
              Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
            },
          };

          axiosInstance
            .post(`/message-datas/notification`, payload, configurations)
            .then((result) => {
              resolve(result);
            })
            .catch((err) => reject(err));
        });
      })
      .catch((error) => {
        error = new Error();
        console.log(error);
      });
  };

  const handleClickMemberItem = ({ user_id, full_name }) => {
    let check = [];

    check = members.filter((member) => member.user_id != user_id);

    if (check.length == members.length) {
      setMembers((prev) => [...prev, { user_id, full_name }]);
    } else {
      setMembers(check);
    }
  };

  const checkIsAdded = (user_id) => {
    return members.some((member) => member.user_id == user_id);
  };

  const { handleBlur, handleChange, errors, setValues, handleSubmit } = useForm(_handleSubmit);

  useEffect(() => {
    setValues({
      room_name: { val: groupName, is_required: false },
    });
  }, []);

  return (
    <div className={cx('wrapper')} onClick={() => onClose()}>
      <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
        <h3 className={cx('header')}>Create Group Chat</h3>
        <div className={cx('info-room-input')}>
          <input
            type="file"
            ref={inputUpload}
            className={cx('upload-avatar-inp')}
            onChange={(e) => setRoomAvatar(e.target.files[0])}
          />
          <div className={cx('room-avatar-container')} onClick={handleUploadAvatar}>
            {roomAvatar && (
              <img className={cx('room-avatar')} src={roomAvatar && URL.createObjectURL(roomAvatar)} alt="" />
            )}
            {!roomAvatar && (
              <img className={cx('camera-icon')} alt="" src={require('../../assets/images/camera_icon.png')} />
            )}
          </div>

          <InputItem
            className={cx('room-name-input', 'group-name-inp')}
            placeholder={'Type Group Name...'}
            lable_title={'Room Name'}
            value={groupName}
            name={'room_name'}
            type={'text'}
            maximum_characters={40}
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
            input_type={'input'}
            error={errors['room_name']}
            onBlur={handleBlur}
          />
        </div>
        <div className={cx('search-box')}>
          <label>Search User</label>
          <input placeholder="Type user name..." onChange={handleSearchUsers} />
        </div>
        <div className={cx('search-result')}>
          {suggestedUsers?.map((suggestedUser, index) => {
            if (suggestedUser.user_id !== user.user_id) {
              const check = checkIsAdded(suggestedUser.user_id);

              return (
                <div key={suggestedUser.user_id} className={cx('contact-item-wrapper')}>
                  <OnlineContactItem
                    contact_avatar={suggestedUser.user_avatar}
                    contact_name={suggestedUser.full_name}
                    description={'1 mutual group'}
                    className={cx('account-item')}
                    onClick={() =>
                      handleClickMemberItem({ user_id: suggestedUser.user_id, full_name: suggestedUser.full_name })
                    }
                    avatar_width={36}
                    avatar_height={36}
                  />
                  {check ? (
                    <TickBoxIcon className={cx('contact-tick-box')} width="2.8rem" height="2.8rem" />
                  ) : (
                    <UnCheckTickBox className={cx('contact-tick-box')} width="2.8rem" height="2.8rem" />
                  )}
                </div>
              );
            }
          })}
        </div>
        <div className={cx('footer')}>
          <button className={cx('cancel-btn')} onClick={() => onClose()}>
            Cancel
          </button>
          <button className={cx('submit-btn')} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default GroupChatGenerator;
