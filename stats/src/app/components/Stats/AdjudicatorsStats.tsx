'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registering components necessary for the Bar chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AdjudicatorStats {
  totalAdjudicators: number;
  traineeAdjudicators: number;
}

const AdjudicatorsStats = () => {
  const [data, setData] = useState<AdjudicatorStats | null>(null);

  useEffect(() => {
    axios.get('http://localhost:3000/adjudicators')
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Function to determine if the chart should be rendered
  const shouldRenderChart = () => {
    return data && (data.totalAdjudicators > 0 || data.traineeAdjudicators > 0);
  };

  // Create chartData only if data is not null
  const chartData = data ? {
    labels: ['Total Adjudicators', 'Trainee Adjudicators'],
    datasets: [
      {
        label: 'Number of Adjudicators',
        data: [data.totalAdjudicators, data.traineeAdjudicators],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  } : null;

  return (
    <div>
      <h1>Adjudicators Statistics</h1>
      {/* Render the Bar chart only if shouldRenderChart returns true */}
      {shouldRenderChart() ? (
        <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
      ) : (
        data ? <p>No sufficient data to display chart.</p> : <p>Loading data...</p>
      )}
    </div>
  );
};

export default AdjudicatorsStats;
