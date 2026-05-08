import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
import { SortableItem } from "../components/Ranking/SortableItem";
import { useEntries } from "../hooks/useEntries";
import { usePredictions } from "../hooks/usePredictions";

export const FinalView: React.FC = () => {
  // In a real scenario, the Grand Final entries might be those that passed the semi or direct qualifiers
  // For the MVP, we just use all entries or let the user rank what we have
  const { entries, loading: entriesLoading } = useEntries();
  const {
    predictions,
    updateRanks,
    loading: predictionsLoading,
  } = usePredictions("final");

  const [items, setItems] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (entries.length > 0 && predictions && !initialized) {
      const rankedMap = new Map(predictions.map((p) => [p.entry_id, p.rank]));
      const sorted = [...entries].sort((a, b) => {
        const rankA = rankedMap.get(a.id) || 999;
        const rankB = rankedMap.get(b.id) || 999;
        if (rankA !== rankB) return rankA - rankB;
        return a.start_position - b.start_position;
      });
      setItems(sorted.map((e) => e.id));
      setInitialized(true);
    }
  }, [entries, predictions, initialized]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // delay for touch to allow scrolling
        tolerance: 5,
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

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      updateRanks(newItems);
    }
  };

  if (entriesLoading || predictionsLoading) {
    return <div className="p-4 text-center">Loading Grand Final...</div>;
  }

  return (
    <div className="flex flex-col max-w-3xl mx-auto gap-6 p-4">
      <div className="sticky top-0 bg-background/95 backdrop-blur py-4 z-20 border-b">
        <h2 className="text-2xl font-bold">Grand Final</h2>
        <p className="text-muted-foreground">
          Drag and drop to rank your favorites
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col pb-20">
            {items.map((id, index) => {
              const entry = entries.find((e) => e.id === id);
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
  );
};
