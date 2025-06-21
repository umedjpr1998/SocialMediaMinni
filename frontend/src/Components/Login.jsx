import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailForOtp, setEmailForOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // ✅ UPDATED LOGIN FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://socialmediaminni.onrender.com/api/login', credentials);
      // const response = await axios.post('http://localhost:5000/api/login', credentials);

      console.log('Login success:', response.data);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(response.data.user || {}));

      // Show success toast
      toast.success('Login successful!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/send-otp', { email: emailForOtp });

      if (response.data.success) {
        setOtpSent(true);
        setError('');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Error sending OTP. Please try again later.');
    }
  };

  const handleVerifyOtpAndReset = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', {
        email: emailForOtp,
        otp,
        newPassword,
      });

      if (response.data.success) {
        setOtpMode(false);
        setOtpSent(false);
        setError('Password reset successful! You can now log in.');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Error verifying OTP. Please try again later.');
    }
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#fafafa',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      margin: 0,
    },
    loginForm: {
      backgroundColor: '#fff',
      border: '1px solid #dbdbdb',
      padding: '20px',
      width: '350px',
      textAlign: 'center',
      borderRadius: '8px',
    },
    logo: {
      fontFamily: '"Billabong", cursive',
      fontSize: '50px',
      color: '#262626',
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '8px 0',
      border: '1px solid #dbdbdb',
      borderRadius: '4px',
      fontSize: '14px',
    },
    button: {
      backgroundColor: '#0095f6',
      color: 'white',
      border: 'none',
      padding: '10px 0',
      width: '100%',
      fontSize: '14px',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '10px 0',
    },
    separator: {
      display: 'flex',
      alignItems: 'center',
      margin: '20px 0',
    },
    separatorLine: {
      flex: 1,
      height: '1px',
      backgroundColor: '#dbdbdb',
    },
    separatorText: {
      fontSize: '12px',
      color: '#8e8e8e',
      margin: '0 10px',
    },
    footer: {
      marginTop: '15px',
      fontSize: '14px',
    },
    link: {
      color: '#0095f6',
      textDecoration: 'none',
    },
    eyeButton: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#0095f6',
      cursor: 'pointer',
      fontSize: '14px',
    },
    passwordField: {
      position: 'relative',
    },
  };

  return (
    <div style={styles.container}>
      <ToastContainer /> {/* Add ToastContainer here */}

      <div style={styles.loginForm}>
        {!otpMode ? (
          <>
            <h1 style={styles.logo}>Chopal</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="User Email"
                style={styles.input}
                value={credentials.email}
                onChange={handleChange}
                required
              />
              <div style={styles.passwordField}>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  style={styles.input}
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" style={styles.eyeButton} onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                </button>
              </div>
              <button type="submit" style={styles.button}>
                Log in
              </button>
            </form>

            <div style={styles.separator}>
              <div style={styles.separatorLine}></div>
              <span style={styles.separatorText}>OR</span>
              <div style={styles.separatorLine}></div>
            </div>

            <button
              style={{ ...styles.button, backgroundColor: '#f0f0f0', color: '#0095f6' }}
              onClick={() => setOtpMode(true)}
            >
              Forgot Password?
            </button>

            <div style={styles.footer}>
              Don't have an account?{' '}
              <a href="/" style={styles.link}>
                Sign up
              </a>
            </div>
          </>
        ) : (
          <>
            <h1 style={styles.logo}>Chopal</h1>
            <h1 style={{ fontSize: '20px', marginTop: '60px' }}>Forgot Password</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!otpSent ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={styles.input}
                  value={emailForOtp}
                  onChange={(e) => setEmailForOtp(e.target.value)}
                />
                <button style={styles.button} onClick={handleSendOtp}>
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  style={styles.input}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Enter new password"
                  style={styles.input}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button style={styles.button} onClick={handleVerifyOtpAndReset}>
                  Reset Password
                </button>
              </>
            )}

            <button
              style={{ ...styles.button, backgroundColor: '#f0f0f0', color: '#0095f6' }}
              onClick={() => setOtpMode(false)}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
