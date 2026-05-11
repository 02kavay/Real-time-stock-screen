"use client";

import React, { useEffect, useState } from 'react';
import { DataTable, Filters } from '../components/Screener';
import { Chart } from '../components/Chart';
import { useScreenerStore } from '../store/useScreenerStore';
import { useWebSocket } from '../hooks/useWebSocket';
import { Activity } from 'lucide-react';

export default function Home() {
  const initializeData = useScreenerStore(state => state.initializeData);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Generate 5000+ stocks
    initializeData(5000);
    setIsClient(true);
  }, [initializeData]);

  // Start the mock WebSocket simulation
  useWebSocket();

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <div className="app-container">
      <header className="header">
        <h1>
          <Activity size={24} color="var(--accent-blue)" />
          <span>Pro</span>Screener
        </h1>
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-green)', display: 'inline-block', boxShadow: '0 0 8px var(--accent-green)' }}></span>
            Live Data Feed Connected
          </span>
        </div>
      </header>

      <main className="main-content">
        <aside className="sidebar">
          <Filters />
        </aside>
        
        <section className="content-area">
          <div className="top-panel">
            <Chart />
          </div>
          <div className="bottom-panel">
            <DataTable />
          </div>
        </section>
      </main>
    </div>
  );
}
