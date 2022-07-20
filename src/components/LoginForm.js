import React, { useState, useEffect } from 'react';
import FirebaseAuthService from '../FirebaseAuthService';

function LoginForm({ existingUser }) {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await FirebaseAuthService.loginUser(username, password);
      setUserName('');
      setPassword('');
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  }

  function handleLogout() {
    FirebaseAuthService.logoutUser();
  }

  async function handleSendResetPasswordEmail() {
    if (!username) {
      setError('Missing Username!');
      return;
    }

    try {
      await FirebaseAuthService.sendPasswordResetEmail(username);
      setError('The password reset email has been sent!');
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleLoginWithGoogle() {
    try {
      await FirebaseAuthService.loginWithGoogle();
    } catch (error) {
      setError(error.message);
    }
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
            Username (email):
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
            <button className="primary-button" type="submit">
              Login
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={handleLoginWithGoogle}
            >
              Login with Google
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={handleSendResetPasswordEmail}
            >
              Reset Password
            </button>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: 'red' }}>
              {error ? error : ''}
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

export default LoginForm;
