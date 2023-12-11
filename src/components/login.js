import axios from 'axios';
import { useState , useEffect} from 'react';
import Register from './Rejester';
import { useNavigate } from 'react-router';
import ForgotPassword from './forgotpass';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useUser } from './UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setForgotPassword] = useState(false);
  const notify = () => toast('logged successfully');
  const notify1 = () => toast('Login Failed');
  const nav = useNavigate();
  const { setUser, user } = useUser(); 




  useEffect(() => {
    if (user && (user.role === 'User' || user.role === 'Admin')) {
      if (user.role === 'User') {
        nav("/Slider");
      } else if (user.role === 'Admin') {
        nav("/ExpenseApproval");
      }
    }
  }, [user, nav]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/login', { email, password });
      console.log('Server Response:', response);
      console.log('Role from Response:', response.data.role);

      localStorage.setItem('token', response.data.token);
      setUser({ email, role: response.data.role });
      notify();
    
      console.log("done ")


    } catch (err) {
      console.error('Login Error:', err);
      notify1();
    }
  };

  if (showRegister) {
    return <Register />;
  }
  if (showForgotPassword) {
    return <ForgotPassword/>
  }

  return (
    <div className='bg-container'>
      <div className='card-container'>
        <div className='container_card'>
          <div className='head-cintainer'>
            <h2>Login</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              className='input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Registered Email"
            />
            <br/>
            <input
              className='input'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            <button type="button"
                    className='toggle-password-button'
                    onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

            <br/>
            <div className='btn-container'>
              <button className='button-login' type="submit" >
                Login
              </button>
              <button
                className='button-login'
                type="button"
                onClick={() => setShowRegister(true)}
              >
                SignUp
              </button>
              <br/>
              <label onClick={() => setForgotPassword(true)} >Forgot Password ..?</label>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Login;
