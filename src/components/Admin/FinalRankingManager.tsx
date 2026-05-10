import { FC, useState, useEffect, useRef } from 'react';
import { Database } from '../../types/database.types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers";
import { SortableItem } from "../Ranking/SortableItem";

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
  const [items, setItems] = useState<string[]>([]);
  const [finalists, setFinalists] = useState<Entry[]>([]);
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
    setFinalists(sorted);
    
    if (!hasInitialized.current) {
      setItems(sorted.map(e => e.id));
      hasInitialized.current = true;
    } else {
      // Graceful drop: Remove entries that are no longer in the combined list
      setItems(current => {
        const validCurrent = current.filter(id => sorted.some(ce => ce.id === id));
        // Add any new entries that aren't in the current ranking
        const newEntries = sorted.filter(ce => !validCurrent.includes(ce.id)).map(e => e.id);
        
        if (validCurrent.length !== current.length || newEntries.length > 0) {
           return [...validCurrent, ...newEntries];
        }
        return current;
      });
    }
  }, [entries, semi1ProgressedIds, semi2ProgressedIds]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);

      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleSave = () => {
    const rankingData = items.map((id, index) => ({
      entryId: id,
      rank: index + 1
    }));
    onSave(rankingData);
  };

  if (items.length === 0) {
    return <div className="text-gray-500">No finalists available. Mark semi-finals as progressed first.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Finalists: </span>
          <span className="font-bold text-lg">{items.length}</span>
        </div>
        
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-dark"
        >
          Save Final Ranking
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden p-4">
        <h3 className="text-lg font-medium mb-4 ml-1 text-gray-700 dark:text-gray-300">Ranking Order (Top is 1st)</h3>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col">
              {items.map((id, index) => {
                const entry = finalists.find(e => e.id === id);
                if (!entry) return null;
                
                return (
                  <SortableItem
                    key={id}
                    id={id}
                    rank={index + 1}
                    country={entry.country}
                    artist={entry.artist}
                    song_title={entry.song_title}
                    startPosition={entry.final_start_position ?? 'TBD'}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};