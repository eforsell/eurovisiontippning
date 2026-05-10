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
    setItems(sorted.map(e => e.id));
    hasInitialized.current = true;
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
    const startOrder = items.map((id, index) => ({
      entryId: id,
      final_start_position: index + 1
    }));
    onSave(startOrder);
  };

  if (items.length === 0) {
    return <div className="text-gray-500">No finalists available. Mark semi-finals as progressed first.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden p-4">
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
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
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
