import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FadeTransition from "../../components/FadeTransition";
import Trouble from "../../images/svg/Trouble.svg";
import Button from "../../components/button/button";
import { $api } from "../../utils/api.ts";
import styles from "./LogIn.module.css";
import { validateField } from "../../utils/validation";

function Reset() {
  const { t } = useTranslation();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [tempPassword, setTempPassword] = useState(null); // Новый state для временного пароля

  const handleInputChange = (e) => {
    const value = e.target.value;
    setEmailOrUsername(value);
    setError(validateField("emailOrUsername", value, t));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalError = validateField("emailOrUsername", emailOrUsername, t);
    setError(finalError);
  
    if (!finalError) {
      try {
        // console.log("Отправка запроса на сброс пароля...");
        const response = await $api.post("/auth/request-password-reset", { email: emailOrUsername });
        console.log("Ответ сервера:", response.data);
        setTempPassword(response.data.tempPassword); // Установка временного пароля для отображения
        setSuccessMessage("Ваш временный пароль успешно сгенерирован.");
      } catch (error) {
        console.error("Ошибка при запросе на сброс пароля:", error);
        setError(error.response?.data?.message || "Ошибка при отправке запроса на сброс пароля");
      }
    }
  };
  

  // Закрытие модального окна
  const closeModal = () => {
    setTempPassword(null);
  };

  return (
    <FadeTransition>
      <div>
        <div className={styles.LogIn_cont}>
          <div>
            <img src={Trouble} alt="logo" />
          </div>
          <div className={styles.reset_text}>
            <p className="p_16Bold reset_center">{t("trouble")}</p>
            <p className="p_14SmallGrey reset_center">
              {t("enter_email_username")}
            </p>
          </div>
          <form className={styles.Login_form} onSubmit={handleSubmit}>
            <div className={styles.login_cont_inp}>
              <div className={styles.LogIn_cont_input}>
                <input
                  type="text"
                  name="emailOrUsername"
                  placeholder={t("email_or_username")}
                  value={emailOrUsername}
                  onChange={handleInputChange}
                  className={styles.LogIn_inp}
                />
              </div>
              {error && <p className={styles.errorText}>{error}</p>}
              {successMessage && <p className={styles.successText}>{successMessage}</p>}
            </div>
            <div className={styles.login_button}>
              <Button type="submit" text={t("reset_password")} />
            </div>
          </form>
          <div className={styles.login_link}>
            <Link to="/login" className="p_14Bold_black">
              {t("back_to_login")}
            </Link>
          </div>
        </div>

        {tempPassword && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 className="p_16Bold reset_center">Ваш временный пароль:</h2>
              <p className="p_16Bold reset_center">{tempPassword}</p>
              <button onClick={closeModal} className={styles.closeButton}>Close</button>
            </div>
          </div>
        )}
      </div>
    </FadeTransition>
  );
}

export default Reset;
