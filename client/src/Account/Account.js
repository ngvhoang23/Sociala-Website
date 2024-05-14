import { NavLink } from "react-router-dom";
import classNames from "classnames/bind";

import styles from "./Account.module.scss";

const cx = classNames.bind(styles);

function Account() {
  return (
    <div className={cx("wrapper")}>
      <NavLink to="/login">
        <button className={cx("login-btn")}>Login</button>
      </NavLink>
      <NavLink to="/register">
        <button className={cx("register-btn")}>Register</button>
      </NavLink>
    </div>
  );
}

export default Account;
