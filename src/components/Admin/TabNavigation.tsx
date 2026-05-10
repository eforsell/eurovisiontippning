import { FC } from 'react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string; locked?: boolean; lockedMessage?: string }[];
}

export const TabNavigation: FC<TabNavigationProps> = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isLocked = tab.locked;
          
          return (
            <li key={tab.id} className="me-2">
              <button
                onClick={() => !isLocked && onTabChange(tab.id)}
                disabled={isLocked}
                title={isLocked ? tab.lockedMessage : undefined}
                className={`inline-block p-4 border-b-2 rounded-t-lg transition-colors ${
                  isActive 
                    ? 'text-primary border-primary dark:text-primary dark:border-primary' 
                    : isLocked
                      ? 'text-gray-400 border-transparent cursor-not-allowed opacity-50 dark:text-gray-600'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
                {isLocked && <span className="ml-2 text-xs">🔒</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
