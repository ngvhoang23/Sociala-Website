import classNames from 'classnames/bind';
import styles from './UserInfoForm.module.scss';
import InputItem from '~/components/InputItem';
import { DownArrowIcon, EarthIcon, FileIcon, RightArrowIcon, UserGroupIcon } from '~/components/Icons';
import TippyWrapper from '~/components/TippyWrapper';
import IconBtn from '~/components/IconBtn';
import { useEffect, useState } from 'react';
import useForm from '~/hooks/useForm';

const cx = classNames.bind(styles);

function UserInfoForm({ fields, setValue, selected_privacy, setPrivacy, privacies, onSubmit, info_code, onClose }) {
  const [isOpenPrivacyOptions, setIsOpenPrivacyOptions] = useState(false);

  const { handleChange, handleBlur, errors, setValues, handleSubmit } = useForm(onSubmit);

  useEffect(() => {
    const values = {};
    fields.forEach((field) => {
      values[field.name] = { val: field.value, is_required: false };
    });
    setValues(values);
  }, []);

  return (
    <div className={cx('wrapper')}>
      {fields.map((field, index) => {
        return (
          <InputItem
            key={index}
            className={cx('input-item')}
            lable_title={field?.title}
            placeholder={field?.placeholder}
            value={field?.value || ''}
            name={field?.name}
            type={field?.type}
            maximum_characters={field?.maximum_characters}
            onChange={(e) => {
              handleChange(e);
              field?.setValue({
                name: field?.name,
                value: e.target.value,
              });
            }}
            input_type={field?.input_type}
            error={errors[field?.name]}
            onBlur={handleBlur}
          />
        );
      })}

      <div className={cx('footer')}>
        {privacies && (
          <div className={cx('privacy')} onClick={() => setIsOpenPrivacyOptions((prev) => !prev)}>
            <button className={cx('privacy-btn')}>
              {selected_privacy?.icon}
              <p className={cx('privacy-title')}>{selected_privacy?.title}</p>
              {isOpenPrivacyOptions ? (
                <DownArrowIcon height="2rem" width="2rem" />
              ) : (
                <RightArrowIcon height="2rem" width="2rem" />
              )}
            </button>

            {isOpenPrivacyOptions && (
              <TippyWrapper className={cx('menu-privacies')}>
                {Object.keys(privacies)?.map((key) => {
                  return (
                    <IconBtn
                      key={privacies[key]?.code}
                      small
                      className={cx('privacy-item')}
                      icon={privacies[key]?.icon}
                      title={privacies[key]?.title}
                      onClick={() => setPrivacy(info_code, privacies[key])}
                    />
                  );
                })}
              </TippyWrapper>
            )}
          </div>
        )}
        <div className={cx('operations')}>
          <button className={cx('cancel-btn')} onClick={onClose}>
            Cancel
          </button>
          <button className={cx('submit-btn')} onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserInfoForm;
