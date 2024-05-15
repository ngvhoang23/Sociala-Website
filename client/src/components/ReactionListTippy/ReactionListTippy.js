import classNames from 'classnames/bind';
import styles from './ReactionListTippy.module.scss';

const cx = classNames.bind(styles);

function ReactionListTippy({ user_reactions, reaction_type, reaction_count, _key }) {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        {reaction_type && (
          <div className={cx('header', { [reaction_type + '-header']: reaction_type })}>
            {reaction_type.charAt(0).toUpperCase() + reaction_type.slice(1)}
          </div>
        )}
        {user_reactions ? (
          <>
            {user_reactions?.map((user, index) => {
              return (
                <p key={index} className={cx('user-name-item')}>
                  {user.full_name}
                </p>
              );
            })}
            {reaction_count > 5 && (
              <p key={user_reactions.length} className={cx('user-name-item')}>
                and {reaction_count - 5} more...
              </p>
            )}
          </>
        ) : (
          <span className={cx('loader')}></span>
        )}
      </div>
    </div>
  );
}

export default ReactionListTippy;
