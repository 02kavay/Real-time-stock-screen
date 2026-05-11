import { useEffect, useRef } from 'react';
import { useScreenerStore } from '../store/useScreenerStore';

export function useWebSocket() {
  const updateStockPrice = useScreenerStore(state => state.updateStockPrice);
  const allStocks = useScreenerStore(state => state.allStocks);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (allStocks.length === 0) return;

    // Simulate a WebSocket connection that receives price updates
    // We update a random subset of stocks every 100ms
    intervalRef.current = setInterval(() => {
      // Pick 5-20 random stocks to update
      const updateCount = Math.floor(Math.random() * 15) + 5;
      
      for (let i = 0; i < updateCount; i++) {
        const randomIndex = Math.floor(Math.random() * allStocks.length);
        const stock = allStocks[randomIndex];
        
        // Random price movement between -0.5% and +0.5%
        const volatility = stock.price * 0.005;
        const change = (Math.random() - 0.5) * volatility;
        const newPrice = Number((stock.price + change).toFixed(2));
        
        updateStockPrice(stock.id, newPrice);
      }
    }, 100); // 100ms updates to test performance

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [allStocks.length, updateStockPrice]);
}
