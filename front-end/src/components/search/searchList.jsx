import React from "react";
import { Link } from "react-router-dom";
// import styles from "../notifications/notifications.module.css";
import styles from "./search.module.css";

function SearchList({ user }) {
  return (
    <div className={styles.notific_list}>
      <Link to={`/profuser/${user._id}`} className={styles.search_li}>
        <button className={`${styles.search_btn} notific_btn`}>
          <div className={styles.notific_img}>
            <img
              src={user.profile_image || "path/to/default/avatar.jpg"}
              alt="avatar"
            />{" "}
          </div>
        </button>
        <div className={styles.notific_btn_text}>
          <p className="p_14Bold">{user.username}</p>
        </div>
      </Link>
    </div>
  );
}

export default SearchList;
