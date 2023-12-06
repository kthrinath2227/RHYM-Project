import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useState, useEffect } from 'react';
import axios from 'axios';
// import { Typography, Paper } from '@mui/material';
// import { red } from '@mui/material/colors';



export default function TwoSimplePieChart() {
    const [expenseData, setExpenseData] = useState([]);
    useEffect(() => {
        // Fetch expense data from your API
        const fetchExpenseData = async () => {
          try {
            const response = await axios.get('http://localhost:8000/getExpenseStatusCount'); 
            setExpenseData(response.data);
          } catch (error) {
            console.error('Error fetching expense data:', error);
          }
        };
    
        fetchExpenseData();
      }, []);
    
  return (
    <PieChart
      series={[
    
        {
          data: expenseData.map((item) => ({ label: item._id, value: item.count, color: item.color})),
          cx: 500,
          cy: 200,
          innerRadius: 40,
          outerRadius: 80,
        },
      ]}
      height={300}
      slotProps={{
        legend: { hidden: true },
      }}
    />
  );
}