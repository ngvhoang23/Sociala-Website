import classNames from 'classnames/bind';
import styles from './MyDatePicker.module.scss';
import { useRef, useState } from 'react';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar } from '@hassanmojab/react-modern-calendar-datepicker';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';
const cx = classNames.bind(styles);

function MyDatePicker({ selectedDay, setSelectedDay, className }) {
  const [isOpenDateBox, setIsOpenDateBox] = useState(false);

  const datePickerRef = useRef();

  const formatDate = (value) => {
    let day = value.day;
    let month = value.month;
    if (value.day < 10) {
      day = `0${value.day}`;
    }
    if (value.month < 10) {
      month = `0${value.month}`;
    }

    return `${day}-${month}-${value.year}`;
  };

  useOutsideAlerter(datePickerRef, () => {
    setIsOpenDateBox(false);
  });

  return (
    <div
      ref={datePickerRef}
      className={cx('wrapper', { [className]: className })}
      onClick={() => setIsOpenDateBox((prev) => !prev)}
    >
      <div className={cx('birth-date-label')}>
        <p className={cx('birth-date-title')}>{formatDate(selectedDay)}</p>
        <span className={cx('calendar-icon')}>
          <img alt="" src={require('../../assets/images/calendar_icon.png')} />
        </span>
      </div>
      {isOpenDateBox && (
        <div className={cx('date-picker-box')} onClick={(e) => e.stopPropagation()}>
          <Calendar
            onChange={(e) => {
              setSelectedDay(e);
              setIsOpenDateBox(false);
            }}
            shouldHighlightWeekends
          />
        </div>
      )}
    </div>
  );
}

export default MyDatePicker;
