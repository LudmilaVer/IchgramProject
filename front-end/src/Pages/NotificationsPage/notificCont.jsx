import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NotifList from "./notifList";
import { fetchNotifications } from "../../store/slices/notificationSlice";
// import { fetchUsers } from "../../store/slices/userSlice";
import styles from "./notifications.module.css";

function NotificCont() {
  const dispatch = useDispatch();
  // const users = useSelector((state) => state.user.users);
  const currentUserId = useSelector((state) => state.user.currentUser?._id);
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );

  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchNotifications(currentUserId));
    }
  }, [dispatch, currentUserId]);

  // const otherUsers = users.filter((user) => user._id !== currentUserId);

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.user && // Исключаем уведомления без пользователя
      notification.user._id !== currentUserId // Исключаем уведомления от текущего пользователя
  );

  return (
    <div className="notific">
      <h2>Notifications</h2>
      <p className="p_14Bold">New</p>
      <div className={styles.notific_list}>
        {filteredNotifications.map((notification) => (
          <NotifList key={notification._id} notification={notification} />
        ))}
      </div>
    </div>
  );
}

export default NotificCont;
