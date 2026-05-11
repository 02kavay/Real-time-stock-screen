import { create } from 'zustand';
import { StockRecord, FilterState } from '../types';
import { generateMockStocks } from '../utils/mockData';

interface ScreenerState {
  allStocks: StockRecord[];
  filteredStocks: StockRecord[];
  selectedStock: StockRecord | null;
  filters: FilterState;
  
  initializeData: (count: number) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setSelectedStock: (stock: StockRecord | null) => void;
  updateStockPrice: (id: string, newPrice: number) => void;
  applyFilters: () => void;
}

const defaultFilters: FilterState = {
  sectors: [],
  searchQuery: '',
};

export const useScreenerStore = create<ScreenerState>((set, get) => ({
  allStocks: [],
  filteredStocks: [],
  selectedStock: null,
  filters: defaultFilters,
  
  initializeData: (count) => {
    const data = generateMockStocks(count);
    set({ allStocks: data, filteredStocks: data, selectedStock: data[0] || null });
  },
  
  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().applyFilters();
  },
  
  setSelectedStock: (stock) => set({ selectedStock: stock }),
  
  updateStockPrice: (id, newPrice) => {
    set((state) => {
      const updateStock = (stock: StockRecord) => {
        if (stock.id === id) {
          const change = newPrice - (stock.price - stock.change);
          const changePercent = (change / (stock.price - stock.change)) * 100;
          return { ...stock, price: newPrice, change, changePercent };
        }
        return stock;
      };

      const updatedAll = state.allStocks.map(updateStock);
      // Only update filtered list if necessary to optimize performance
      const updatedFiltered = state.filteredStocks.map(updateStock);
      
      let updatedSelected = state.selectedStock;
      if (updatedSelected?.id === id) {
        updatedSelected = updateStock(updatedSelected);
      }

      return {
        allStocks: updatedAll,
        filteredStocks: updatedFiltered,
        selectedStock: updatedSelected,
      };
    });
  },
  
  applyFilters: () => {
    const { allStocks, filters } = get();
    const start = performance.now();
    
    const filtered = allStocks.filter(stock => {
      if (filters.searchQuery && !stock.symbol.toLowerCase().includes(filters.searchQuery.toLowerCase()) && !stock.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      if (filters.sectors.length > 0 && !filters.sectors.includes(stock.sector)) {
        return false;
      }
      if (filters.minMarketCap !== undefined && stock.marketCap < filters.minMarketCap) return false;
      if (filters.maxMarketCap !== undefined && stock.marketCap > filters.maxMarketCap) return false;
      if (filters.minPE !== undefined && stock.peRatio < filters.minPE) return false;
      if (filters.maxPE !== undefined && stock.peRatio > filters.maxPE) return false;
      if (filters.minVolume !== undefined && stock.volume < filters.minVolume) return false;
      
      return true;
    });
    
    const end = performance.now();
    console.log(`[Filter Engine] Filtered ${allStocks.length} records in ${(end - start).toFixed(2)}ms`);
    
    set({ filteredStocks: filtered });
  }
}));
