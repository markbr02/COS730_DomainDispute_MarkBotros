'use client';
// In your React Application
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';

// Register the chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const CasesPerYearStats = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3000/casesPerType')
      .then(response => {
        if (response.data) {
          const labels = response.data.map((d: { type: { toString: () => any; }; }) => d.type.toString());
          const typeCounts = response.data.map((d: { typeCount: string; }) => parseInt(d.typeCount, 10));


          setChartData({
            labels,
            datasets: [
              {
                type: 'bar',
                label: 'Number of Case Types',
                data: typeCounts,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                borderColor: 'rgba(53, 162, 235, 0.8)',
                borderWidth: 1,
              }
            ],
          });
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const options = {
    scales: {
      y: { beginAtZero: true }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    },
  };

  return (
    <div>
      <h1>Cases Per Type</h1>
      {chartData && chartData.labels ? (
        <Chart type='bar' data={chartData} options={options} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default CasesPerYearStats;
