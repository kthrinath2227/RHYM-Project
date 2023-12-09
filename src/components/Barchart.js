import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';

export default function SimpleCharts() {
  const [chartData, setChartData] = useState({ xAxis: [], series: [] });
  const barColors = ['#3399FF', '#3399FF', '#33FF33'];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/getApprovedExpensesLast3Months');
        if (response.data.length === 0) {
          setChartData({
            xAxis: [],
            series: [],
          });
          return;
        }
        const formattedData = response.data.map(entry => ({
          month: entry._id,
          totalAmount: entry.totalAmount,
        }));

        const xAxisData = formattedData.map(entry => entry.month);
        const seriesData = formattedData.map(entry => entry.totalAmount);

        setChartData({
          xAxis: [
            {
              id: 'barCategories',
              data: xAxisData,
              scaleType: 'band',
            },
          ],
          series: [
            {
              data: seriesData,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div className='Piechart-Container barchat-container '>
    <div className='card-paper-1'>
    <h2>monthly Expenses</h2>
    {chartData.xAxis.length > 0 && chartData.series.length > 0 ? (
      <BarChart
        xAxis={chartData.xAxis}
        series={chartData.series}
        width={400}
        height={390}
        colors={barColors}
      />
    ) : (
      <div> 
      </div>
    )}
    </div>
  </div>
  );
}