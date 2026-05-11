"use client";

import React from 'react';
import { useScreenerStore } from '../../store/useScreenerStore';
import { Search, Filter as FilterIcon, X } from 'lucide-react';

const SECTORS = ['Technology', 'Healthcare', 'Financials', 'Consumer Discretionary', 'Industrials', 'Energy', 'Utilities', 'Real Estate'];

export function Filters() {
  const { filters, setFilters, filteredStocks, allStocks } = useScreenerStore();

  const handleSectorToggle = (sector: string) => {
    const newSectors = filters.sectors.includes(sector)
      ? filters.sectors.filter(s => s !== sector)
      : [...filters.sectors, sector];
    setFilters({ sectors: newSectors });
  };

  return (
    <div className="filter-section">
      <div className="filter-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FilterIcon size={18} />
          <span>Screening Filters</span>
        </div>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {filteredStocks.length} / {allStocks.length} Results
        </span>
      </div>

      <div className="input-group" style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          className="input" 
          placeholder="Search by Symbol or Name..." 
          style={{ paddingLeft: '36px' }}
          value={filters.searchQuery}
          onChange={(e) => setFilters({ searchQuery: e.target.value })}
        />
      </div>

      <div className="input-group">
        <label>Sectors</label>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {SECTORS.map(sector => {
            const isActive = filters.sectors.includes(sector);
            return (
              <div 
                key={sector}
                className="filter-badge"
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--accent-blue)' : 'var(--bg-hover)',
                  color: isActive ? 'white' : 'var(--text-secondary)'
                }}
                onClick={() => handleSectorToggle(sector)}
              >
                {sector}
                {isActive && <X size={12} style={{ marginLeft: '4px' }} />}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="input-group">
          <label>Min P/E Ratio</label>
          <input 
            type="number" 
            className="input" 
            placeholder="e.g. 10"
            value={filters.minPE || ''}
            onChange={(e) => setFilters({ minPE: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
        <div className="input-group">
          <label>Max P/E Ratio</label>
          <input 
            type="number" 
            className="input" 
            placeholder="e.g. 50"
            value={filters.maxPE || ''}
            onChange={(e) => setFilters({ maxPE: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="input-group">
          <label>Min Volume</label>
          <input 
            type="number" 
            className="input" 
            placeholder="e.g. 1000000"
            value={filters.minVolume || ''}
            onChange={(e) => setFilters({ minVolume: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>

      <button className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }} onClick={() => setFilters({ sectors: [], searchQuery: '', minPE: undefined, maxPE: undefined, minVolume: undefined })}>
        Reset All Filters
      </button>
    </div>
  );
}
