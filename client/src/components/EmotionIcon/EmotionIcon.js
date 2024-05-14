const angry_icon = require('../../assets/images/angry-icon.png');
const heart_icon = require('../../assets/images/heart_icon.png');
const smile_icon = require('../../assets/images/smile_icon.png');
const sad_icon = require('../../assets/images/sad_icon.png');
const like_icon = require('../../assets/images/like_icon.png');
const wow_icon = require('../../assets/images/wow_icon.png');

const message_icon = require('../../assets/images/messages_icon.png');
const user_group_icon = require('../../assets/images/user_group_icon.png');
const gear_icon = require('../../assets/images/gear_icon.png');
const logo_icon = require('../../assets/images/app_logo_icon.png');
const empty_icon = require('../../assets/images/empty_icon.png');
const messenger_icon = require('../../assets/images/messenger_icon.png');

export const HeartIcon = ({ width = '24px', height = '24px', className, onClick, onMouseEnter }) => {
  return (
    <span className={className} onClick={onClick} onMouseEnter={onMouseEnter}>
      <img height={height} width={width} alt="" src={heart_icon} />
    </span>
  );
};

export const AngryIcon = ({ width = '24px', height = '24px', className, onClick, onMouseEnter }) => {
  return (
    <span className={className} onClick={onClick} onMouseEnter={onMouseEnter}>
      <img height={height} width={width} alt="" src={angry_icon} />
    </span>
  );
};

export const LaughIcon = ({ width = '24px', height = '24px', className, onClick, onMouseEnter }) => {
  return (
    <span className={className} onClick={onClick} onMouseEnter={onMouseEnter}>
      <img height={height} width={width} alt="" src={smile_icon} />
    </span>
  );
};

export const SadIcon = ({ width = '24px', height = '24px', className, onClick, onMouseEnter }) => {
  return (
    <span className={className} onClick={onClick} onMouseEnter={onMouseEnter}>
      <img height={height} width={width} alt="" src={sad_icon} />
    </span>
  );
};

export const LikeIcon = ({ width = '24px', height = '24px', className, onClick, onMouseEnter }) => {
  return (
    <span className={className} onClick={onClick} onMouseEnter={onMouseEnter}>
      <img height={height} width={width} alt="" src={like_icon} />
    </span>
  );
};

export const WowIcon = ({ width = '24px', height = '24px', className, onClick, onMouseEnter }) => {
  return (
    <span className={className} onClick={onClick} onMouseEnter={onMouseEnter}>
      <img height={height} width={width} alt="" src={wow_icon} />
    </span>
  );
};

export const MessageIcon = ({ width = '24px', height = '24px', className, onClick }) => {
  return (
    <span className={className} onClick={onClick}>
      <img height={height} width={width} alt="" src={message_icon} />
    </span>
  );
};

export const UserGroupIcon = ({ width = '24px', height = '24px', className, onClick }) => {
  return (
    <span className={className} onClick={onClick}>
      <img height={height} width={width} alt="" src={user_group_icon} />
    </span>
  );
};

export const GearIcon = ({ width = '24px', height = '24px', className, onClick }) => {
  return (
    <span className={className} onClick={onClick}>
      <img height={height} width={width} alt="" src={gear_icon} />
    </span>
  );
};

export const LogoIcon = ({ width = '24px', height = '24px', className, onClick }) => {
  return (
    <span className={className} onClick={onClick}>
      <img height={height} width={width} alt="" src={logo_icon} />
    </span>
  );
};

export const EmptyIcon = ({ width = '24px', height = '24px', className, onClick }) => {
  return (
    <span className={className} onClick={onClick}>
      <img height={height} width={width} alt="" src={empty_icon} />
    </span>
  );
};

export const MessengerIcon = ({ width = '24px', height = '24px', className, onClick }) => {
  return (
    <span className={className} onClick={onClick}>
      <img height={height} width={width} alt="" src={messenger_icon} />
    </span>
  );
};
