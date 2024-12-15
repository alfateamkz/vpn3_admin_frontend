import styles from "./authorization.module.scss";
import { useState } from "react";
import { apiRequests } from "../../shared/api/apiRequests";
import Cookies from "js-cookie";
import { setUserData } from "../../shared/store/main";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import passwordIco from "../../shared/images/password.svg";

const emailRegex = /.+@.+\.[A-Za-z]+$/;

export const AuthorizationPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisiblePass, setVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (value) => {
    setEmail(value);
    // if (emailRegex.test(value) || value === "") {
    //   setEmail(value);
    // }
  };

  const handleSubmit = async () => {
    await apiRequests.auth
      .login({
        email,
        password,
      })
      .then((res) => {
        Cookies.set("accessToken", res.data.access_token);
        Cookies.set("refreshToken", res.data.refresh_token);
        dispatch(setUserData({ ...res.data.user }));
        navigate("/servers");
      })
      .catch((e) => {
        const detail = e.response.data.detail;
        if (e.response.code === 400) {
          alert(detail);
        }
      });
  };

  return (
    <div>
      <div className="mobile-container">
        <header className="mobile-header">
          <h4>Войдите в аккаунт</h4>
        </header>

        <div className={styles.wrapper}>
          <div className={styles.form}>
            <div className={styles.inputBody}>
              <input
                value={email}
                onChange={(e) => handleChange(e.target.value)}
                type="text"
                placeholder={"Email"}
              />
            </div>
          </div>
          <div className={styles.passBody}>
            <input
              value={password}
              placeholder={"Введите пароль"}
              onChange={(e) => setPassword(e.target.value)}
              type={isVisiblePass ? "text" : "password"}
              className={styles.inputPassword}
            />
            <button onClick={() => setVisible((prev) => !prev)}>
              <img src={passwordIco} alt="" />
            </button>
          </div>

          {/* <Link className={styles.resetPassword} to={"/reset_password"}>
            Сбросить пароль
          </Link> */}
        </div>

        <button onClick={handleSubmit} className={"blue-button"}>
          Войти
        </button>
      </div>
    </div>
  );
};
