import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import postReducer from './slices/postSlice';
import likeReducer from './slices/likeSlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    post: postReducer,
    likes: likeReducer,
    notifications: notificationReducer,
  },
});

export default store;
