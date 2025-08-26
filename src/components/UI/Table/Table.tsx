import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  filterable?: boolean;
  filterOptions?: string[];
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
}

const Table = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available"
}: TableProps<T>) => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);

  const filteredData = React.useMemo(() => {
    let filtered = [...data];
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(item => {
          const itemValue = item[key];
          return itemValue?.toString().toLowerCase().includes(value.toLowerCase());
        });
      }
    });
    
    return filtered;
  }, [data, filters]);

  const handleFilterChange = (columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
    setActiveFilterColumn(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key.toString()}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative"
                >
                  <div className="flex items-center justify-between">
                    <span>{column.label}</span>
                    {column.filterable && (
                      <div className="relative">
                        <button
                          onClick={() => setActiveFilterColumn(
                            activeFilterColumn === column.key.toString() ? null : column.key.toString()
                          )}
                          className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                            filters[column.key.toString()] ? 'text-blue-600' : 'text-gray-400'
                          }`}
                        >
                          <Filter className="w-4 h-4" />
                        </button>
                        
                        {activeFilterColumn === column.key.toString() && (
                          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-48">
                            <div className="p-2">
                              <input
                                type="text"
                                placeholder="Filter..."
                                className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                                value={filters[column.key.toString()] || ''}
                                onChange={(e) => handleFilterChange(column.key.toString(), e.target.value)}
                              />
                              {column.filterOptions && (
                                <div className="mt-2 max-h-32 overflow-y-auto">
                                  <button
                                    onClick={() => handleFilterChange(column.key.toString(), '')}
                                    className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                                  >
                                    All
                                  </button>
                                  {column.filterOptions.map(option => (
                                    <button
                                      key={option}
                                      onClick={() => handleFilterChange(column.key.toString(), option)}
                                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="text-gray-400">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Filter className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-2">No results found</p>
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key.toString()} className="px-6 py-4 whitespace-nowrap text-sm">
                      {column.render 
                        ? column.render(item[column.key.toString()], item)
                        : item[column.key.toString()]
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;