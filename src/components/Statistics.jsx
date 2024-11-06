import React, { useEffect, useState } from 'react'
import { getStatistics } from '../services/api';
import { FaCalculator, FaChartLine, FaShoppingCart } from 'react-icons/fa';

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getStatistics({ month });
      setStatistics(data);
    };
    fetchData();
  }, [month]);

  return (
    <div className='w-64 bg-white rounded-xl shadow-md p-4 m-4 animate-fade-in'>
      <h3 className='text-lg font-semibold text-gray-800'>Statistics - <strong>{month}</strong></h3>
      <div className='mt-2 p-2 bg-blue-100 rounded-lg shadow-sm'>
        <div className='flex items-center gap-2'>
          <FaCalculator className='text-gray-500' />
          <p>Total sale: <strong>{statistics?.totalSaleAmount}</strong></p>
        </div>
        <div className='mt-2 flex items-center gap-2'>
          <FaChartLine className='text-gray-500' />
          <p>Total sold items: <strong>{statistics?.totalSoldItems}</strong></p>
        </div>
        <div className='mt-2 flex items-center gap-2'>
          <FaShoppingCart className='text-gray-500' />
          <p>Total not sold items: <strong>{statistics?.totalNotSoldItems}</strong></p>
        </div>
      </div>
    </div>
  )
}

export default Statistics