// src/components/itcareer/ItCareerList.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLastMessageForUser } from "../../store/slices/userSlice";
import styles from "./ItCareer.module.css";
import Nik from "../../images/png/empty.jpg";
import { getTimeAgo } from "../../utils/time";


function ItCareerList({ user, onSelectUser, isActive }) {
  const dispatch = useDispatch();
  const lastMessage = useSelector((state) => state.user.lastMessages[user._id]);

  useEffect(() => {
    if (!lastMessage) {
      dispatch(fetchLastMessageForUser(user._id));
    }
  }, [dispatch, user._id, lastMessage]);

  return (
    <button
      className={`${styles.cont_button} ${isActive ? styles.active : ""}`}
      onClick={() => onSelectUser(user)}
    >
      <div className={styles.cont_li}>
        <div className={styles.cont_li_img}>
          <img src={user.profile_image || Nik} alt="img" />
        </div>
        <div className={styles.cont_li_text}>
          <p className="p_14Small">{user.username || "User"}</p>
          <div className={styles.cont_li_p}>
            <p className={`${styles.lastMessage} p_12SmallGrey`}>
              {lastMessage?.lastMessageText || "No messages"}
            </p>
            
          </div>
          <p className={`${styles.p_cont_li} p_10_400`}>{lastMessage?.lastMessageDate ? getTimeAgo(lastMessage.lastMessageDate) : "N/A"}</p>
        </div>
      </div>
    </button>
  );
}

export default ItCareerList;
