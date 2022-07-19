import React, { useState, useEffect } from 'react';
import FirebaseAuthService from '../FirebaseAuthService';

function LoginForm({ existingUser }) {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    console.log(existingUser); 
  }, [existingUser])

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await FirebaseAuthService.loginUser(username, password);
      setUserName('');
      setPassword('');
    } catch (error) {
      alert(error.message);
    }
  }

  function handleLogout() {
    FirebaseAuthService.logoutUser();
  }

  return (
    <div className="login-form-container">
      {existingUser ? (
        <div className="row">
          <h3>Welcome, {existingUser.email}</h3>
          <button
            type="button"
            className="primary-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="login-form">
          <label className="input-label login-label">
            Email:
            <input
              type="email"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="input-text"
              required
            ></input>
          </label>
          <label className="input-label login-label">
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-text"
              required
            ></input>
          </label>
          <div className="button-box">
            <button className="primary-button">Submit</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default LoginForm;
