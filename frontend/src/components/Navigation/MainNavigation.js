import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import classes from './MainNavigate.module.css';
import { logout, getToken } from '../Auth/AthSG'; // Corrected import path

const MainNavigation = () => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Check if token exists in local storage and perform necessary actions
    setToken(getToken());
  }, []);

  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear token from local storage and Redux store
    logout();
    navigate('/auth');
    window.location.reload();
    // Optionally, dispatch logout action to update Redux state
    // dispatch({ type: 'LOGOUT' });
  };

  return (
    <header className={classes.mainNavigation}>
      <div className={classes.mainNavigationLogo}>
        <h1>Products</h1>
      </div>
      <nav className={classes.mainNavigationItems}>
        <ul>
          {!token && (
            <li>
              <NavLink to="/auth">Authenticate</NavLink>
            </li>
          )}
          {token && (
            <React.Fragment>
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              {token && <li>
                <button onClick={handleLogout}>Logout</button>
              </li>}
            </React.Fragment>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
