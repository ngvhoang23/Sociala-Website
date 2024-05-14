import classNames from 'classnames/bind';
import styles from './MyPostContainer.module.scss';
import PostItem from '../PostItem';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import Cookies from 'universal-cookie';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function MyPostContainer({ profile_id, className }) {
  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const params = {
      profile_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/posts/invidual-posts/${profile_id}`, configurations)
      .then((result) => {
        setPosts(result.data);
      })
      .catch((err) => {
        console.log('err: ', err);
      });
  }, [profile_id]);

  // function handler
  const renderPosts = () => {
    return posts.map((post) => {
      return (
        <PostItem
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

  return (
    <div className={cx('wrapper', { [className]: className })}>
      <div className={cx('container')}>
        {renderPosts()}
        {posts?.length == 0 && (
          <div className={cx('empty-posts')}>
            <h2>There are no post to show</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPostContainer;
