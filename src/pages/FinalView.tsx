import React, { useEffect, useState } from "react";
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
import { SortableItem } from "../components/Ranking/SortableItem";
import { useEntries } from "../hooks/useEntries";
import { usePredictions } from "../hooks/usePredictions";
import { useResults } from "../hooks/useResults";
import { useTheme } from "../store/ThemeContext";
import { Countdown } from "../components/Countdown";
import { scoringService } from "../services/scoringService";

export const FinalView: React.FC = () => {
  const { activeYear } = useTheme();
  const deadline = activeYear?.final_start;
  const isLocked = deadline ? new Date(deadline).getTime() <= new Date().getTime() : false;
  // We don't have a final_completed flag right now, so we assume it's completed if deadline has passed AND we have results
  // For safety, let's just use whether we actually have results mapped as the decider below
  const isCompleted = false;

  const { entries, loading: entriesLoading } = useEntries("final");
  const { results, loading: resultsLoading } = useResults();
  const {
    predictions,
    updateRanks,
    loading: predictionsLoading,
  } = usePredictions("final");

  // Determine if both semifinals are complete by checking if the required number of entries have progressed
  const semi1ProgressedCount = results.filter(r => r.is_semi1_qualifier).length;
  const semi2ProgressedCount = results.filter(r => r.is_semi2_qualifier).length;
  
  const semisComplete = 
    activeYear &&
    semi1ProgressedCount === activeYear.semi1_progression_target && 
    semi2ProgressedCount === activeYear.semi2_progression_target;

  const [items, setItems] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (entries.length > 0 && predictions && (!initialized || isCompleted)) {
      const rankedMap = new Map(predictions.map((p) => [p.entry_id, p.rank]));
      const resultMap = new Map(results.map((r) => [r.entry_id, r.final_rank]));
      const hasFinalResults = results.some(r => r.final_rank !== null);

      const sorted = [...entries].sort((a, b) => {
        // If final is completed and we have results, sort by actual final_rank
        if (hasFinalResults) {
          const finalRankA = resultMap.get(a.id) ?? 999;
          const finalRankB = resultMap.get(b.id) ?? 999;
          return finalRankA - finalRankB;
        }

        // Otherwise sort by user prediction or final_start_position
        const rankA = rankedMap.get(a.id) || 999;
        const rankB = rankedMap.get(b.id) || 999;
        if (rankA !== rankB) return rankA - rankB;
        
        // Use final_start_position, placing nulls at the end
        if (a.final_start_position == null && b.final_start_position == null) return 0;
        if (a.final_start_position == null) return 1;
        if (b.final_start_position == null) return -1;
        return (a.final_start_position as number) - (b.final_start_position as number);
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(sorted.map((e) => e.id));
      setInitialized(true);
    }
  }, [entries, predictions, initialized, isCompleted, results]);

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
    if (isLocked) return;
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      updateRanks(newItems);
    }
  };

  if (entriesLoading || predictionsLoading || resultsLoading) {
    return <div className="p-4 text-center">Loading Grand Final...</div>;
  }

  if (!activeYear?.betting_started) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-12 bg-card border rounded shadow-sm max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
        <p className="text-muted-foreground">
          The betting window has not opened yet. Please check back later!
        </p>
      </div>
    );
  }

  if (!semisComplete) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-12 bg-card border rounded shadow-sm max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Final Not Ready</h2>
        <p className="text-muted-foreground">
          You cannot rank the final entries until both semifinals have been completed and their qualifiers are known.
        </p>
      </div>
    );
  }

  const hasFinalResults = results.some(r => r.final_rank !== null);
  const hasStartOrder = entries.some(e => e.final_start_position !== null);

  return (
    <div className="flex flex-col max-w-3xl mx-auto gap-6 p-4">
      <div className="flex justify-between items-start sm:items-center sticky top-0 bg-background/95 backdrop-blur py-4 z-20 border-b gap-4">
        <div>
          <h2 className="text-2xl font-bold">Grand Final</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2">
            <p className="text-muted-foreground text-sm sm:text-base">
              {isLocked 
                ? "Betting is closed. Results will appear below." 
                : hasStartOrder 
                  ? "Drag and drop to rank your favorites"
                  : "Waiting for official start order. You can drag and drop to rank your favorites now."}
            </p>
            {deadline && <Countdown targetDateIso={deadline} />}
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col pb-20">
            {items.map((id, index) => {
              const entry = entries.find((e) => e.id === id);
              if (!entry) return null;
              
              let points: number | undefined;
              let finalRank: number | undefined;

              if (hasFinalResults) {
                const result = results.find(r => r.entry_id === entry.id);
                const prediction = predictions.find(p => p.entry_id === entry.id);
                
                if (result?.final_rank != null && prediction?.rank != null) {
                  finalRank = result.final_rank;
                  points = scoringService.calculateFinalPoints(prediction.rank, result.final_rank);
                }
              }

              return (
                <SortableItem
                  key={id}
                  id={id}
                  rank={index + 1}
                  country={entry.country}
                  artist={entry.artist}
                  song_title={entry.song_title}
                  isLocked={isLocked || hasFinalResults}
                  points={points}
                  finalRank={finalRank}
                  startPosition={entry.final_start_position ?? 'TBD'}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};