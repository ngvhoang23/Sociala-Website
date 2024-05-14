import classNames from 'classnames/bind';
import styles from './PostsContainer.module.scss';
import PostItem from '../PostItem';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { CurrentMediaPreviewContext } from '~/Context/CurrentMediaPreviewContext';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import { NeedToReLoadContext } from '~/Context/NeedToReLoadContext';
import { IsLoadingContext } from '~/Context/IsLoadingContext';
import NoMorePostNoti from './NoMorePostNoti';
import { useNavigate } from 'react-router-dom';
import VirtualScroll from 'react-dynamic-virtual-scroll';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function PostsContainer() {
  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_REF
  const bottomRef = useRef();
  const isBottomMounted = useRef(false);
  const emptyRef = useRef();

  // USE_CONTEXT
  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const needToReLoadSignalContext = useContext(NeedToReLoadContext);
  const reLoadingSignal = needToReLoadSignalContext.reLoadingSignal;
  const setReLoadingSignal = needToReLoadSignalContext.setReLoadingSignal;

  const isLoadingContext = useContext(IsLoadingContext);
  const isLoading = isLoadingContext.isLoading;
  const setIsLoading = isLoadingContext.setIsLoading;

  // USEISINVIEWPORT
  const needToLoad = useIsInViewport(bottomRef);

  // USE_STATE
  const [posts, setPosts] = useState([]);
  const [lastPostId, setLastPostId] = useState({ post: 1000, sharing_post: 1000 });
  const [moreLoadingSignal, setMoreLoadingSignal] = useState({ post: false, sharing_post: false });
  const [isNoMorePosts, setIsNoMorePost] = useState(false);

  // USE_EFFECT
  useEffect(() => {
    if (isBottomMounted.current && needToLoad) {
      loadMorePosts();
    } else {
      if (needToLoad) {
        isBottomMounted.current = true;
        // loadMorePosts();
      }
    }
  }, [needToLoad]);

  useEffect(() => {
    setPosts([]);
  }, [reLoadingSignal?.status]);

  useEffect(() => {
    const params = {
      quantity: 100,
      last_post_index: Number.MAX_VALUE,
    };
    const config = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    setTimeout(() => {
      axiosInstance
        .get(`/posts/`, config)
        .then((result) => {
          setReLoadingSignal((prev) => ({ ...prev, posts: true }));
          setLastPostId((prev) => ({ ...prev, post: result.data[result.data.length - 1]?.post_id }));
          setPosts((prev) => [...prev, ...result.data]);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 0);
  }, [reLoadingSignal?.status]);

  useEffect(() => {
    const params = {
      quantity: 2,
      last_post_index: Number.MAX_VALUE,
    };
    const config = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    setTimeout(() => {
      axiosInstance
        .get(`/posts/sharing`, config)
        .then((result) => {
          setReLoadingSignal((prev) => ({ ...prev, posts: true }));
          setPosts((prev) => [...prev, ...result.data]);
          setLastPostId((prev) => ({ ...prev, sharing_post: result.data[result.data.length - 1]?.post_id }));
        })
        .catch((err) => {
          console.log(err);
        });
    }, 0);
  }, [reLoadingSignal?.status]);

  const loadMorePosts = () => {
    if (!lastPostId?.sharing_post && !lastPostId?.post) {
      return;
    }

    setIsLoading(true);
    const params1 = {
      quantity: 2,
      last_post_index: lastPostId.sharing_post,
    };

    const config1 = {
      params: params1,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    if (lastPostId?.sharing_post) {
      setTimeout(() => {
        axiosInstance
          .get(`/posts/sharing`, config1)
          .then((result) => {
            setPosts((prev) => [...prev, ...result.data]);
            setLastPostId((prev) => ({ ...prev, sharing_post: result.data[result.data.length - 1]?.post_id }));
            setMoreLoadingSignal((prev) => ({ ...prev, sharing_post: true }));
          })
          .catch((err) => {
            console.log(err);
          });
      }, 0);
    } else {
      setMoreLoadingSignal((prev) => ({ ...prev, sharing_post: true }));
    }

    const params2 = {
      quantity: 2,
      last_post_index: lastPostId.post,
    };

    const config2 = {
      params: params2,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    if (lastPostId?.post) {
      setTimeout(() => {
        axiosInstance
          .get(`/posts/`, config2)
          .then((result) => {
            setPosts((prev) => [...prev, ...result.data]);
            setLastPostId((prev) => ({ ...prev, post: result.data[result.data.length - 1]?.post_id }));
            setMoreLoadingSignal((prev) => ({ ...prev, post: true }));
          })
          .catch((err) => {
            console.log(err);
          });
      }, 0);
    } else {
      setMoreLoadingSignal((prev) => ({ ...prev, post: true }));
    }
  };

  useEffect(() => {
    if (moreLoadingSignal.post && moreLoadingSignal.sharing_post) {
      setIsLoading(false);
    }
  }, [moreLoadingSignal]);

  useEffect(() => {
    if (!moreLoadingSignal?.post && !moreLoadingSignal?.sharing_post) {
      setIsNoMorePost(true);
    } else {
      setIsLoading(false);
    }
  }, [moreLoadingSignal]);

  // function handler
  const renderPosts = () => {
    return posts.map((post, ind) => {
      return (
        <PostItem
          className={cx('post-item')}
          key={post.post_id}
          author_id={post.author_id}
          post_id={post.post_id}
          author_avatar={post.author_avatar}
          author_full_name={post.author_full_name}
          text_content={post.text_content}
          files={post.files}
          reaction_quantity={post.reaction_quantity}
          comment_quantity={post.comment_quantity}
          is_reacted={post.is_reacted}
          react_type={post.react_type}
          reaction_info={post.reaction_info}
          created_at={post.created_at}
          ref_author_id={post.ref_author_id}
          ref_created_at={post.ref_created_at}
          ref_full_name={post.ref_full_name}
          ref_post_id={post.ref_post_id}
          ref_text_content={post.ref_text_content}
          ref_user_avatar={post.ref_user_avatar}
          ref_user_name={post.ref_user_name}
        />
      );
    });
  };

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

  const handleOpenFriendsPage = (chat_id) => {
    navigate(`/contacts/suggestions`, { replace: true });
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <VirtualScroll
          className="List"
          minItemHeight={40}
          totalLength={posts.length}
          buffer={1}
          renderItem={(index) => {
            return (
              <PostItem
                className={cx('post-item')}
                key={posts[index].post_id}
                author_id={posts[index].author_id}
                post_id={posts[index].post_id}
                author_avatar={posts[index].author_avatar}
                author_full_name={posts[index].author_full_name}
                text_content={posts[index].text_content}
                files={posts[index].files}
                reaction_quantity={posts[index].reaction_quantity}
                comment_quantity={posts[index].comment_quantity}
                is_reacted={posts[index].is_reacted}
                react_type={posts[index].react_type}
                reaction_info={posts[index].reaction_info}
                created_at={posts[index].created_at}
                ref_author_id={posts[index].ref_author_id}
                ref_created_at={posts[index].ref_created_at}
                ref_full_name={posts[index].ref_full_name}
                ref_post_id={posts[index].ref_post_id}
                ref_text_content={posts[index].ref_text_content}
                ref_user_avatar={posts[index].ref_user_avatar}
                ref_user_name={posts[index].ref_user_name}
              />
            );
          }}
        />
        <div className={cx('bottom-ref')} ref={bottomRef}></div>

        {isNoMorePosts && <NoMorePostNoti onOpenFriends={handleOpenFriendsPage} />}
      </div>
    </div>
  );
}

export default PostsContainer;
