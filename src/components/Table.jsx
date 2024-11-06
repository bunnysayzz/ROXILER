import React, { useEffect, useState } from 'react';
import { getTransactions } from '../services/api';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const Table = ({ month, initData }) => {
  const [transactions, setTransactions] = useState(initData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
    fetchData(1, "");
  }, [month]);

  useEffect(() => {
    fetchData(page, search);
  }, [page, search]);

  const fetchData = async (currentPage, currentSearch) => {
    const response = await getTransactions({ month, search: currentSearch, page: currentPage, perPage });
    const data = await response.data;
    setTransactions(data.transactions);
    setTotalPages(Math.ceil(data.count / perPage));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchData(1, e.target.value);
  };

  return (
    <div className='bg-white shadow-lg rounded-lg p-6 w-full'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center gap-2'>
          <Search size={18} className='text-gray-500' />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search transactions"
            className='w-64 h-8 border-solid border-2 rounded-md border-gray-300 pl-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <div className='flex gap-4'>
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className='border-solid border-2 bg-yellow-800 text-white p-2 w-24 rounded-md disabled:bg-slate-400 hover:bg-yellow-700 text-sm flex items-center justify-center gap-2'
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <div className='border-solid border-2 bg-yellow-400 p-2 w-10 text-center rounded-md font-semibold text-sm'>{page}</div>
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page >= totalPages}
            className='border-solid border-2 bg-yellow-800 text-white p-2 w-24 rounded-md disabled:bg-slate-400 hover:bg-yellow-700 text-sm flex items-center justify-center gap-2'
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className='overflow-x-auto'>
        <table className='text-xs text-center text-gray-900 table-auto w-full'>
          <thead className='bg-gray-200 border-b-2 border-gray-300'>
            <tr>
              <th className='px-4 py-2 border-r-2 border-gray-300'>Title</th>
              <th className='px-4 py-2 border-r-2 border-gray-300'>Description</th>
              <th className='px-4 py-2 border-r-2 border-gray-300'>Price</th>
              <th className='px-4 py-2 border-r-2 border-gray-300'>Date of Sale</th>
              <th className='px-4 py-2 border-r-2 border-gray-300'>Category</th>
              <th className='px-4 py-2'>Sold</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction?._id} className='border-b-2 border-gray-300 hover:bg-gray-100'>
                <td className='px-4 py-2 border-r-2 border-gray-300'>{transaction?.title}</td>
                <td className='px-4 py-2 border-r-2 border-gray-300'>
                  <div className='text-left text-xs w-40 h-20 overflow-y-auto'>
                    {transaction?.description}
                  </div>
                </td>
                <td className='px-4 py-2 border-r-2 border-gray-300'>{transaction?.price}</td>
                <td className='px-4 py-2 border-r-2 border-gray-300'>{new Date(transaction?.dateOfSale).toLocaleDateString()}</td>
                <td className='px-4 py-2 border-r-2 border-gray-300'>{transaction?.category}</td>
                <td className='px-4 py-2'>{transaction?.sold ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;