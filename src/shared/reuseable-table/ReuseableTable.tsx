"use client";

import { Table, Button, Tooltip } from "@mantine/core";
import { IconPlus, IconChevronRight } from "@tabler/icons-react";

interface Column {
  key: string;
  label: string;
}

interface DataTableProps<T> {
  readonly data: T[];
  readonly columns: Column[];
  readonly isLoading?: boolean;
  readonly onAddNew?: () => void;
  readonly onSearch: (query: string) => void;
  readonly onFilter: (filterValue: string) => void;
  readonly onViewDetail?: (row: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  onAddNew,
  onSearch,
  onFilter,
  onViewDetail,
}: DataTableProps<T>) {
  return (
    <>
      {/* Header Controls */}
      <div className="bg-white pb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        {onAddNew && (
          <Tooltip label="Add New" withArrow>
            <Button
              onClick={onAddNew}
              leftSection={<IconPlus size={16} />}
              color="blue"
              variant="filled"
              className="w-full md:w-auto"
            >
              New
            </Button>
          </Tooltip>
        )}

        {onSearch && (
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              onChange={(e) => onFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Filter</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">

        <Table striped highlightOnHover withTableBorder className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}

            {data.map((row, index) => (
              <tr
                key={index}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onViewDetail?.(row); // Mobile: whole row is clickable
                  }
                }}
                className="group hover:bg-gray-50 transition duration-150 cursor-pointer relative"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 whitespace-nowrap text-gray-900"
                  >
                    {String(row[col.key as keyof T])}
                  </td>
                ))}

                {/* Desktop icon - show only on hover */}
                <td className="hidden md:table-cell absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Tooltip label="View Detail" withArrow>
                      <Button
                        variant="subtle"
                        size="sm"
                        color="blue"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetail?.(row);
                        }}
                      >
                        <IconChevronRight size={18} className="text-blue-900" />
                      </Button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
