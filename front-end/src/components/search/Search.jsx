import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../store/slices/userSlice';


import SearchList from './searchList';
import SearchBtn from '../../images/svg/Button-search.svg';

import styles from './search.module.css';


function Search() {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const users = useSelector((state) => state.user.users); // Достаем всех пользователей из состояния Redux

    useEffect(() => {
        // Загружаем пользователей при первом рендере компонента
        dispatch(fetchUsers());
      }, [dispatch]);

      // Фильтруем пользователей на основе введенного текста в поле поиска
  const filteredUsers = users.filter((user) =>
  user.username.toLowerCase().includes(searchTerm.toLowerCase())
);

return (
    <div className='notific'>
      <h2>Search</h2>
      <div className={styles.search_inp}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Обновляем состояние при вводе текста
        />
        <button><img src={SearchBtn} alt="X" /></button>
      </div>
      <p className='p_16Bold'>Recent</p>
      <div className={styles.search_list}>
        {filteredUsers.map((user) => (
          <SearchList key={user._id} user={user} /> // Передаем пользователя в компонент SearchList
        ))}
      </div>
    </div>
  );
}
export default Search;