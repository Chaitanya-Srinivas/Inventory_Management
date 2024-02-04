import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';
import { getToken, getUserId } from './components/Auth/AthSG'; // Corrected import path
import classes from './App.module.css';

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    // Check if token exists in local storage and perform necessary actions
    setToken(getToken());
    setUserId(getUserId());
    if (token && userId) {
      // Token exists, you can perform additional actions if needed
      console.log('Token found:', token);
      console.log('user found:', userId);
    } else {
      // Token doesn't exist, you can perform additional actions if needed
      console.log('Token not found');
    }
  }, [token, userId]); // Ensure to pass an empty dependency array to run this effect only once on mount

  return (
    <Provider store={store}>
      <BrowserRouter>
        <MainNavigation />
        <main className={classes.mainContent}>
          <Routes>
            {/* Use Navigate for redirection */}
            {!token &&<Route path="/" element={<Navigate to="/auth" />} />}
            {!token && <Route path="/auth" element={<AuthPage />} />}
            <Route path="/events" element={<EventsPage />} />

            <Route path="/bookings" element={<BookingsPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
