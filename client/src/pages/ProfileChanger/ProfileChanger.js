import classNames from 'classnames/bind';
import Button from '~/components/Button';
import DropDownMenu from '~/components/DropDownMenu';
import IconBtn from '~/components/IconBtn';
import {
  CalendarIcon,
  ClockIcon,
  EarthIcon,
  FaceBookIcon,
  GmailIcon,
  HomeIcon,
  InstagramIcon,
  LinkedInIcon,
  LogOutIcon,
  MessageDot,
  PhoneIcon,
  TwitterIcon,
} from '~/components/Icons';
import ProfileModal from '~/components/ProfileModal';
import SettingGroup, { FormItem } from '~/components/SettingGroup';
import GroupItem from '~/components/SettingGroup/GroupItem';
import SwitchBtn from '~/components/SwitchBtn/SwitchBtn';
import GroupInfoItem from '../SettingDashboard/GroupInfoItem';
import styles from './ProfileChanger.module.scss';
import { useContext } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';

const cx = classNames.bind(styles);

function ProfileChanger() {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  return (
    <div className={cx('wrapper')}>
      <div className={cx('profile-container')}>
        <div className={cx('header')}>
          <h5>Profile</h5>
          <p>Personal Information & Settings</p>
        </div>
        <div className={cx('profile-content')}>
          <ProfileModal
            user_name={user.full_name}
            userAvatar={user.user_avatar}
            options={
              <>
                <Button icon={<LogOutIcon height={'1.8rem'} width={'1.8rem'} />} title="Log out " />
              </>
            }
          >
            <ul className={cx('group-info')}>
              <GroupInfoItem
                header="Local Time"
                content="10:25 PM"
                icon={<ClockIcon width={'2rem'} height={'2rem'} />}
              />
              <GroupInfoItem
                header="Birthdate"
                content="20/11/1992"
                icon={<CalendarIcon width={'2rem'} height={'2rem'} />}
              />
              <GroupInfoItem
                header="Phone"
                content="+01-222-364522"
                icon={<PhoneIcon width={'2rem'} height={'2rem'} />}
              />
              <GroupInfoItem
                header="Email"
                content="catherine.richardson@gmail.com"
                icon={<GmailIcon width={'2rem'} height={'2rem'} />}
              />
              <GroupInfoItem
                header="Website"
                content="www.catherichardson.com"
                icon={<EarthIcon width={'2rem'} height={'2rem'} />}
              />
              <GroupInfoItem
                header="Address"
                content="1134 Ridder Park Road, San Fransisco, CA 94851"
                icon={<HomeIcon width={'2rem'} height={'2rem'} />}
              />
            </ul>

            <ul className={cx('group-info')}>
              <GroupInfoItem
                header="Facebook"
                content="@cathe.richardson"
                icon={<FaceBookIcon width={'2rem'} height={'2rem'} />}
              />
              <GroupInfoItem
                header="Twitter"
                content="@cathe.richardson"
                icon={<TwitterIcon width={'2rem'} height={'2rem'} />}
              />
              <GroupInfoItem
                header="Instagram"
                content="@cathe.richardson"
                icon={<InstagramIcon width={'2rem'} height={'2rem'} />}
              />
              <GroupInfoItem
                header="Linkedin"
                content="catherine.richardson@gmail.com"
                icon={<LinkedInIcon width={'2rem'} height={'2rem'} />}
              />
            </ul>
          </ProfileModal>
        </div>
      </div>
      <div className={cx('settings-container')}>
        <div className={cx('header')}>
          <h5>Settings</h5>
          <p>Update Personal Information & Settings</p>
        </div>
        <div className={cx('setting-content')}>
          <SettingGroup
            className={cx('setting-group-item')}
            header="Account"
            description="Update personal & contact information"
          >
            <div className={cx('form-container')}>
              <FormItem className={cx('form-item')} header="First Name" placeholder="First Name..." />
              <FormItem className={cx('form-item')} header="Last Name" placeholder="Last Name..." />
              <FormItem className={cx('form-item')} header="Mobile number" placeholder="Mobile number..." />
              <FormItem className={cx('form-item')} header="Birth date" placeholder="Birth date..." />
              <FormItem className={cx('form-item')} header="Email address" placeholder="Email address..." />
              <FormItem className={cx('form-item')} header="Website" placeholder="Website..." />
              <FormItem className={cx('form-item')} header="Address" placeholder="Address..." />
            </div>
          </SettingGroup>

          <SettingGroup
            className={cx('setting-group-item')}
            header="Social network profiles"
            description="Update personal & contact information"
          >
            <div className={cx('form-container')}>
              <FormItem className={cx('form-item')} header="Facebook" placeholder="Facebook..." />
              <FormItem className={cx('form-item')} header="Twitter" placeholder="Twitter..." />
              <FormItem className={cx('form-item')} header="Instagram" placeholder="Instagram..." />
              <FormItem className={cx('form-item')} header="Linkedin" placeholder="Linkedin..." />
            </div>
          </SettingGroup>

          <SettingGroup
            className={cx('setting-group-item')}
            header="Password"
            description="Update personal & contact information"
          >
            <div className={cx('form-container')}>
              <FormItem className={cx('form-item')} header="Current Password" placeholder="Current Password..." />
              <FormItem className={cx('form-item')} header="New Password" placeholder="New Password..." />
              <FormItem className={cx('form-item')} header="Repeat Password" placeholder="Repeat Password..." />
            </div>
          </SettingGroup>

          <SettingGroup
            className={cx('setting-group-item')}
            header="Privacy"
            description="Update personal & contact information"
          >
            <div className={cx('group-container')}>
              <GroupItem
                className={cx('group-item')}
                header="Profile Picture"
                description="Select who can see my profile picture"
                option={<SwitchBtn />}
              >
                <DropDownMenu menu={['Public', 'Friend', 'Selected Friend']} />
              </GroupItem>
              <GroupItem className={cx('group-item')} header="Last Seen" description="Select who can see my last seen">
                <DropDownMenu menu={['Public', 'Friend', 'Selected Friend']} />
              </GroupItem>
              <GroupItem className={cx('group-item')} header="Groups" description="Select who can add you in groups">
                <DropDownMenu menu={['Public', 'Friend', 'Selected Friend']} />
              </GroupItem>
              <GroupItem
                className={cx('group-item')}
                header="Status"
                description="Select who can see my status updates"
              >
                <DropDownMenu menu={['Public', 'Friend', 'Selected Friend']} />
              </GroupItem>
              <GroupItem
                className={cx('group-item')}
                header="Read receipts"
                description="If turn off this option you won't be able to see read recipts"
              >
                <SwitchBtn />
              </GroupItem>
            </div>
          </SettingGroup>

          <SettingGroup
            className={cx('setting-group-item')}
            header="Security"
            description="Update personal & contact information"
          >
            <div className={cx('group-container')}>
              <GroupItem
                className={cx('group-item')}
                header="Use two-factor authentication"
                description="Ask for a code if attempted login from an unrecognised device or browser."
              >
                <SwitchBtn />
              </GroupItem>
              <GroupItem
                className={cx('group-item')}
                header="Get alerts about unrecognised logins"
                description="You will be notified if anyone logs in from a device or browser you don't usually use"
              >
                <SwitchBtn />
              </GroupItem>
            </div>
          </SettingGroup>
        </div>
      </div>
    </div>
  );
}

export default ProfileChanger;
