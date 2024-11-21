// button.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "./button.module.css";

function Button({ text, onClick, path, type = "button" }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    if (path) {
      e.preventDefault();
      navigate(path);
    }
  };

  return (
    <button type={type} className={styles.button_1} onClick={handleClick}>
      {t(text)}
    </button>
  );
}

export default Button;
