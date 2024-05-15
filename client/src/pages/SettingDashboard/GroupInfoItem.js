import classNames from 'classnames/bind';
import styles from './SettingDashboard.module.scss';
import { ClockIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function GroupInfoItem({ header, content, icon }) {
    return (
        <li className={cx('info-item')}>
            <div>
                <p className={cx('group-header')}>{header}</p>
                <p className={cx('group-content')}>{content}</p>
            </div>
            <div className={cx('info-item-icon')}>{icon}</div>
        </li>
    );
}

export default GroupInfoItem;
