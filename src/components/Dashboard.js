import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
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
     <Grid container spacing={3}>
      <Grid className="Typography-container" item xs={12} md={5} m={2}>
        <Typography variant="h6">Expenses This Month : {currentMonthCost ? `${currentMonthCost}` : '0'} ₹ </Typography>
        
      </Grid>
      <Grid className="Typography-container" item xs={12} md={5} m={2}>
        <Typography variant="h6">Expenses Last Month : {lastMonthCost ? `${lastMonthCost}` : '0'} ₹ </Typography>
      </Grid>
      <Grid item xs={12}>
        <PieChart />
      </Grid>
      <Grid item xs={12}>
        <DonutChart />
      </Grid>
      <Grid item xs={12}>
        <Barchart />
      </Grid>
     
    </Grid>
   </div>
  );
};

export default Dashboard;