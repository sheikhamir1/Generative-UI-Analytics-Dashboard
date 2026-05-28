import React, { useState, useEffect } from "react";

function DataExplorer() {
  const [sales, setSales] = useState([]);
  const [meta, setMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        // Fetching 50 records at a time from our new paginated backend route
        const response = await fetch(
          `http://localhost:3000/api/dashboard/sales?page=${page}&limit=50`,
        );
        const result = await response.json();

        if (result.success) {
          setSales(result.data);
          setMeta(result.meta);
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [page]); // Re-run fetch whenever the page state changes

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Info Panel */}
      <div className="p-6 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Enterprise Data Explorer
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Viewing raw transaction ledgers synced directly from MongoDB cluster
          </p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold border border-blue-100">
          Total Records: {meta.totalRecords.toLocaleString()}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto max-h-150 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 font-medium text-sm">
              Querying indexed documents...
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-white sticky top-0 shadow-[0_1px_0_0_rgba(243,244,246,1)] z-10">
              <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/75">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Category</th>
                <th className="p-4">Sub-Category</th>
                <th className="p-4">Region</th>
                <th className="p-4">Country</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {sales.map((sale) => (
                <tr
                  key={sale._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-4 font-mono text-xs text-blue-600 font-medium">
                    {sale.transactionId.split("-")[1] || sale.transactionId}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {sale.productCategory}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{sale.subCategory}</td>
                  <td className="p-4 font-medium">{sale.region}</td>
                  <td className="p-4 text-gray-500">{sale.country}</td>
                  <td className="p-4 text-right font-semibold text-gray-900">
                    ${sale.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-4 text-gray-400 text-xs">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1 || loading}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
        >
          Previous
        </button>
        <span className="text-sm font-medium text-gray-600">
          Page{" "}
          <span className="text-gray-900 font-bold">{meta.currentPage}</span> of{" "}
          <span className="text-gray-900 font-bold">
            {meta.totalPages.toLocaleString()}
          </span>
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
          disabled={page === meta.totalPages || loading}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DataExplorer;
