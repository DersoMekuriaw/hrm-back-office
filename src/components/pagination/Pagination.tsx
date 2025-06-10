"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export function Pagination({
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <div className="flex justify-end pt-4">
      <div className="flex items-center space-x-2">
        {/* Back Button */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="text-gray-600 disabled:text-gray-300 hover:text-black transition"
        >
          <IconChevronLeft size={16} />
        </button>

        {/* Current Page */}
        <span className="text-sm text-gray-700 font-medium">{page}</span>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="text-gray-600 disabled:text-gray-300 hover:text-black transition"
        >
          <IconChevronRight size={16} />
        </button>

        {/* Page Size Selector */}
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {[1, 5, 10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
