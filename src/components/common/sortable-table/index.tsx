import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/common/table';
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from '@/components/ui/pagination';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/types/utils/tailwind';

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (info: { row: T }) => React.ReactNode;
  enableSorting?: boolean;
}

interface SortableTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number;
  className?: string;
}

export function SortableTable<T>({
  data,
  columns,
  pageSize = 8,
  className,
}: SortableTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleSort = (column: keyof T) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn || sortDirection === null) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();

    return sortDirection === 'asc'
      ? aString.localeCompare(bString)
      : bString.localeCompare(aString);
  });

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  //   const renderPageNumbers = () => {
  //     const pages = [];
  //     const maxVisiblePages = 5;

  //     if (totalPages <= maxVisiblePages) {
  //       for (let i = 1; i <= totalPages; i++) {
  //         pages.push(i);
  //       }
  //     } else {
  //       // Always show first page
  //       pages.push(1);

  //       // Calculate range around current page
  //       let start = Math.max(2, currentPage - 1);
  //       let end = Math.min(totalPages - 1, currentPage + 1);

  //       // Adjust if we're near the start
  //       if (currentPage <= 3) {
  //         end = Math.min(totalPages - 1, 4);
  //       }

  //       // Adjust if we're near the end
  //       if (currentPage >= totalPages - 2) {
  //         start = Math.max(2, totalPages - 3);
  //       }

  //       // Add ellipsis before range if needed
  //       if (start > 2) {
  //         pages.push('...');
  //       }

  //       // Add range
  //       for (let i = start; i <= end; i++) {
  //         pages.push(i);
  //       }

  //       // Add ellipsis after range if needed
  //       if (end < totalPages - 1) {
  //         pages.push('...');
  //       }

  //       // Always show last page
  //       pages.push(totalPages);
  //     }

  //     return pages;
  //   };

  return (
    <div className={cn('w-full', className)}>
      <div className="w-full overflow-auto">
        <Table className="w-full bg-[#171718] rounded-lg">
          <TableHeader>
            <TableRow className="bg-[#121213] border-b border-[#33333a]">
              {columns.map((column, i) => (
                <TableHead
                  key={i}
                  className={cn(
                    'text-white font-medium py-3',
                    column.enableSorting && 'cursor-pointer select-none'
                  )}
                  onClick={() => column.enableSorting && toggleSort(column.accessorKey)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.enableSorting && (
                      <div className="flex flex-col">
                        <ChevronUp
                          className={cn(
                            'h-3 w-3 -mb-0.5',
                            sortColumn === column.accessorKey && sortDirection === 'asc'
                              ? 'text-primary'
                              : 'text-gray-500'
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            'h-3 w-3 -mt-0.5',
                            sortColumn === column.accessorKey && sortDirection === 'desc'
                              ? 'text-primary'
                              : 'text-gray-500'
                          )}
                        />
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={cn(rowIndex % 2 === 1 ? 'bg-[#1C1C1E]' : 'bg-[#171718]', 'border-none')}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className="py-4">
                    {column.cell ? column.cell({ row }) : String(row[column.accessorKey])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center pt-4 px-5 pb-2 text-sm gap-8">
          <button
            onClick={() => {
              if (currentPage > 1) setCurrentPage(currentPage - 1);
            }}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
            className={cn(
              'flex items-center justify-center w-14 h-14 rounded-full bg-[#232325] shadow-md transition-colors',
              currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#29292c]'
            )}
            style={{
              minWidth: 56,
              minHeight: 56,
              boxShadow: '0 2px 12px 0 rgba(0,0,0,.18)',
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span
            className="font-medium text-white text-xl select-none"
            style={{
              letterSpacing: 0.5,
            }}
          >
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => {
              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
            }}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
            className={cn(
              'flex items-center justify-center w-14 h-14 rounded-full bg-[#232325] shadow-md transition-colors',
              currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#29292c]'
            )}
            style={{
              minWidth: 56,
              minHeight: 56,
              boxShadow: '0 2px 12px 0 rgba(0,0,0,.18)',
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
