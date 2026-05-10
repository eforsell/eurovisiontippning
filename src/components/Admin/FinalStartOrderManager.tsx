import { FC, useState, useEffect, useRef } from 'react';
import { Database } from '../../types/database.types';

type Entry = Database['public']['Tables']['entries']['Row'];

interface FinalStartOrderManagerProps {
  entries: Entry[];
  semi1ProgressedIds: string[];
  semi2ProgressedIds: string[];
  onSave: (startOrder: { entryId: string; final_start_position: number }[]) => void;
}

export const FinalStartOrderManager: FC<FinalStartOrderManagerProps> = ({ 
  entries, 
  semi1ProgressedIds, 
  semi2ProgressedIds, 
  onSave 
}) => {
  const [orderedEntries, setOrderedEntries] = useState<Entry[]>([]);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 1. Get entries that started in 'final'
    const finalEntries = entries.filter(e => e.starting_contest === 'final');
    
    // 2. Get entries that progressed from semi1
    const semi1Qualifiers = entries.filter(e => e.starting_contest === 'semi1' && semi1ProgressedIds.includes(e.id));
    
    // 3. Get entries that progressed from semi2
    const semi2Qualifiers = entries.filter(e => e.starting_contest === 'semi2' && semi2ProgressedIds.includes(e.id));
    
    // Combine all
    const allFinalists = [...finalEntries, ...semi1Qualifiers, ...semi2Qualifiers];
    
    // Sort them initially:
    // If they have a final_start_position, use that.
    // Otherwise, append to the end.
    const sorted = allFinalists.sort((a, b) => {
      if (a.final_start_position === null && b.final_start_position === null) return 0;
      if (a.final_start_position === null) return 1;
      if (b.final_start_position === null) return -1;
      return a.final_start_position - b.final_start_position;
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrderedEntries(sorted);
    hasInitialized.current = true;
  }, [entries, semi1ProgressedIds, semi2ProgressedIds]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...orderedEntries];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index - 1];
    newOrder[index - 1] = temp;
    setOrderedEntries(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === orderedEntries.length - 1) return;
    const newOrder = [...orderedEntries];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index + 1];
    newOrder[index + 1] = temp;
    setOrderedEntries(newOrder);
  };

  const handleSave = () => {
    const startOrder = orderedEntries.map((entry, index) => ({
      entryId: entry.id,
      final_start_position: index + 1
    }));
    onSave(startOrder);
  };

  if (orderedEntries.length === 0) {
    return <div className="text-gray-500">No finalists available. Mark semi-finals as progressed first.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {orderedEntries.map((entry, index) => (
            <li key={entry.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
              <div className="flex items-center">
                <span className="flex-shrink-0 w-8 text-lg font-bold text-gray-500 dark:text-gray-400">
                  {index + 1}.
                </span>
                <span className="ml-4 font-medium text-gray-900 dark:text-white">
                  {entry.country}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({entry.artist} - {entry.song_title})
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <button 
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move Up"
                >
                  ▲
                </button>
                <button 
                  onClick={() => moveDown(index)}
                  disabled={index === orderedEntries.length - 1}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move Down"
                >
                  ▼
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium"
        >
          Save Start Order
        </button>
      </div>
    </div>
  );
};
