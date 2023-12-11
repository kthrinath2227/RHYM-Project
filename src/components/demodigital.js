import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';
import axios from 'axios';

const chartSetting = {
  yAxis: [
    {
      label: 'Amount (in currency)',
    },
  ],
  width: 900,
  height: 400,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)',
    },
  },
};

const valueFormatter = (value) => `${value}`;

export default function BarsDataset() {
  const [expenseSummary, setExpenseSummary] = React.useState([]);

  React.useEffect(() => {
    axios.get('http://localhost:8000/getExpenseSummaryByCategory')
      .then((response) => {
        console.log('Response Data:', response);
        setExpenseSummary(response.data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
  

  // Transform the expenseSummary data into the format expected by BarChart
  const transformedData = Object.entries(expenseSummary).map(([month, data]) => ({
    month,
    ...data,
  }));

  const series = Object.keys(transformedData[0] || {}).filter((key) => key !== 'month');
  console.log('Series Configuration:', series);


  return (
    <div className='Piechart-Container-1 cot'>
      <div className='card-paper-1'>
        {transformedData.length > 0 ? (
          <BarChart
            dataset={transformedData}
            xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
            series={series.map((key) => ({
              dataKey: key,
              label: key.charAt(0).toUpperCase() + key.slice(1),
              valueFormatter,
            }))}
            {...chartSetting}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
  
}