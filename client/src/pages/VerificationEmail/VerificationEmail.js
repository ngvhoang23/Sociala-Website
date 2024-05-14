import classNames from 'classnames/bind';
import styles from './VerificationEmail.module.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import Cookies from 'universal-cookie';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function VerificationEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('Verifying Your Email...');

  useEffect(() => {
    const configuration = {
      method: 'post',
      url: `http://localhost:5000/auth/register/verification/${token}`,
      data: {
        verification_token: token,
      },
    };

    token.trim() &&
      axios(configuration)
        .then((result) => {
          const { access_token, refresh_token, user_id, user_name } = result.data;
          cookies.set('ACCESS_TOKEN', access_token, {
            path: '/',
          });
          cookies.set('REFRESH_TOKEN', refresh_token, {
            path: '/',
          });
          window.location.href = `/users/update-user-info/${user_id}/${token}`;
          setStatus('Verify Successfully');
        })
        .catch((error) => {
          console.log(error);
          setStatus('Verify Failed');
        });
  }, [token]);

  return (
    <div className={cx('wrapper')}>
      <h2>{status}</h2>
    </div>
  );
}

export default VerificationEmail;
