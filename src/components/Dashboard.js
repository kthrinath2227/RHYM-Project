import React, { useState, useEffect } from 'react';
import { Card, } from '@mui/material';
import PieChart from './PieChart';
import Barchart from './Barchart';
import DonutChart from './DonutChart';
import axios from 'axios';
import BarsDataset from './digitalComponent';

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
   <Card style={{padding:'10px'}}>
   <div className='month-container'>
      <div className='month-card'>Expenses This Month : {currentMonthCost ? `${currentMonthCost}` : '0'} ₹</div>
      <div className='month-card'>Expenses Last Month : {lastMonthCost ? `${lastMonthCost}` : '0'} ₹</div>
   </div>
  <div className='container-card-list'>
   <div className='flex-charts'>
   <PieChart />
   <Barchart />
   </div>
   <div className='flex-charts'>
   <DonutChart />
   <BarsDataset/>
   </div>
   </div>
   </Card>
    
   </div>
  );
};

export default Dashboard;