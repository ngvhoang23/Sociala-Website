import classNames from 'classnames/bind';
import styles from './SuggestionsTab.module.scss';
import FriendItem from '../../components/FriendItem';
import Cookies from 'universal-cookie';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import VirtualScroll from 'react-dynamic-virtual-scroll';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function SuggestionsTab() {
  // USE_REF
  const bottomRef = useRef();
  const isBottomMounted = useRef(false);

  // USEISINVIEWPORT
  const needToLoad = useIsInViewport(bottomRef);

  function useIsInViewport(ref) {
    const [isIntersecting, setIsIntersecting] = useState(false);

    const observer = useMemo(
      () =>
        new IntersectionObserver(([entry]) => {
          setIsIntersecting(entry.isIntersecting);
        }),
      [],
    );

    useEffect(() => {
      if (!ref?.current) {
        return;
      }
      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }, [ref, observer]);

    return isIntersecting;
  }

  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE
  const [suggestions, setSuggestions] = useState([]);

  const [loadedSuggestions, setLoadedSuggestions] = useState([]);

  // USE_EFFECT

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/users/suggested-users/`, config)
      .then((result) => {
        const suggestedUsers = result.data.filter((suggestedUser) => suggestedUser.user_id != user.user_id);
        setSuggestions(suggestedUsers);

        const needToLoad = suggestedUsers.filter((user, index) => index >= 0 && index <= +10);
        needToLoad[needToLoad.length - 1].last_ind = 10;
        setLoadedSuggestions(needToLoad);
      })
      .catch((error) => {
        error = new Error();
      });
  }, []);

  useEffect(() => {
    console.log(needToLoad);
    if (isBottomMounted?.current && needToLoad) {
      loadMoreSuggestions();
    } else {
      if (needToLoad) {
        isBottomMounted.current = true;
      }
    }
  }, [needToLoad]);

  const loadMoreSuggestions = () => {
    let last_ind = 0;
    if (loadedSuggestions.length > 0) {
      last_ind = loadedSuggestions[loadedSuggestions.length - 1].last_ind;
    }
    if (last_ind > suggestions.length) {
      return;
    }
    const needToLoad = suggestions.filter((user, index) => index <= last_ind + 10);
    needToLoad[needToLoad.length - 1].last_ind = last_ind + 10;
    setLoadedSuggestions((prev) => needToLoad);
  };

  const getItems = () => {
    return suggestions.map((suggestion) => {
      return (
        <FriendItem
          key={suggestion.user_id}
          friend_id={suggestion.user_id}
          className={cx('friend-item')}
          friend_avatar={suggestion.user_avatar}
          friend_name={suggestion.full_name}
          mutual_friends={12}
        />
      );
    });
  };

  return (
    <div className={cx('wrapper')}>
      <h3 className={cx('header-title')}>Suggestions</h3>
      <div className={cx('container')}>
        <VirtualScroll
          className="List"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap' }}
          minItemHeight={40}
          totalLength={suggestions.length}
          renderItem={(index) => {
            return (
              <FriendItem
                key={suggestions[index].user_id}
                friend_id={suggestions[index].user_id}
                className={cx('friend-item')}
                friend_avatar={suggestions[index].user_avatar}
                friend_name={suggestions[index].full_name}
                mutual_friends={12}
                width={176}
                height={176}
              />
            );
          }}
        />
      </div>
      {/* <div className={cx('bottom-ref')} ref={bottomRef}></div> */}
    </div>
  );
}

export default SuggestionsTab;
