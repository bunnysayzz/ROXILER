import { useEffect, useState } from 'react'
import Table from './components/Table'
import Statistics from './components/Statistics'
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'
import { getCombinedData, initDatabase } from './services/api'

function App() {
  const [month, setMonth] = useState('select');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const [initData, setInitData] = useState([]);

  useEffect(() => {
    initDatabase();
    const getCombined = async () => {
      const { data } = await getCombinedData({ month });
      setInitData(data.transactions);
    }
    getCombined();
  }, [month])

  return (
    <div className="bg-gray-100 h-full w-full flex flex-col items-center py-12 gap-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl flex justify-between items-center">
        <h1 className="text-3xl font-bold">Roxiler Transaction Dashboard</h1>
        <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-48 h-10 border-solid border-2 rounded-md border-gray-700 pl-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value={'select'}>Select Month</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <Table month={month} initData={initData} />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl flex justify-around items-center">
        <Statistics month={month} initData={initData} />
        <PieChart month={month} initData={initData} />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <BarChart month={month} initData={initData} />
      </div>
    </div>
  )
}

export default App