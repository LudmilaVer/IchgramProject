import { createSlice } from '@reduxjs/toolkit';

// Функция для декодирования JWT токена без использования библиотеки
function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1]; // Берем вторую часть токена
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Ошибка декодирования токена:', error);
    return null;
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    userId: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
  
      const decoded = decodeToken(action.payload);
      console.log("Decoded Token:", decoded); // Лог для проверки
      state.userId = decoded?.user_id || decoded?.id;
      console.log("Set User ID:", state.userId); // Лог для проверки
  },
    // setToken: (state, action) => {
    //   state.token = action.payload;
    //   state.isAuthenticated = true;
    //   localStorage.setItem('token', action.payload);

    //   // Декодируем токен и сохраняем userId
    //   try {
    //     const decoded = decodeToken(action.payload); // Используем альтернативную функцию декодирования
    //     state.userId = decoded?.user_id || decoded?.id; // Попытка получить `user_id` или `id`
    //     console.log('Decoded Token:', decoded);
    //     console.log('Decoded User ID:', state.userId);
    //   } catch (error) {
    //     console.error('Ошибка декодирования токена:', error);
    //   }
    // },
    removeToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userId = null; // Очищаем userId при выходе
      localStorage.removeItem('token');
    },
  },
});

export const { setToken, removeToken } = authSlice.actions;
export default authSlice.reducer;
