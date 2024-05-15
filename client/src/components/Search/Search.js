import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import classNames from 'classnames/bind';
import { useContext, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import styles from './Search.module.scss';
import Cookies from 'universal-cookie';
import { SearchResultContext } from '~/SearchValueContext';
import { useNavigate } from 'react-router-dom';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function Search() {
  // VARIABLE
  const navigate = useNavigate();

  // CONTEXT
  const context = useContext(SearchResultContext);

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const [searchValue, setSearchValue] = useState('');

  const handleSearchUsers = () => {
    const params = {
      searchValue,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    searchValue &&
      axiosInstance
        .get(`/users/search-users/${searchValue}`, configurations)
        .then((result) => {
          context.handleSearchUsers(result.data);
          navigate('/contacts', { replace: true });
        })
        .catch((error) => {
          error = new Error();
        });
  };

  return (
    <div className={cx('search-box')}>
      <label className={cx('search-label')}>Search Friends</label>
      <div className={cx('search-container')}>
        <input
          value={searchValue}
          className={cx('search-inp')}
          placeholder="Search..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button className={cx('search-btn')} onClick={handleSearchUsers}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </div>
  );
}

export default Search;
