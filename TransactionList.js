import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    category: '',
    merchantName: '',
    dateFrom: '',
    dateTo: ''
  });
  const [sortBy, setSortBy] = useState('transactionDate');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        sortBy,
        sortOrder,
        ...filters
      };
      const response = await axios.get(`${API_BASE_URL}/bank-sync/transactions`, { params });
      setTransactions(response.data.transactions);
      setTotal(response.data.total);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, sortBy, sortOrder, filters]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
    setPage(1);
  };

  return (
    <div className="max-w-4xl mx-auto glass-effect p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          name="merchantName"
          placeholder="Merchant Name"
          value={filters.merchantName}
          onChange={handleFilterChange}
          className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleFilterChange}
          className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="date"
          name="dateFrom"
          value={filters.dateFrom}
          onChange={handleFilterChange}
          className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="date"
          name="dateTo"
          value={filters.dateTo}
          onChange={handleFilterChange}
          className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          onClick={toggleSortOrder}
          className="px-4 py-2 rounded bg-primary hover:bg-blue-700 text-white font-semibold"
        >
          Sort: {sortOrder}
        </button>
      </div>
      {loading ? (
        <p>Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="w-full text-left text-white border-collapse">
          <thead>
            <tr>
              <th className="py-2 border-b border-gray-400 cursor-pointer" onClick={() => setSortBy('merchantName')}>
                Merchant
              </th>
              <th className="py-2 border-b border-gray-400 cursor-pointer" onClick={() => setSortBy('category')}>
                Category
              </th>
              <th className="py-2 border-b border-gray-400 cursor-pointer" onClick={() => setSortBy('amount')}>
                Amount (₹)
              </th>
              <th className="py-2 border-b border-gray-400 cursor-pointer" onClick={() => setSortBy('transactionDate')}>
                Date
              </th>
              <th className="py-2 border-b border-gray-400">Alerts</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-white hover:bg-opacity-10 cursor-pointer">
                <td className="py-2 px-1">{txn.merchantName}</td>
                <td className="py-2 px-1">{txn.category || 'Uncategorized'}</td>
                <td className="py-2 px-1">₹{txn.amount}</td>
                <td className="py-2 px-1">{new Date(txn.transactionDate).toLocaleDateString()}</td>
                <td className="py-2 px-1">
                  {txn.isFraud && <span className="text-red-500 font-bold">Fraud</span>}
                  {!txn.isFraud && txn.anomalyScore >= 0.7 && (
                    <span className="text-yellow-400 font-semibold">Anomaly</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-4 flex justify-between items-center">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-primary hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
        >
          Previous
        </button>
        <p>
          Page {page} of {Math.ceil(total / limit)}
        </p>
        <button
          type="button"
          onClick={() => setPage((p) => (p * limit < total ? p + 1 : p))}
          disabled={page * limit >= total}
          className="px-4 py-2 rounded bg-primary hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TransactionList;
