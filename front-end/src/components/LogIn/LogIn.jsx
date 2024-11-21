import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FadeTransition from "../../components/FadeTransition";
import ICH from "../../images/svg/ICH2.svg";
import Button from "../button/button.jsx";
import { $api } from "../../utils/api.ts";
import styles from "./LogIn.module.css";
import phone from "../../images/png/Background111.png";

const validationSchema = Yup.object().shape({
  emailOrUsername: Yup.string().required("Введите email или имя пользователя"),
  password: Yup.string()
    .required("Введите пароль")
    .min(6, "Пароль должен содержать минимум 6 символов"),
});

function LogIn() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await $api.post("/auth/login", {
        emailOrUsername: data.emailOrUsername,
        password: data.password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error) {
      setLoginError(
        error.response?.data?.message || "Ошибка при авторизации"
      );
    }
  };

  return (
    <FadeTransition>
      <div className={styles.loginbox}>
<div className={styles.phonesimage}><img src={phone} alt="" /> </div>
        <div className={styles.LogIn_cont}>
          <div>
            <img src={ICH} alt="logo" />
          </div>
          <div className={styles.inputbox}>
          <form className={styles.Login_form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.login_cont_inp}>
              <div className={styles.LogIn_cont_input}>
                <input
                  type="text"
                  name="emailOrUsername"
                  placeholder={t("email_or_username")}
                  {...register("emailOrUsername")}
                  className={styles.LogIn_inp}
                />
              </div>
              {errors.emailOrUsername && (
                <p className={styles.errorText}>
                  {errors.emailOrUsername.message}
                </p>
              )}

              <div className={styles.LogIn_cont_input}>
                <input
                  type="password"
                  name="password"
                  placeholder={t("password")}
                  {...register("password")}
                  className={styles.LogIn_inp}
                />
              </div>
              {errors.password && (
                <p className={styles.errorText}>{errors.password.message}</p>
              )}
              {loginError && (
                <p className={styles.errorText}>{loginError}</p>
              )}
            </div>
            <div className={styles.login_button}>
              <Button text={t("login")} type="submit" />
            </div>
            <div className={styles.login_or}>
              <div className={styles.login_line}></div>
              <p>{t("or")}</p>
              <div className={styles.login_line}></div>
            </div>
            <div className={styles.login_link}>
              <Link to="/reset" className="p_blue">
                {t("forgot_password")}
              </Link>
            </div>
          </form>
        </div>
        <div className={styles.login_bottom}>
          <p className="p_14Small">{t("no_account")}</p>
          <Link to="/signup" className="p_14Blue">
            {t("signup")}
          </Link>
        </div>
        </div>
      </div>
    </FadeTransition>
  );
}

export default LogIn;