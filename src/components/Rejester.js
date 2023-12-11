import { useState } from 'react';
import { register } from './Service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './login';
import { FaEye, FaEyeSlash } from 'react-icons/fa';







function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showRegister, setShowRegister] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const notify = () => toast('Registed successfully');



  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setEmailError('');
    setPasswordError('');

    // Email and Password validation
    if (!formData.email || !isValidEmail(formData.email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setPasswordError('Password should be at least 6 characters long.');
      return;
    }

    register(formData);
    notify();
    setFormData({
      email:"",
      password:"",
    })

    
  };

  if (showRegister) {  
    return <Login />;
  }

  return (
    <div className='bg-container'>
      <div className='card-container'>
        <div className="container_card">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
              <input
                className='input'
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter New Email"
              />
              {emailError && <div className="error-message">{emailError}</div>}
              
              <div className="password-input-container">
                <input
                  className='input'
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter New Password"
                />
                <button type='button'
                  className='toggle-password-button'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {passwordError && <div className="error-message">{passwordError}</div>}
    
              <div className='btn-container'>
                <button className='button-login' type="submit" >Register</button>
                <button className='button-login' onClick={() => setShowRegister(true)}>Login</button>
              </div>
            </form>
          <ToastContainer/>
        </div>
      </div>
    </div>
  );
}

export default Register;
