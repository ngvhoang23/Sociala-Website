import classNames from 'classnames/bind';
import styles from './EditingGroupChatModal.module.scss';
import { CloseIcon, UploadIcon } from '../Icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { RoomStateContext } from '~/Context/RoomStateContext';
import { createId } from '~/UserDefinedFunctions';
import moment from 'moment';
import { SocketContext } from '~/Context/SocketContext';
import { MessagesContext } from '~/Context/MessagesContext';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import useForm from '~/hooks/useForm';
import InputItem from '../InputItem';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function EditingGroupChatModal({ room_id, onClose }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_REF
  const imgInpRef = useRef(null);

  // USE_CONTEXT
  const roomStateContext = useContext(RoomStateContext);
  const setRoomState = roomStateContext.setRoomState;

  const messagesContext = useContext(MessagesContext);
  const setMessages = messagesContext.handleSetMessages;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const socket = useContext(SocketContext);

  // USE_STATE
  const [roomInfo, setRoomInfo] = useState({});
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomImg, setNewRoomImg] = useState('');

  // USE_EFFECT
  useEffect(() => {
    const params = {
      room_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/rooms/${room_id}`, configurations)
      .then((result) => {
        const roomInfo = result.data;
        setRoomInfo(roomInfo);
      })
      .catch((error) => {
        error = new Error();
      });
  }, []);

  // FUNCTION_HANDLER
  const _handleSubmit = () => {
    const formData = new FormData();

    newRoomName.trim() && formData.append('room_name', newRoomName.trim());
    formData.append('room_id', room_id);
    formData.append('roomAvatar', newRoomImg);

    const config = {
      headers: { 'content-type': 'multipart/form-data', Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}` },
    };

    if (newRoomName.trim() || newRoomImg) {
      axiosInstance
        .post(`/rooms/change-info/`, formData, config)
        .then((result) => {
          return new Promise((resolve, reject) => {
            let notificationPackage = {
              room_id: room_id,
              sender_id: user.user_id,
              state_type: 'change_room_info',
              notifications: [],
            };

            if (newRoomName.trim()) {
              const messageId = createId(user.user_id, room_id, 0);
              notificationPackage.notifications = [
                ...notificationPackage.notifications,
                {
                  message_id: messageId,
                  room_id: room_id,
                  message: `${user.full_name} has changed room name from '${roomInfo?.room_name}' to '${newRoomName}'`,
                  created_at: moment().valueOf(),
                  type: 'text',
                  author_id: null,
                },
              ];
            }

            if (newRoomImg) {
              const messageId = createId(user.user_id, room_id, 1);
              notificationPackage.notifications = [
                ...notificationPackage.notifications,
                {
                  message_id: messageId,
                  room_id: room_id,
                  message: `${user.full_name} has changed room picture`,
                  created_at: moment().valueOf(),
                  type: 'text',
                  author_id: null,
                },
              ];
            }

            const payload = {
              notifications: notificationPackage.notifications,
            };

            const configurations = {
              headers: {
                Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
              },
            };

            notificationPackage.length !== 0 &&
              axiosInstance
                .post(`/message-datas/notification`, payload, configurations)
                .then((result) => {
                  resolve({ result, notificationPackage });
                })
                .catch((err) => reject(err));
          });
        })
        .then(({ result, notificationPackage }) => {
          onClose();
          setMessages((prev) => [...prev, ...notificationPackage.notifications]);
          setRoomState(notificationPackage);
          socket.emit('change-room-state', { room_id: room_id, notificationPackage });
        })
        .catch((err) => console.log(err));
    } else {
      onClose();
    }
  };

  const { handleBlur, handleChange, errors, setValues, handleSubmit } = useForm(_handleSubmit);

  useEffect(() => {
    setValues({
      room_name: { val: newRoomName, is_required: false },
    });
  }, []);

  return (
    <div className={cx('wrapper')} onClick={onClose}>
      <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
        <div className={cx('header')}>
          <h3 className={cx('header-title')}>Custome Chat</h3>
          <button className={cx('close-btn')} height={'2.2rem'} onClick={onClose}>
            <CloseIcon width={'2.4rem'} height="2.4rem" />
          </button>
        </div>
        <div className={cx('body')}>
          <div className={cx('form-item')}>
            <label className={cx('form-item-header')}>Change Group Name</label>

            <InputItem
              className={cx('room-name-input')}
              placeholder={'Type group name here'}
              value={newRoomName || roomInfo?.room_name || ''}
              name={'room_name'}
              type={'text'}
              maximum_characters={250}
              onChange={(e) => {
                setNewRoomName(e.target.value ? e.target.value : ' ');
              }}
              input_type={'input'}
              error={errors['room_name']}
              onBlur={handleBlur}
            />
          </div>
          <div className={cx('form-item')}>
            <label className={cx('form-item-header')}>Change Profile Picture</label>
            <input
              ref={imgInpRef}
              type="file"
              accept=".jpg, .png"
              className={cx('hiden')}
              onChange={(e) => {
                setNewRoomImg(e.target.files[0]);
              }}
            />
            <div className={cx('room-img')}>
              <img src={newRoomImg ? URL.createObjectURL(newRoomImg) : roomInfo.room_avatar} alt="room-img" />
            </div>
            <div className={cx('get-file-container')}>
              <p className={cx('get-file-title')}>{newRoomImg?.name ? newRoomImg?.name : 'Change picture'}</p>
              <button
                className={cx('get-file-btn')}
                onClick={() => {
                  imgInpRef?.current.click();
                }}
              >
                <UploadIcon className={cx('upload-icon')} height="2.4rem" width="2.4rem" />
                Upload Photo
              </button>
            </div>
          </div>
        </div>
        <div className={cx('footer')}>
          <button className={cx('cancel-btn')} onClick={onClose}>
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

export default EditingGroupChatModal;
