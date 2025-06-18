import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './SignUp.css';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast


function SignUp() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!validatePassword(userData.password)) {
      setError(
        'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.'
      );
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      console.log(response.data); // optional
      setError('');
      // Show success toast with options
      toast.success('Signup successful!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="body">
      <ToastContainer />
      <div className="signupForm">
        <h1 className="header">Chopal</h1>
        <p className="text">Sign up to see photos and videos from your friends.</p>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" className="input" value={userData.name} onChange={handleChange} required />

          <input type="text" name="email" placeholder="User Email" className="input" value={userData.email} onChange={handleChange} required />

          <div className="passwordField"> <input type={passwordVisible ? 'text' : 'password'} name="password" placeholder="Password" className="input" value={userData.password} onChange={handleChange} required />

            <button type="button" className="eyeButton" onClick={() => setPasswordVisible(!passwordVisible)} >   <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} /></button>
          </div>
          <div className="passwordField">
            <input type={confirmPasswordVisible ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" className="input" value={userData.confirmPassword} onChange={handleChange} required
            />
            <button type="button" className="eyeButton" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            ><FontAwesomeIcon icon={confirmPasswordVisible ? faEye : faEyeSlash} /> </button>

          </div>
          <p className="text">People who use our service may have uploaded your contact information to.{' '}
            <a href="#learn-more" className="link">Learn more</a></p>

          <p className="terms">By signing up, you agree to our{' '}
            <a href="#terms" className="link">  Terms</a>,{' '}
            <a href="#privacy" className="link">Privacy Policy</a>, and{' '}
            <a href="#cookies" className="link">Cookies Policy</a>.
          </p>

          <button className="button" type="submit">Sign Up</button>

        </form>
        <div className="separator">
          <div className="separatorLine"></div>
          <span className="separatorSpan">OR</span>
          <div className="separatorLine"></div>
        </div>

        <div className="loginRedirect">Have an account?{' '}<a href="login" className="link">Log in</a>

        </div>
      </div>
    </div>
  );
}

export default SignUp;
