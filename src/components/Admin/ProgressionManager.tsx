import { FC, useState } from 'react';
import { Database } from '../../types/database.types';
import { useProgressionValidation } from '../../hooks/useProgressionValidation';

type Entry = Database['public']['Tables']['entries']['Row'];

interface ProgressionManagerProps {
  contest: 'semi1' | 'semi2';
  entries: Entry[];
  targetCount: number;
  initialProgressedIds: string[];
  onSave: (progressedIds: string[]) => void;
}

export const ProgressionManager: FC<ProgressionManagerProps> = ({ contest, entries, targetCount, initialProgressedIds, onSave }) => {
  const [progressedIds, setProgressedIds] = useState<string[]>(initialProgressedIds);
  const validation = useProgressionValidation(targetCount, progressedIds.length);

  // Filter entries to only show those belonging to this contest
  const contestEntries = entries.filter(e => e.starting_contest === contest);

  const handleToggle = (id: string) => {
    setProgressedIds(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  const handleSave = () => {
    if (validation.isValid) {
      onSave(progressedIds);
    }
  };

  // Simplified UI for MVP without full dnd-kit for now to ensure functionality.
  // Can be enhanced with dnd-kit later per technical plan.
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Selected: </span>
          <span className={`font-bold text-lg ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
            {progressedIds.length} / {targetCount}
          </span>
        </div>
        
        <button
          onClick={handleSave}
          disabled={!validation.isValid}
          className={`px-4 py-2 rounded-lg font-medium text-white ${
            validation.isValid 
              ? 'bg-primary hover:bg-primary-dark' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Save Progression
        </button>
      </div>

      {!validation.isValid && (
        <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          {validation.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">All Entries ({contestEntries.length})</h3>
          <ul className="space-y-2">
            {contestEntries.map(entry => {
              const isProgressed = progressedIds.includes(entry.id);
              return (
                <li 
                  key={entry.id}
                  className={`p-3 border rounded-lg flex justify-between items-center cursor-pointer transition-colors ${
                    isProgressed 
                      ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleToggle(entry.id)}
                >
                  <div>
                    <span className="font-bold">{entry.country}</span>
                    <span className="text-sm text-gray-500 ml-2">{entry.artist}</span>
                  </div>
                  {isProgressed && <span className="text-primary font-bold">✓</span>}
                </li>
              );
            })}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Progressed ({progressedIds.length})</h3>
          <ul className="space-y-2">
            {contestEntries.filter(e => progressedIds.includes(e.id)).map(entry => (
              <li key={`prog-${entry.id}`} className="p-3 border border-primary bg-white dark:bg-gray-800 rounded-lg">
                <span className="font-bold text-gray-400 dark:text-gray-500 mr-3 w-4 inline-block text-center">{entry.start_position !== null ? entry.start_position : '-'}</span>
                <span className="font-bold">{entry.country}</span>
                <span className="text-sm text-gray-500 ml-2">{entry.artist}</span>
              </li>
            ))}
            {progressedIds.length === 0 && (
              <li className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                Select entries from the left to mark them as progressed.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
