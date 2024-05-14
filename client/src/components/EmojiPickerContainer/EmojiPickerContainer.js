import classNames from 'classnames/bind';
import styles from './EmojiPickerContainer.module.scss';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { memo } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';

const cx = classNames.bind(styles);

function EmojiPickerContainer({ _ref, className, onEmojiClick }) {
  return (
    <div ref={_ref} className={cx('wrapper', { [className]: className })}>
      <EmojiPicker emojiStyle={EmojiStyle.NATIVE} onEmojiClick={onEmojiClick} />
    </div>
  );
}

export default memo(EmojiPickerContainer);
