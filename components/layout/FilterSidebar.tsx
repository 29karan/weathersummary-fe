'use client';

import { useDashboardStore } from '@/lib/store';

interface FilterSidebarProps {
  children: React.ReactNode;
}

export function FilterSidebar({ children }: FilterSidebarProps) {
  const { sidebarCollapsed, toggleSidebar } = useDashboardStore();

  return (
    <aside
      className={`
        sticky top-0 h-screen flex-shrink-0 transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'w-0 md:w-16' : 'w-80'}
      `}
    >
      <div className={`h-full bg-white border-r border-gray-200 shadow-lg flex flex-col ${sidebarCollapsed ? 'overflow-hidden' : ''}`}>
        {/* Header - Better alignment */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
          {!sidebarCollapsed && (
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Filters
            </h2>
          )}
          <button
            onClick={toggleSidebar}
            className="rounded-lg bg-white border border-gray-300 p-2.5 text-gray-700 transition-all hover:bg-gray-50 hover:shadow-md hover:border-gray-400"
            aria-label={sidebarCollapsed ? 'Expand filters' : 'Collapse filters'}
          >
            <span className="text-base font-bold">{sidebarCollapsed ? '→' : '←'}</span>
          </button>
        </div>

        {/* Content - Better padding */}
        {!sidebarCollapsed && (
          <div className="flex-1 overflow-y-auto p-5">
            {children}
          </div>
        )}
      </div>
    </aside>
  );
}
