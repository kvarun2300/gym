import React from 'react';
import { CardSkeleton } from '../common/Skeleton';

/**
 * columns: [{ key, label, render?: (row) => node, sortable?: bool }]
 */
const DataTable = ({ columns, rows, loading, emptyLabel = 'No records found', onSort, sortBy, sortOrder }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!rows?.length) {
    return <div className="glass p-14 text-center text-sm text-white/40">{emptyLabel}</div>;
  }

  return (
    <div className="glass overflow-x-auto">
      <table className="w-full min-w-[640px] text-left">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && onSort?.(col.key)}
                className={`px-5 py-4 font-accent text-[11px] font-semibold uppercase tracking-wider text-white/40 ${
                  col.sortable ? 'cursor-pointer select-none hover:text-white/70' : ''
                }`}
              >
                {col.label}
                {sortBy === col.key && <span className="ml-1 text-crimson-light">{sortOrder === 'ASC' ? '↑' : '↓'}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="border-b border-white/[0.04] transition-colors last:border-0 hover:bg-white/[0.02]">
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-4 text-sm text-white/75">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
