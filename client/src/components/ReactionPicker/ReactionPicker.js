import classNames from 'classnames/bind';
import styles from './ReactionPicker.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFaceAngry,
  faFaceFrown,
  faFaceLaugh,
  faFaceLaughSquint,
  faFaceSurprise,
  faHeart,
  faThumbsUp,
} from '@fortawesome/free-regular-svg-icons';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import moment from 'moment';
import { AngryIcon, LaughIcon, LikeIcon, SadIcon, WowIcon, HeartIcon } from '../EmotionIcon/EmotionIcon';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function ReactionPicker({
  post_id,
  className,
  setPickedReaction,
  pickedReaction,
  setReactionQuantity,
  setReactionInfo,
  reactionInfo,
  getPost,
  setRecentReaction,
  recentReaction,
  updateReaction,
}) {
  // USE_REF
  const isMounted = useRef(false);
  const prevReaction = useRef(pickedReaction);
  const prevClickToggle = useRef(null);

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE

  // USE_EFFECT
  useEffect(() => {
    if (isMounted.current) {
      pickedReaction && handlePutReaction(pickedReaction);
    } else {
      isMounted.current = true;
    }
  }, [pickedReaction]);

  // FUNCTION_HANDLER
  const handlePutReaction = (reaction_type) => {
    const payload = {
      post_id: post_id,
      reaction_type,
      created_at: moment().valueOf(),
    };

    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .post(`/posts/reactions/${post_id}`, payload, configurations)
      .then((result) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={cx('wrapper', { [className]: className })}>
      <LikeIcon
        height="40px"
        width="40px"
        className={cx('reaction-item')}
        onClick={() => {
          updateReaction('like');
          setPickedReaction('like');
        }}
      />
      <HeartIcon
        height="42px"
        width="42px"
        className={cx('reaction-item')}
        onClick={() => {
          updateReaction('love');
          setPickedReaction('love');
        }}
      />
      <LaughIcon
        height="42px"
        width="42px"
        className={cx('reaction-item')}
        onClick={() => {
          updateReaction('haha');
          setPickedReaction('haha');
        }}
      />

      <WowIcon
        height="42px"
        width="42px"
        className={cx('reaction-item')}
        onClick={() => {
          updateReaction('wow');
          setPickedReaction('wow');
        }}
      />

      <SadIcon
        height="42px"
        width="42px"
        className={cx('reaction-item')}
        onClick={() => {
          updateReaction('sad');
          setPickedReaction('sad');
        }}
      />

      <AngryIcon
        height="42px"
        width="42px"
        className={cx('reaction-item')}
        onClick={() => {
          updateReaction('angry');
          setPickedReaction('angry');
        }}
      />
    </div>
  );
}

export default ReactionPicker;
