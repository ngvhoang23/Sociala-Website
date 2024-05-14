import classNames from 'classnames/bind';
import styles from './DocumentsTab.module.scss';
import TabLayout from '../TabLayout/TabLayout';
import FileItem from '~/components/FileItem';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { DocumentIcon } from '~/components/Icons';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function DocumentsTab({ room_id, setCurrentTab }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_EFFECT
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const params = {
      room_id: room_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };
    room_id &&
      axiosInstance
        .get(`/message-datas/documents/${room_id}`, configurations)
        .then((result) => {
          setDocuments(result.data);
        })
        .catch((error) => {
          error = new Error();
        });
  }, [room_id]);

  return (
    <TabLayout
      icon={<DocumentIcon className={cx('document-icon')} />}
      header_title={'Documents'}
      onClose={() => setCurrentTab()}
    >
      <div className={cx('documents-container')}>
        {documents.map((item) => {
          return (
            <FileItem
              key={item.message_id}
              className={cx('document-item')}
              file_name={item.file_name}
              file_size={item.file_size}
              file_url={item.message}
            />
          );
        })}
      </div>
    </TabLayout>
  );
}

export default DocumentsTab;
