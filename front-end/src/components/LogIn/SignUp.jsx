import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FadeTransition from "../../components/FadeTransition";
import ICH from "../../images/svg/ICH2.svg";
import Button from "../../components/button/button";
import styles from "./LogIn.module.css";
import { $api } from "../../utils/api.ts"; // Импортируем настроенный axios

function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
  });

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          return t("invalid_email");
        }
        return "";
      case "fullName":
        if (value.trim().length < 3) {
          return t("full_name_error");
        }
        return "";
      case "username":
        if (value.trim().length < 3) {
          return t("username_error");
        }
        return "";
      case "password":
        if (value.length < 6) {
          return t("password_error");
        }
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "fullName":
        setFullName(value);
        break;
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await $api.post("/auth/register", {
        email,
        full_name: fullName,
        username,
        password,
      });

      console.log("Регистрация успешна:", response.data);
      navigate("/home"); // Перенаправление после успешной регистрации
    } catch (error) {
      console.error("Ошибка регистрации:", error.response?.data?.message || error.message);
      setErrors((prevErrors) => ({ ...prevErrors, form: error.response?.data?.message || "Ошибка при регистрации" }));
    }
  };

  return (
    <FadeTransition>
      <div>
        <div className={styles.LogIn_cont}>
          <div>
            <img src={ICH} alt="logo" />
          </div>
          <div className={styles.sign_title}>
            <p className="p_16Bold">{t("signup_description")}</p>
          </div>
          <form className={styles.Login_form} onSubmit={handleSubmit}>
            <div className={styles.login_cont_inp}>
              <div className={styles.LogIn_cont_input}>
                <input
                  type="text"
                  placeholder={t("email")}
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  className={styles.LogIn_inp}
                />
              </div>
              {errors.email && <p className={styles.errorText}>{errors.email}</p>}
              <div className={styles.LogIn_cont_input}>
                <input
                  type="text"
                  placeholder={t("full_name")}
                  name="fullName"
                  value={fullName}
                  onChange={handleInputChange}
                  className={styles.LogIn_inp}
                />
              </div>
              {errors.fullName && <p className={styles.errorText}>{errors.fullName}</p>}
              <div className={styles.LogIn_cont_input}>
                <input
                  type="text"
                  placeholder={t("username")}
                  name="username"
                  value={username}
                  onChange={handleInputChange}
                  className={styles.LogIn_inp}
                />
              </div>
              {errors.username && <p className={styles.errorText}>{errors.username}</p>}
              <div className={styles.LogIn_cont_input}>
                <input
                  type="password"
                  placeholder={t("password")}
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  className={styles.LogIn_inp}
                />
              </div>
              {errors.password && <p className={styles.errorText}>{errors.password}</p>}
              {errors.form && <p className={styles.errorText}>{errors.form}</p>}
            </div>
            <div className={styles.sign_text}>
              <p className="p_12SmallGrey sign_p">
                {t("terms_message")} <span className="p_blue">{t("learn_more")}</span>
              </p>
              <p className="p_12SmallGrey sign_p">{t("agree_terms")}</p>
            </div>
            <div className={styles.login_button}>
              <Button text={t("signup")} type="submit" />
            </div>
          </form>
        </div>
        <div className={styles.LogIn_cont}>
          <div className={styles.login_bottom}>
            <p className="p_14Small">{t("have_account")} </p>
            <Link to="/login" className="p_14Blue">
              {t("login")}
            </Link>
          </div>
        </div>
      </div>
    </FadeTransition>
  );
}

export default SignUp;
