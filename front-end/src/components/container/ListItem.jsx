import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Ava from "../../images/png/empty.jpg"
import styles from "./container.module.css";

function ListItem({ icon, activeIcon, textKey, path, className }) {
  const { t } = useTranslation();

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        isActive
          ? `${styles.container_li} ${styles.active} ${className || ''}`
          : `${styles.container_li} ${className || ''}`
      }
    >
      {({ isActive }) => (
        <div className={`${styles.container_li_img} ${className || ''}`}>
          {textKey === "profile" ? (
            <div className={styles.avaImg}>
              <img
                src={icon || Ava}
                alt="User Avatar"
                className={styles.profileAvatar}
              />
            </div>
          ) : (
            <img src={isActive ? activeIcon : icon} alt="icon" />
          )}
          <div className={styles.container_li_text}>
            <p>{t(textKey)}</p>
          </div>
        </div>
      )}
    </NavLink>
  );
}

export default ListItem;
