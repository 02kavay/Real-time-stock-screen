"use client";

import React, { useRef, useMemo } from 'react';
import { useScreenerStore } from '../../store/useScreenerStore';
import { useVirtualizer } from '@tanstack/react-virtual';
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender, 
  ColumnDef,
  getSortedRowModel,
  SortingState
} from '@tanstack/react-table';
import { StockRecord } from '../../types';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

export function DataTable() {
  const filteredStocks = useScreenerStore(state => state.filteredStocks);
  const selectedStock = useScreenerStore(state => state.selectedStock);
  const setSelectedStock = useScreenerStore(state => state.setSelectedStock);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  
  const parentRef = useRef<HTMLDivElement>(null);

  const columns = useMemo<ColumnDef<StockRecord>[]>(() => [
    {
      accessorKey: 'symbol',
      header: 'Symbol',
      cell: info => <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>{info.getValue() as string}</span>,
      size: 100,
    },
    {
      accessorKey: 'name',
      header: 'Company Name',
      size: 200,
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: info => `$${(info.getValue() as number).toFixed(2)}`,
      size: 100,
    },
    {
      accessorKey: 'changePercent',
      header: 'Change %',
      cell: info => {
        const val = info.getValue() as number;
        const colorClass = val >= 0 ? 'text-green bg-green-10' : 'text-red bg-red-10';
        return <span className={`filter-badge ${colorClass}`}>{val > 0 ? '+' : ''}{val.toFixed(2)}%</span>;
      },
      size: 120,
    },
    {
      accessorKey: 'volume',
      header: 'Volume',
      cell: info => (info.getValue() as number).toLocaleString(),
      size: 120,
    },
    {
      accessorKey: 'marketCap',
      header: 'Market Cap',
      cell: info => `$${((info.getValue() as number) / 1000000).toFixed(2)}T`,
      size: 120,
    },
    {
      accessorKey: 'peRatio',
      header: 'P/E',
      cell: info => (info.getValue() as number).toFixed(2),
      size: 80,
    },
    {
      accessorKey: 'sector',
      header: 'Sector',
      size: 150,
    }
  ], []);

  const table = useReactTable({
    data: filteredStocks,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  return (
    <div ref={parentRef} className="table-container">
      <table className="data-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th 
                  key={header.id} 
                  style={{ width: header.getSize() }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: header.column.id === 'symbol' || header.column.id === 'name' ? 'flex-start' : 'flex-end', gap: '4px' }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: <ArrowUp size={14} />,
                      desc: <ArrowDown size={14} />,
                    }[header.column.getIsSorted() as string] ?? <ArrowUpDown size={14} style={{ opacity: 0.3 }} />}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
          {virtualizer.getVirtualItems().map(virtualRow => {
            const row = rows[virtualRow.index];
            const isSelected = selectedStock?.id === row.original.id;
            
            return (
              <tr 
                key={row.id}
                className={isSelected ? 'selected' : ''}
                onClick={() => setSelectedStock(row.original)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No stocks match the given filters.
        </div>
      )}
    </div>
  );
}
