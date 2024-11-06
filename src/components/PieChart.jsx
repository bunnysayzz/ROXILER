import React, { useEffect, useState } from 'react';
import { getPieChart } from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { FaChartPie } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ month }) => {
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getPieChart({ month });
      setPieChartData(data);
    };
    fetchData();
  }, [month]);

  const data = {
    labels: pieChartData.map(item => item._id),
    datasets: [
      {
        label: '# of Items',
        data: pieChartData.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const total = pieChartData.reduce((acc, current) => acc + current.count, 0);

  return <div className='w-full max-w-xs p-4 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center animate-fade-in'>
    <div className='flex items-center mb-4'>
      <FaChartPie size={24} className='text-gray-500 mr-2' />
      <h3 className='text-lg font-bold text-gray-900'>Pie Chart</h3>
      <h4 className='text-sm font-medium text-gray-600 ml-2'>- {month}</h4>
    </div>
    <Pie data={data} options={{
      animation: {
        duration: 2000, // Animate the chart over 2 seconds
      },
      plugins: {
        legend: {
          display: true, // Display the legend for better understanding
          position: 'top', // Position the legend at the top for a clean look
          labels: {
            font: {
              size: 12, // Increase legend font size for better readability
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const percentage = (context.parsed / total) * 100;
              return `${context.label}: ${percentage.toFixed(2)}%`;
            },
          },
        },
      },
    }} />
  </div>;
}

export default PieChart