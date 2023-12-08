import React, { useState, useEffect } from 'react';

import PieChart from './PieChart';
import Barchart from './Barchart';
import DonutChart from './DonutChart';
import axios from 'axios';

const Dashboard = () => {
  const [currentMonthCost, setCurrentMonthCost] = useState(null);
  const [lastMonthCost, setLastMonthCost] = useState(null);

  useEffect(() => {
    const fetchCostData = async () => {
      try {
        const currentMonthResponse = await axios.get('http://localhost:8000/currentMonthCosts');
        setCurrentMonthCost(currentMonthResponse.data.totalCosts);

        const lastMonthResponse = await axios.get('http://localhost:8000/lastMonthCosts');
        setLastMonthCost(lastMonthResponse.data.totalCosts);
      } catch (error) {
        console.error('Error fetching cost data:', error);
      }
    };

    fetchCostData();
  }, []);

  return (
   <div>
   <div className='month-container'>
      <div className='month-card'>Expenses This Month : {currentMonthCost ? `${currentMonthCost}` : '0'} ₹</div>
      <div className='month-card'>Expenses Last Month : {lastMonthCost ? `${lastMonthCost}` : '0'} ₹</div>
   </div>
  <div className='container-card-list'>
   <PieChart />
   <div className='flex-charts'>
   <DonutChart />
   <Barchart />
   </div>
   </div>
    
   </div>
  );
};

export default Dashboard;