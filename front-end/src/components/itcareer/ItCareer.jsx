// src/components/itcareer/ItCareer.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, fetchLastMessageDate } from "../../store/slices/userSlice";
import ItCareerList from "./itcareer_list";

import styles from "./ItCareer.module.css";

function ItCareer({ onSelectUser, activeUserId }) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const authUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    dispatch(fetchUsers()); // Загружаем список пользователей
  }, [dispatch]);

  // Загружаем время последнего сообщения для каждого пользователя
  useEffect(() => {
    users.forEach((user) => {
      if (user._id !== authUser._id) {
        dispatch(fetchLastMessageDate(user._id));
      }
    });
  }, [users, authUser, dispatch]);

  // Фильтрация и сортировка пользователей по времени последнего сообщения
  const filteredAndSortedUsers = users
    .filter((user) => user._id !== authUser?._id) // Исключаем авторизованного пользователя
    .sort((a, b) => {
      const dateA = a.lastMessageDate ? new Date(a.lastMessageDate) : new Date(0);
      const dateB = b.lastMessageDate ? new Date(b.lastMessageDate) : new Date(0);
      return dateB - dateA; // Сортируем по убыванию даты последнего сообщения
    });

  return (
    <div className={styles.container}>
      <div className={styles.cont_up}>
        <button className="h3">message</button>
      </div>
      <div className={styles.cont_list}>
      {filteredAndSortedUsers.map((user) => (
          <ItCareerList
            key={user._id}
            user={user}
            onSelectUser={onSelectUser}
            isActive={user._id === activeUserId} // Передаем активное состояние
          />
        ))}
      </div>
    </div>
  );
}

export default ItCareer;
