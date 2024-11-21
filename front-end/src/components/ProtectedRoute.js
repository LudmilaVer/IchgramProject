// ProtectedRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token || localStorage.getItem('token'));
  const isAuthenticated = Boolean(token); // Если токен есть, считаем, что авторизация пройдена

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
