import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import styles from './ChatTabContent.module.scss';
import classNames from 'classnames/bind';
import ContactItem from '../ContactItem';
import CreateGroupChatModal from '../GroupChatGenerator';
import moment from 'moment';
import {
  BellIcon,
  CoupleMessagesIcon,
  CoupleUserIcon,
  EditIcon,
  MessageDot,
  SearchIcon,
  UnReadIcon,
  UserGroupIcon,
} from '../Icons';
import OptionItem from '../OptionItem';
import DropDownMenu from '../DropDownMenu';
import ContactsContainer from '../ContactsContainer/ContactsContainer';
import ContactsModal from '../ContactsModal/ContactsModal';
import { IsOpenGroupChatGeneratorContext } from '~/Context/IsOpenGroupChatGeneratorContext';

const cookies = new Cookies();
const cx = classNames.bind(styles);

function ChatTabContent() {
  // CONSTANCE
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_REF

  // USE_CONTEXT
  const isOpenGroupChatGeneratorContext = useContext(IsOpenGroupChatGeneratorContext);
  const isOpenGroupChatGenerator = isOpenGroupChatGeneratorContext.isOpenGroupChatGenerator;
  const setIsOpenGroupChatGenerator = isOpenGroupChatGeneratorContext.setIsOpenGroupChatGenerator;

  // USE_STATE
  const [filter, setFilter] = useState('all_chats');

  // USE_EFFECT

  // FUNCTION_HANDER

  return (
    <>
      <div className={cx('wrapper')}>
        <ContactsModal
          className={cx('contact-container')}
          headerTitle="Messenger"
          filters={[
            {
              title: 'All Chats',
              icon: <CoupleMessagesIcon height="2.8rem" width="2.8rem" />,
              onClick: () => {
                setFilter('all_chats');
              },
            },
            {
              title: 'Friends',
              icon: <UserGroupIcon height="2.8rem" width="2.8rem" />,

              onClick: () => {
                setFilter('friends');
              },
            },
            {
              title: 'Groups',
              icon: <UserGroupIcon height="2.8rem" width="2.8rem" />,

              onClick: () => {
                setFilter('groups');
              },
            },
            {
              title: 'Unread',
              icon: <UnReadIcon height="2.8rem" width="2.8rem" />,

              onClick: () => {
                setFilter('un_read');
              },
            },
          ]}
          options={[
            {
              title: 'Create Group',
              icon: <UserGroupIcon width="2.1rem" height="2.1rem" />,
              onClick: () => {
                setIsOpenGroupChatGenerator(true);
              },
            },
          ]}
        >
          <div className={cx('contacts-container')}>
            <ContactsContainer chatFilter={filter} />
          </div>
        </ContactsModal>
      </div>
    </>
  );
}

export default memo(ChatTabContent);
