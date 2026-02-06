'use client';

import { useDashboardStore } from '@/lib/store';

const VIEW_OPTIONS = [
  { id: 'tables' as const, label: 'Data Tables', icon: '📊' },
  { id: 'maps' as const, label: 'Maps', icon: '🗺️' },
  { id: 'charts' as const, label: 'Charts', icon: '📈' },
];

export function ViewSwitcher() {
  const { activeView, setActiveView } = useDashboardStore();

  return (
    <div className="border-b border-gray-200 bg-white shadow-sm">
      {/* Centered container */}
      <div className="mx-auto max-w-7xl px-6">
        {/* Centered flex container */}
        <div className="flex justify-center gap-3 py-5">
          {VIEW_OPTIONS.map((option) => {
            const isActive = activeView === option.id;

            return (
              <button
                key={option.id}
                onClick={() => setActiveView(option.id)}
                className={`
                  flex items-center gap-2.5 rounded-xl px-6 py-3 text-sm font-semibold
                  transition-all duration-200 min-w-[140px] justify-center
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md hover:scale-105'
                  }
                `}
                aria-label={`Switch to ${option.label}`}
                aria-pressed={isActive}
              >
                <span className="text-xl">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
