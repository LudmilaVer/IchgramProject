// AuthContainer.js
import React from "react";
import styles from './LogIn.module.css';
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";


function AuthContainer() {
  const { i18n } = useTranslation();
  //   const [fadeIn, setFadeIn] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       setFadeIn(true);
  //     }, 500);
  //     return () => clearTimeout(timer);
  //   }, []);

  return (
    // <div className={`${styles.LogIn_container} ${fadeIn ? styles['fade-in'] : ''}`}>
    <div className={styles.LogIn_container}>
      <div className={styles.languageSwitcher}>
        <button onClick={() => changeLanguage("en")}>EN</button>
        <button onClick={() => changeLanguage("ru")}>RU</button>
      </div>
      
        <Outlet />
      
    </div>
  );
}

export default AuthContainer;
