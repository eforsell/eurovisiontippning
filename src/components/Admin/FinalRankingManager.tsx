import { FC, useState, useEffect, useRef } from 'react';
import { Database } from '../../types/database.types';

type Entry = Database['public']['Tables']['entries']['Row'];

interface FinalRankingManagerProps {
  entries: Entry[];
  semi1ProgressedIds: string[];
  semi2ProgressedIds: string[];
  onSave: (ranking: { entryId: string; rank: number }[]) => void;
}

export const FinalRankingManager: FC<FinalRankingManagerProps> = ({ 
  entries, 
  semi1ProgressedIds, 
  semi2ProgressedIds, 
  onSave 
}) => {
  const [rankedEntries, setRankedEntries] = useState<Entry[]>([]);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 1. Get entries that started in 'final'
    const finalEntries = entries.filter(e => e.starting_contest === 'final');
    
    // 2. Get entries that progressed from semi1
    const semi1Entries = entries.filter(e => semi1ProgressedIds.includes(e.id));
    
    // 3. Get entries that progressed from semi2
    const semi2Entries = entries.filter(e => semi2ProgressedIds.includes(e.id));
    
    // 4. Combine them
    const combined = [...finalEntries, ...semi1Entries, ...semi2Entries];
    
    // Defer state update slightly to avoid synchronous cascade warnings during render cycle
    const timeoutId = setTimeout(() => {
      if (!hasInitialized.current) {
         setRankedEntries(combined);
         hasInitialized.current = true;
      } else {
         // Graceful drop: Remove entries that are no longer in the combined list
         setRankedEntries(current => {
           const validCurrent = current.filter(re => combined.some(ce => ce.id === re.id));
           // Add any new entries that aren't in the current ranking
           const newEntries = combined.filter(ce => !validCurrent.some(re => re.id === ce.id));
           
           // Only update if there's actually a change to avoid loops
           if (validCurrent.length !== current.length || newEntries.length > 0) {
              return [...validCurrent, ...newEntries];
           }
           return current;
         });
      }
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [entries, semi1ProgressedIds, semi2ProgressedIds]);

  const moveEntryUp = (index: number) => {
    if (index === 0) return;
    const newRanking = [...rankedEntries];
    const temp = newRanking[index - 1];
    newRanking[index - 1] = newRanking[index];
    newRanking[index] = temp;
    setRankedEntries(newRanking);
  };

  const moveEntryDown = (index: number) => {
    if (index === rankedEntries.length - 1) return;
    const newRanking = [...rankedEntries];
    const temp = newRanking[index + 1];
    newRanking[index + 1] = newRanking[index];
    newRanking[index] = temp;
    setRankedEntries(newRanking);
  };

  const handleSave = () => {
    const rankingData = rankedEntries.map((entry, index) => ({
      entryId: entry.id,
      rank: index + 1
    }));
    onSave(rankingData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Finalists: </span>
          <span className="font-bold text-lg">{rankedEntries.length}</span>
        </div>
        
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-dark"
        >
          Save Final Ranking
        </button>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Ranking Order (Top is 1st)</h3>
        {/* Simplified ranking UI for MVP without full dnd-kit yet */}
        <ul className="space-y-2">
          {rankedEntries.map((entry, index) => (
            <li 
              key={entry.id}
              className="p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg flex justify-between items-center"
            >
              <div className="flex items-center space-x-4">
                <span className="font-bold text-xl text-gray-400 w-8 text-center">{index + 1}</span>
                <div>
                  <span className="font-bold">{entry.country}</span>
                  <span className="text-sm text-gray-500 ml-2">{entry.artist}</span>
                  <span className="text-xs ml-2 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    {entry.starting_contest === 'final' ? 'Auto-Qualifier' : entry.starting_contest === 'semi1' ? 'Semi 1' : 'Semi 2'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <button 
                  onClick={() => moveEntryUp(index)}
                  disabled={index === 0}
                  className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded disabled:opacity-50"
                  aria-label="Move up"
                >
                  ▲
                </button>
                <button 
                  onClick={() => moveEntryDown(index)}
                  disabled={index === rankedEntries.length - 1}
                  className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded disabled:opacity-50"
                  aria-label="Move down"
                >
                  ▼
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
