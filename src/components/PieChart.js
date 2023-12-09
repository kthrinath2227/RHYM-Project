import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts';
import axios from 'axios';

const PieChartComponent = () => {
  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {
    // Fetch expense data from your API
    const fetchExpenseData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/getExpenseDataMonthwise'); 
        setExpenseData(response.data);
      } catch (error) {
        console.error('Error fetching expense data:', error);
      }
    };

    fetchExpenseData();
  }, []);

  const getChartData = () => {
    return [
      {
        data: expenseData.map((expense, index) => ({
          id: index,
          value: expense.totalAmount,
          label: expense._id,
        })),
      },
    ];
  };

  return (
    <div className="Piechart-Container">
      <div className='card-paper'>
        <h2>Expenses Category Wise</h2>
        {expenseData.length > 0 ? (
          <PieChart
            series={getChartData()}
            width={500}
            height={300}   
          />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default PieChartComponent;
