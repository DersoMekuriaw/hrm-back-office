"use client";

import { Table, Button, Tooltip } from "@mantine/core";
import { IconEye, IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";

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
  readonly onEdit?: (row: T) => void;
  readonly onDelete?: (row: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  onAddNew,
  onSearch,
  onFilter,
  onViewDetail,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  return (
    <>
      <div className="bg-white pb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        {/* Left - New Button */}
        {onAddNew && (
          <Tooltip label="Add Employee" withArrow>
            <Button
              onClick={onAddNew}
              color="blue"
              className="bg-blue-900 hover:bg-blue-700 text-white px-2 py-1 rounded-lg  font-medium"
            >
              <IconPlus  size={16} /> New
            </Button>
          </Tooltip>
        )}

        {/* Right - Search and Filter */}
        {onSearch && (
          <div className="flex items-right gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Tooltip label="Filter Employee" withArrow>
              <select
                onChange={(e) => onFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Filter</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </Tooltip>
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
                <th className="px-6 py-3 w-32 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-4 text-center"
                  >
                    Loading...
                  </td>
                </tr>
              )}
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr
                    key={index}
                    className="group hover:bg-gray-50 transition-colors duration-150"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-6 py-4 whitespace-nowrap text-gray-900"
                      >
                        {String(row[col.key as keyof T])}
                      </td>
                    ))}
                    <td className="px-1 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {onViewDetail && (
                          <Button
                            size="xs"
                            variant="subtle"
                            color="blue"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewDetail(row);
                            }}
                          >
                            <Tooltip label="View Detail" withArrow>
                              <IconEye className="text-blue-600" size={16} />
                            </Tooltip>
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            size="xs"
                            variant="subtle"
                            color="orange"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(row);
                            }}
                          >
                            <Tooltip label="Edit Employee" withArrow>
                              <IconEdit className="text-blue-900" size={16} />
                            </Tooltip>
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            size="xs"
                            variant="subtle"
                            color="red"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete?.(row);
                            }}
                          >
                            <Tooltip label="Delete Employee" withArrow>
                              <IconTrash className="text-red-600" size={16} />
                            </Tooltip>
                          </Button>
                        )}
                      </div>
                    </td>
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
