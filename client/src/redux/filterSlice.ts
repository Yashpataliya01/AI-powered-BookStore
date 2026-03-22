// src/redux/filterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FilterState } from '@/types';

const initialState: FilterState = {
  category: 'All', priceRange: [0, 100], rating: 0,
  sortBy: 'relevance', searchQuery: '',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCategory:    (state, action: PayloadAction<string>) => { state.category    = action.payload; },
    setPriceRange:  (state, action: PayloadAction<[number,number]>) => { state.priceRange = action.payload; },
    setRating:      (state, action: PayloadAction<number>) => { state.rating      = action.payload; },
    setSortBy:      (state, action: PayloadAction<FilterState['sortBy']>) => { state.sortBy   = action.payload; },
    setSearchQuery: (state, action: PayloadAction<string>) => { state.searchQuery = action.payload; },
    resetFilters:   () => initialState,
  },
});

export const { setCategory, setPriceRange, setRating, setSortBy, setSearchQuery, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
