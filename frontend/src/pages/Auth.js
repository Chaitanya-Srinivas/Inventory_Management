import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classes from './Auth.module.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    let requestBody = {};
    if (isLogin) {
      requestBody = {
        query: `
          query {
            login(email: "${email}", password: "${password}") {
              userId
              token
              tokenExpiration
            }
          }
        `,
      };
    } else {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: { email: "${email}", password: "${password}" }) {
              _id
              email
            }
          }
        `,
      };
    }

    try {
      const response = await axios.post('http://localhost:4000/graphql', requestBody);
      const responseData = response.data;
      if (isLogin) {
        const { userId, token, tokenExpiration } = responseData.data.login;
        // Set token in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        console.log(token)
        navigate('/events');
        window.location.reload();
        
        // Dispatch action to store token in Redux state
        // dispatch({ type: 'LOGIN', payload: { userId, token, tokenExpiration } });
      }
      // navigate('/');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={submitHandler} className={classes.authForm}>
      <div className={classes.formControl}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={classes.formControl}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className={classes.formActions}>
        <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          Switch to {isLogin ? 'Signup' : 'Login'}
        </button>
      </div>
    </form>
  );
};

export default Auth;
