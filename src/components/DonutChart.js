import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useState, useEffect } from 'react';
import axios from 'axios';




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
      <div className='Piechart-Container-1'>
        <div className='card-paper '>
        <h2>Status Report</h2>
          <div className='card-paper'>
          <PieChart
      series={[
    
        {
          data: expenseData.map((item) => ({ label: item._id, value: item.count, color: item.color})),
          innerRadius: 50,
          outerRadius: 100,
          paddingAngle: 5,
          cornerRadius: 5,
          startAngle: -90,
          endAngle: 180,
           
        },
      ]}
      height={400}
      width={460}
      slotProps={{
        legend: { hidden: true },
      }}
    />
  
 
    
    
    </div>
    </div>
    </div>
    
  );
}