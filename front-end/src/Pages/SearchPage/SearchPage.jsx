import React, { useState, useEffect } from "react";
import Search from "../../components/search/Search";
import HomePage from "../HomePage/HomePage";
import styles from "./SearchPage.module.css";

function SearchPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={styles.container}>
      <div
        className={`${styles.cont_absolut} ${isVisible ? styles.fadeIn : ""}`}
      >
        <Search />
      </div>
      <div className="back"></div>
      <div className={styles.searchBack}>
        <HomePage />
      </div>
    </div>
  );
}

export default SearchPage;
