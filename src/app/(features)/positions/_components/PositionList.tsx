'use client';

import { Table } from '@mantine/core';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps<T> {
  readonly data: T[];
  readonly columns: Column[];
  readonly isLoading?: boolean;
  readonly onFilter: (filterValue: string) => void;
  readonly onSearch: (query: string) => void;
  readonly onViewDetail?: (row: T) => void;
}

export function PositionList<T>({
  data, 
  columns,
  isLoading = false,
  onFilter,
  onSearch,
  onViewDetail, 
}: DataTableProps<T>) {
  
  return (
    <>
      <div className="bg-white pb-2 flex flex-col md:flex-row md:items-center md:justify-end gap-4 mb-2">
        {/* Search and Filter - Aligned to right */}
        {onSearch && (
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto justify-end">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select 
              onChange={(e) => onFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Filter</option>
              <option value="academic">Academic</option>
              <option value="administrative">Administration</option>
            </select>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table striped highlightOnHover className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              )}
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr 
                    onClick={() => onViewDetail && onViewDetail(row)}
                    key={index} 
                    className="group hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-6 py-4 whitespace-nowrap text-gray-900"
                      >
                        {String(row[col.key as keyof T])}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}