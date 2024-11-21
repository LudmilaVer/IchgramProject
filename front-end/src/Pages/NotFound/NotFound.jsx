import React from "react";
import { Link } from "react-router-dom";
import BG from "../../images/png/Background111.png";

import styles from "./NotFound.module.css";

function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.rigth}>
        <img src={BG} alt="img" />
      </div>
      <div className={styles.left}>
        <h1 className={styles.h1}>Page Not Found</h1>
        <p className={styles.p_error}>
          We're sorry, but the page you're looking for doesn't seem to exist. <br /> <br /> If
          you typed the URL manually, please double-check the spelling. <br /> <br />If you
          clicked on a link, it may be outdated or broken.
        </p>
        <Link to="/home" className={styles.btn}>Home</Link>
      </div>
    </div>
  );
}

export default NotFound;
