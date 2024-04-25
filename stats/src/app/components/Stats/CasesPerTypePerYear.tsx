'use client'
// CasesPerTypePerYear.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';

// Register the chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CasesPerTypePerYear = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3000/casesPerTypePerYear')
      .then(response => {
        // Filter out entries where the year is 0
        const filteredData = response.data.filter((d: { year: number; }) => d.year !== 0);

        // Create a unique list of years and types
        const years = Array.from(new Set(filteredData.map((d: { year: any; }) => d.year))).sort((a, b) => a - b);
        const types = Array.from(new Set(filteredData.map((d: { type: any; }) => d.type)));

        // Predefined colors for the chart
        const colors = [
          'rgba(255, 99, 132, 0.5)', // red
          'rgba(54, 162, 235, 0.5)', // blue
          'rgba(255, 206, 86, 0.5)', // yellow
          'rgba(75, 192, 192, 0.5)', // green
          'rgba(153, 102, 255, 0.5)', // purple
          'rgba(255, 159, 64, 0.5)', // orange
          // ...add more colors as needed
        ];

        // Create the datasets
        const datasets = types.map((type, index) => ({
          label: type,
          data: years.map(year => {
            const entry = filteredData.find((d: { year: unknown; type: unknown; }) => d.year === year && d.type === type);
            return entry ? parseInt(entry.typeCount, 10) : 0;
          }),
          backgroundColor: colors[index % colors.length], // Use the color for this dataset
          stack: 'Stack 0',
        }));

        setChartData({
          labels: years,
          datasets: datasets,
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Cases per Type per Year',
      },
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h1>Cases Per Type Per Year</h1>
      {chartData.labels ? (
        <Chart type="bar" data={chartData} options={options} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default CasesPerTypePerYear;
