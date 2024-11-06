import React, { useEffect, useState } from 'react';
import { getBarChart } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { AiOutlineBarChart } from 'react-icons/ai';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const BarChart = ({ month }) => {
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getBarChart({ month });
      setBarChartData(data);
    };
    fetchData();
  }, [month]);

  const data = {
    labels: ['0-100', '101-200', '201-300', '301-400', '401-500', '501-600', '601-700', '701-800', '801-900', '901-above'],
    datasets: [
      {
        label: 'Number of Items',
        data: barChartData.map(item => item.count),
        backgroundColor: 'rgba(254,240,138,0.8)', // Soft, warm yellow with a touch of transparency
        borderColor: 'rgb(254,240,138)', // Matching border color for a cohesive look
        borderRadius: 10, // Rounded corners for a modern aesthetic
        borderSkipped: false, // Ensure all bars have a border
        hoverBackgroundColor: 'rgba(254,240,138,1)', // Increase opacity on hover for a nice effect
        hoverBorderColor: 'rgb(254,240,138)', // Matching hover border color
      },
    ],
  };

  return (
    <div className='w-full h-full p-6 bg-white rounded-2xl shadow-2xl flex flex-col items-center animate-fade-in'>
      <div className='flex items-center mb-4'>
        <AiOutlineBarChart size={24} className='text-gray-500 mr-2' />
        <h3 className='text-2xl font-bold text-gray-900'>Bar Chart - <strong>{month}</strong></h3>
      </div>
      <Bar data={data} options={{
        scales: {
          y: {
            beginAtZero: true, // Ensure the y-axis starts at 0 for better readability
            grid: {
              drawTicks: false, // Remove grid ticks for a cleaner look
            },
          },
          x: {
            grid: {
              drawTicks: false, // Remove grid ticks for a cleaner look
            },
          },
        },
        plugins: {
          legend: {
            display: true, // Display the legend for better understanding
            position: 'top', // Position the legend at the top for a clean look
            labels: {
              font: {
                size: 14, // Increase legend font size for better readability
              },
            },
          },
        },
        animation: {
          duration: 2000, // Animate the chart over 2 seconds
        },
        hover: {
          animationDuration: 500, // Animate hover effects over 0.5 seconds
        },
      }} />
    </div>
  );
}

export default BarChart