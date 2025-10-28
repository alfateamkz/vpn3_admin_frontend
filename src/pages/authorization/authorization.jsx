import styles from "./authorization.module.scss";
import { useState } from "react";
import { apiRequests } from "../../shared/api/apiRequests";
import Cookies from "js-cookie";
import { setUserData } from "../../shared/store/main";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import passwordIco from "../../shared/images/password.svg";

export const AuthorizationPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisiblePass, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showIPInfo, setShowIPInfo] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (value) => {
    setEmail(value);
    // if (emailRegex.test(value) || value === "") {
    //   setEmail(value);
    // }
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setShowIPInfo(false);
    
    await apiRequests.auth
      .login({
        email,
        password,
      })
      .then((res) => {
        Cookies.set("accessToken", res.data.access_token);
        Cookies.set("refreshToken", res.data.refresh_token);
        dispatch(setUserData({ ...res.data.user }));
        navigate("/stats");
      })
      .catch((e) => {
        const detail = e.response?.data?.detail || "Ошибка входа";
        
        if (e.response?.status === 403 && detail.includes("IP адрес")) {
          // Показываем информацию об IP
          setShowIPInfo(true);
          setErrorMessage(detail);
        } else {
          setErrorMessage(detail);
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

          <button onClick={handleSubmit} className={"blue-button"}>
            Войти
          </button>

          {errorMessage && (
            <div className={styles.errorMessage}>
              {errorMessage}
            </div>
          )}

          {showIPInfo && (
            <div className={styles.ipInfoCard}>
              <h4>🔐 Информация о доступе</h4>
              <p>Ваш IP адрес не находится в белом списке администраторов.</p>
              <p>Для получения доступа обратитесь к администратору системы.</p>
              <div className={styles.ipInfoDetails}>
                <strong>Что это означает:</strong>
                <ul>
                  <li>Система использует IP-белый список для безопасности</li>
                  <li>Только IP-адреса из списка могут получить доступ к админ-панели</li>
                  <li>Ваш IP должен быть добавлен администратором</li>
                </ul>
              </div>
            </div>
          )}

          {/* <Link className={styles.resetPassword} to={"/reset_password"}>
            Сбросить пароль
          </Link> */}
        </div>
      </div>
    </div>
  );
};
