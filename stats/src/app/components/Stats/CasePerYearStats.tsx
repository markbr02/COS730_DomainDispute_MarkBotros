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
    axios.get('http://localhost:3000/casesPerYear')
      .then(response => {
        if (response.data) {
          const labels = response.data.map((d: { year: { toString: () => any; }; }) => d.year.toString());
          const caseCounts = response.data.map((d: { caseCount: string; }) => parseInt(d.caseCount, 10));

          // Cumulative count calculation
          const cumulativeCaseCounts = caseCounts.reduce((acc: any[], current: any) => {
            if (acc.length > 0) {
              acc.push(acc[acc.length - 1] + current);
            } else {
              acc.push(current);
            }
            return acc;
          }, []);

          setChartData({
            labels,
            datasets: [
              {
                type: 'bar',
                label: 'Number of Cases',
                data: caseCounts,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                borderColor: 'rgba(53, 162, 235, 0.8)',
                borderWidth: 1,
              },
              {
                type: 'line',
                label: 'Cumulative Cases',
                data: cumulativeCaseCounts,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false,
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
      <h1>Cases Per Year</h1>
      {chartData && chartData.labels ? (
        <Chart type='bar' data={chartData} options={options} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default CasesPerYearStats;
