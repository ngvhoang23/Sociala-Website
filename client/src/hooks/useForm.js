import React, { useEffect, useState } from 'react';
import { omit } from 'lodash';

const useForm = (callback) => {
  //Form values
  const [values, setValues] = useState({});
  //Errors
  const [errors, setErrors] = useState({});

  const validateFunctions = {
    required: (value) => {
      if (!value) {
        return 'This field is required';
      }
      if (typeof value === 'string') {
        if (value.trim() === '') {
          return 'This field is required';
        }
      }
      return undefined;
    },

    username: (value) => {
      value = value.trim();
      if (
        !new RegExp(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ).test(value)
      ) {
        return 'User name must be an email';
      } else {
        return undefined;
      }
    },

    email: (value) => {
      value = value.trim();
      if (
        !new RegExp(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ).test(value)
      ) {
        return 'Enter a valid email address';
      } else {
        return undefined;
      }
    },

    password: (value) => {
      value = value.trim();
      if (!new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).test(value)) {
        return 'Password should contains atleast 8 charaters and containing uppercase,lowercase and numbers';
      } else {
        return undefined;
      }
    },

    password_required: (value) => {
      value = value.trim();
      if (!value.trim()) {
        return 'This field is required';
      } else {
        return undefined;
      }
    },

    confirm_password: (value) => {
      value = value.trim();
      if (value !== values.password.val.trim()) {
        return 'Confirm password is not matched';
      } else {
        return undefined;
      }
    },

    birth_date: (value) => {
      if (new Date().getFullYear() - value < 18) {
        return 'You are not old enough';
      } else {
        return undefined;
      }
    },

    first_name: (value) => {
      value = value.trim();
      if (
        !new RegExp(
          /^[a-zA-Z'-'\sáàảãạăâắằấầặẵẫậéèẻ ẽẹếềểễệóòỏõọôốồổỗộ ơớờởỡợíìỉĩịđùúủũụưứ� �ửữựÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠ ƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼ� ��ỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞ ỠỢỤỨỪỬỮỰỲỴÝỶỸửữựỵ ỷỹ]*$/,
        ).test(value)
      ) {
        return 'First name does not contain special characters';
      } else {
        return undefined;
      }
    },

    last_name: (value) => {
      value = value.trim();
      if (
        !new RegExp(
          /^[a-zA-Z'-'\sáàảãạăâắằấầặẵẫậéèẻ ẽẹếềểễệóòỏõọôốồổỗộ ơớờởỡợíìỉĩịđùúủũụưứ� �ửữựÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠ ƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼ� ��ỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞ ỠỢỤỨỪỬỮỰỲỴÝỶỸửữựỵ ỷỹ]*$/,
        ).test(value)
      ) {
        return 'Last name does not contain special characters';
      } else {
        return undefined;
      }
    },

    phone_num: (value) => {
      value = value.trim();
      if (!new RegExp(/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/).test(value)) {
        return 'Invalid phone number';
      } else {
        return undefined;
      }
    },
    website: (value) => {
      value = value.trim();
      if (
        !new RegExp(
          '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', // fragment locator
          'i',
        ).test(value)
      ) {
        return 'Invalid website address';
      } else {
        return undefined;
      }
    },

    text: (value) => {
      value = value.trim();
      return undefined;
    },

    room_name: (value) => {
      value = value.trim();
      if (!new RegExp(/^[a-zA-Z0-9 ]*$/).test(value)) {
        return 'Group name contains only letters and numbers';
      } else {
        return undefined;
      }
    },

    workplace: (value) => {
      value = value.trim();
      return undefined;
    },

    education: (value) => {
      value = value.trim();
      return undefined;
    },

    address: (value) => {
      value = value.trim();
      return undefined;
    },

    detail_about: (value) => {
      value = value.trim();
      return undefined;
    },

    another_name: (value) => {
      value = value.trim();
      return undefined;
    },

    favorite_quote: (value) => {
      value = value.trim();
      return undefined;
    },
  };

  const validateAll = () => {
    const errors = {};
    for (const key in values) {
      let errorMessage = undefined;
      errorMessage = _validate(key, values[key].val, values[key].is_required);
      if (errorMessage) {
        errors[key] = errorMessage;
      }
    }
    return errors;
  };

  const _validate = (name, val, is_required) => {
    const { required } = validateFunctions;

    let errorMessage = undefined;
    errorMessage = required(val);

    if (errorMessage) {
      if (!is_required) {
        let newObj = omit(errors, name);
        setErrors(newObj);
        return undefined;
      }
    }

    if (!errorMessage) {
      errorMessage = validateFunctions[name](val);
    }

    if (errorMessage) {
      setErrors({
        ...errors,
        [name]: errorMessage,
      });
    } else {
      let newObj = omit(errors, name);
      setErrors(newObj);
    }

    return errorMessage;
  };

  //A method to handle form inputs
  const handleBlur = (event) => {
    let name = event.target.name;
    let val = event.target.value;
    const is_required = values[name].is_required;
    _validate(name, val, is_required);
    setValues({
      ...values,
      [name]: { val, is_required },
    });
  };

  const handleChange = (event) => {
    let name = event.target.name;
    let val = event.target.value;
    const is_required = values[name].is_required;

    _validate(name, val, is_required);

    setValues({
      ...values,
      [name]: { val, is_required },
    });
  };

  const handleUpdate = (event) => {
    let name = event.target.name;
    let val = event.target.value;
    const is_required = values[name].is_required;

    setValues({
      ...values,
      [name]: { val, is_required },
    });
  };

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    let final_error = {};
    final_error = validateAll();
    setErrors(final_error);
    console.log('final_error', final_error);
    if (Object.keys(final_error).length === 0) {
      callback();
    }
  };

  return {
    values,
    errors,
    setValues,
    handleBlur,
    handleChange,
    handleUpdate,
    handleSubmit,
  };
};

export default useForm;
