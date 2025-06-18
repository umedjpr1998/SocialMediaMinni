import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import HomePage from './Components/HomePage';
import AddPhotoPage from './Components/AddPhotoPage';
import { PhotoProvider } from './Components/PhotoContext';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('isLoggedIn');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <PhotoProvider>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/add-photo" element={<PrivateRoute><AddPhotoPage /></PrivateRoute>} />
      </Routes>
    </PhotoProvider>
  );
}

export default App;
