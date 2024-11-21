// NotifList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./notifications.module.css";
import Avatar from "../../images/png/empty.jpg";
import { getTimeAgo } from "../../utils/time";

function NotifList({ notification }) {
  const navigate = useNavigate();
  const user = notification.user || {}; // Защита от отсутствующего user

  const notificationImage =
    notification.type === "like"
      ? notification.post_id?.image_url || Avatar // Изображение поста, если это лайк
      : user.profile_image || Avatar; // Аватар пользователя, если это подписка
  
  console.log(notification);

  const handleClick = () => {
    if (user._id) {
      navigate(`/profuser/${user._id}`);
    }
  };

  return (
    <div className={styles.notific_list_cont} onClick={handleClick} >
      <li className={styles.notific_li}>
        <button className={`${styles.notificBtnAva} notific_btn`}>
          <img src={user.profile_image || Avatar} alt="avatar" />
        </button>
        <div className={styles.notific_btn_text}>
          <p className="p_14Small">
            <span className="p_14Bold">{user.username || "User"}</span>{" "}
            {notification.type === 'like' ? "liked your post" : "followed you"}
          </p>
          <p className="p_14SmallGrey">
            <p className="p_14SmallGrey">{getTimeAgo(notification.created_at)}</p>
          </p>
        </div>
        {notification.type === 'like' && (
          <div className={styles.notific_li_img}>
            <img src={notificationImage} alt="post" />
          </div>
        )}
      </li>
    </div>
  );
}

export default NotifList;
