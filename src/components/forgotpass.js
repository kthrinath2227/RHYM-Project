
import { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');

  const sendVerificationCode = async () => {
    try {
      await axios.post('http://localhost:8000/send-verification-code', { email });
      setShowVerification(true);
      setVerificationStatus('');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setVerificationStatus('User Not Found');
      }
    }
  };

  const changePassword = async () => {
    try {
      await axios.post('http://localhost:8000/change-password', { email, newPassword });
      setVerificationStatus('Password changed successfully');
      // You may want to redirect the user or perform other actions upon successful password change
    } catch (error) {
      console.error('Error changing password:', error);
      setVerificationStatus('Error changing password');
    }
  };

  const verifyCode = async () => {
    try {
      await axios.post('http://localhost:8000/verify-code', { email, code: verificationCode });
      setVerificationStatus('Verification successful');
      changePassword(); // Pass new password to changePassword function
    } catch (error) {
      setVerificationStatus('Invalid verification code');
      console.error('Error verifying code:', error);
    }
  };

  return (
    <div className='bg-container'>
      <div className='card-container'>
      <div className='container_card'>
      <h1>Forgot Password</h1>
      <input placeholder='Enter User Email' className='input' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <button className='button-login' onClick={sendVerificationCode}>Send Verification Code</button>
      <br />
      <p style={{ color: 'red' }}>{verificationStatus}</p>
      {showVerification && (
        <>
          
          <input placeholder='Enter Verification Code' className="input" type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
          <br />
         
          <input placeholder='Enter New Password' className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <br />
          <button className='button-login' onClick={verifyCode}>Update Password</button>
          <p style={{ color: 'red' }}>{verificationStatus}</p>
        </>
      )}
      </div>
    </div>
    </div>
  );
}

export default ForgotPassword;
