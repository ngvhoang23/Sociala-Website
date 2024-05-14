import classNames from 'classnames/bind';
import styles from './SharedPostContent.module.scss';
import moment from 'moment';
import { EllipsisIcon } from '../Icons';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import DocLayout from '../DocLayout';
import MediaLayout from '../PostLayout/MediaLayout';
import ReactionListTippy from '../ReactionListTippy';
import TippyHeadless from '@tippyjs/react/headless';
import ReactionPicker from '../ReactionPicker/ReactionPicker';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function SharedPostContent({ post_id }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE
  const [postMedia, setPostMedia] = useState([]);
  const [postDocs, setPostDocs] = useState([]);
  const [shortTextContent, setShortTextContent] = useState('');
  const [textContent, setTextContent] = useState('');
  const [postInfo, setPostInfo] = useState();
  const [isShowDocs, setIsShowDocs] = useState(false);

  // USE_EFFECT

  useEffect(() => {
    const params = {
      queried_user_id: user.user_id,
      post_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/posts/${post_id}`, configurations)
      .then((result) => {
        const postInfo = result.data;
        setPostInfo(postInfo);
        setTextContent(postInfo.text_content);
        setPostMedia(postInfo?.files?.filter((file) => file.type == 'image' || file.type == 'video') || []);
        setPostDocs(postInfo?.files?.filter((file) => file.type == 'document') || []);
        setTextContent(postInfo.text_content);
        setShortTextContent(postInfo.text_content.slice(0, 60));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (textContent.split(/\r\n|\r|\n/).length > 4) {
      setShortTextContent(textContent.split('\n').slice(0, 4).join('\n'));
    }
  }, [textContent]);

  // FUNCTION_HANDLER
  const handleExpandContent = () => {
    setShortTextContent(textContent);
  };

  const handleShrinkContent = () => {
    if (textContent.split(/\r\n|\r|\n/).length > 4) {
      setShortTextContent(textContent.split('\n').slice(0, 4).join('\n'));
    } else {
      setShortTextContent(textContent.slice(0, 60));
    }
  };

  const handleRedirectToProfile = () => {
    window.location.href = `/profiles/${postInfo?.author_id}/posts`;
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <div className={cx('author-info')}>
          <img className={cx('author-avatar')} src={postInfo?.author_avatar} alt="" onClick={handleRedirectToProfile} />
          <div>
            <p className={cx('author-name')} onClick={handleRedirectToProfile}>
              {postInfo?.author_full_name}
            </p>
            <p className={cx('time-stamp')}>{postInfo?.created_at ? moment(postInfo.created_at).fromNow() : ''}</p>
          </div>
        </div>
      </div>
      <div className={cx('body')}>
        <div className={cx('post-content')}>
          <p className={cx('post-text-content')}>
            {shortTextContent}
            {shortTextContent.length < textContent.length && <span>... </span>}
            {shortTextContent.length < textContent.length && (
              <button className={cx('adjust-content-length-btn')} onClick={handleExpandContent}>
                See more
              </button>
            )}
            {shortTextContent.length == textContent.length &&
              (textContent.split(/\r\n|\r|\n/).length > 4 || textContent.length > 60) && (
                <button className={cx('adjust-content-length-btn')} onClick={handleShrinkContent}>
                  See less
                </button>
              )}
          </p>
        </div>
        {postDocs?.length > 0 && (
          <div className={cx('docs-container')}>
            <p
              className={cx('docs-title')}
              onClick={() => {
                setIsShowDocs((prev) => !prev);
              }}
            >
              <FontAwesomeIcon className={cx('paperclip-icon')} icon={faPaperclip} />
              Attached Documents
            </p>
            {isShowDocs && <DocLayout className={cx('doc-list')} files={postDocs} />}
          </div>
        )}
        {postMedia.length > 0 && (
          <div className={cx('media-container')}>
            <MediaLayout post_id={post_id} files={postMedia} />
          </div>
        )}
      </div>
    </div>
  );
}

export default SharedPostContent;
