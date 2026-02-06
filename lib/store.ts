// Global state management using Zustand
// Note: Install zustand first: npm install zustand
import { create } from 'zustand';

import type { FilterState, UKRegion } from '@/types/weather';

export type ViewMode = 'tables' | 'maps' | 'charts';

interface DashboardState {
  // Active view
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;

  // Filter state
  filters: FilterState;
  updateFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  // UI state
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Selected data (for cross-view interactions)
  selectedRegions: UKRegion[];
  setSelectedRegions: (regions: UKRegion[]) => void;
  selectedYear: number | null;
  setSelectedYear: (year: number | null) => void;
}

const DEFAULT_FILTERS: FilterState = {
  regions: ['uk'], // Start with UK average
  yearRange: {
    start: 2014,
    end: 2024,
  },
  months: [],
  seasons: [],
  metrics: ['temperature_mean', 'rainfall', 'sunshine'],
  comparisonMode: false,
  viewMode: 'table',
};

export const useDashboardStore = create<DashboardState>()((set) => ({
  // Initial state
  activeView: 'tables',
  filters: DEFAULT_FILTERS,
  sidebarCollapsed: false,
  selectedRegions: [],
  selectedYear: null,

  // Actions
  setActiveView: (view: ViewMode) => set({ activeView: view }),

  updateFilters: (newFilters: Partial<FilterState>) =>
    set((state: DashboardState) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  toggleSidebar: () =>
    set((state: DashboardState) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (collapsed: boolean) =>
    set({ sidebarCollapsed: collapsed }),

  setSelectedRegions: (regions: UKRegion[]) => set({ selectedRegions: regions }),

  setSelectedYear: (year: number | null) => set({ selectedYear: year }),
}));

// Selectors for better performance
export const useActiveView = () => useDashboardStore((state: DashboardState) => state.activeView);
export const useFilters = () => useDashboardStore((state: DashboardState) => state.filters);
export const useSidebarCollapsed = () => useDashboardStore((state: DashboardState) => state.sidebarCollapsed);
