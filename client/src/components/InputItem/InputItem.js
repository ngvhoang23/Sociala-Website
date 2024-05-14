import classNames from 'classnames/bind';
import styles from './InputItem.module.scss';
import { useState } from 'react';

const cx = classNames.bind(styles);

function InputItem({
  error,
  value,
  lable_title,
  placeholder,
  name,
  type,
  required,
  onChange,
  onBlur,
  maximum_characters,
  className,
  rows = 5,
  input_type,
  onKeyDown,
}) {
  return (
    <div className={cx('wrapper', { [className]: className }, { required: required })}>
      {lable_title && (
        <h4 className={cx('input-lable')}>
          {lable_title} {required && <span className={cx('required-symbol')}>*</span>}
        </h4>
      )}
      {input_type === 'input' && (
        <input
          spellCheck={false}
          className={cx('input-content', { 'error-field': error })}
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            if (e.target.value.length > maximum_characters) {
              return;
            }
            onChange(e);
          }}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      )}
      {input_type === 'text_area' && (
        <textarea
          spellCheck={false}
          className={cx('text-area-content', { 'error-field': error })}
          rows={rows}
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            if (e.target.value.length > maximum_characters) {
              return;
            }
            onChange(e);
          }}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      )}
      {maximum_characters && <p className={cx('char-quantity')}>{`${value.length}/${maximum_characters}`}</p>}
      {error && <p className={cx('message-invalid')}>{error}</p>}
    </div>
  );
}

export default InputItem;
