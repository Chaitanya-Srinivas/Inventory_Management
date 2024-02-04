// Auth.js

export const login = (token) => {
    localStorage.setItem('token', token);
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
  };
  
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  export const getUserId = () => {
    return localStorage.getItem('userId');
  };
  
