
import './App.css';
import Slider from './components/Slider';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Login from './components/login';
import ExpenseApproval from './components/ExpenseApproval';
import BarsDataset from './components/demodigital';


function App() {
  return (
    <UserProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path='/Slider' element={<Slider/>} />
        <Route path='/ExpenseApproval' element={<ExpenseApproval/>} />
        <Route path="/BarsDataset" element={<BarsDataset/>} />
      </Routes>
    </Router>
    </UserProvider>  );
}

export default App;
