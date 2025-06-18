import React, { createContext, useState, useEffect } from 'react';

export const PhotoContext = createContext();

export const PhotoProvider = ({ children }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      const storedPhotos = JSON.parse(localStorage.getItem(`photos_${loggedInUser.name}`)) || [];
      setPhotos(storedPhotos);
    }
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      localStorage.setItem(`photos_${loggedInUser.name}`, JSON.stringify(photos));
    }
  }, [photos]);

  return (
    <PhotoContext.Provider value={{ photos, setPhotos }}>
      {children}
    </PhotoContext.Provider>
  );
};
