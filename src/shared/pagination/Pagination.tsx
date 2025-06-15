"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Select, Group } from "@mantine/core";

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
  const [pageNumbers, setPageNumbers] = useState<(number | string)[]>([]);

  useEffect(() => {
    const generatePageNumbers = () => {
      const pages: (number | string)[] = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Always show first page
        pages.push(1);
        
        // Calculate start and end of middle pages
        let start = Math.max(2, page - 1);
        let end = Math.min(totalPages - 1, page + 1);
        
        // Adjust if we're at the beginning
        if (page <= 3) {
          end = Math.min(4, totalPages - 1);
        }
        
        // Adjust if we're at the end
        if (page >= totalPages - 2) {
          start = Math.max(totalPages - 3, 2);
        }
        
        // Add ellipsis if needed after first page
        if (start > 2) {
          pages.push('...');
        }
        
        // Add middle pages
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        
        // Add ellipsis if needed before last page
        if (end < totalPages - 1) {
          pages.push('...');
        }
        
        // Always show last page
        pages.push(totalPages);
      }
      
      return pages;
    };
    
    setPageNumbers(generatePageNumbers());
  }, [page, totalPages]);

  return (
    <Group mt="md" className="">
      <Group>
        {/* Back Button */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="text-gray-600 disabled:text-gray-300 hover:text-black transition"
        >
          <IconChevronLeft size={16} />
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((pageNumber, index) => (
          <button
            key={index}
            onClick={() => typeof pageNumber === 'number' ? onPageChange(pageNumber) : null}
            disabled={pageNumber === '...'}
            className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
              pageNumber === page
                ? 'bg-blue-500 text-white font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            } ${
              pageNumber === '...' ? 'cursor-default' : 'cursor-pointer'
            }`}
          >
            {pageNumber}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="text-gray-600 disabled:text-gray-300 hover:text-black transition"
        >
          <IconChevronRight size={16} />
        </button>
      </Group>

      {/* Page Size Selector - Now using Mantine's Select */}
      <Select
        value={pageSize.toString()}
        onChange={(value) => {
          onPageSizeChange(Number(value));
          onPageChange(1); // Reset to first page when changing page size
        }}
        data={[
          { value: '1', label: '1 / page' },
          { value: '5', label: '5 / page' },
          { value: '10', label: '10 / page' },
          { value: '20', label: '20 / page' },
          { value: '50', label: '50 / page' },
          { value: '100', label: '100 / page' },
        ]}
        size="xs"
        style={{ width: 100 }}
      />
    </Group>
  );
}