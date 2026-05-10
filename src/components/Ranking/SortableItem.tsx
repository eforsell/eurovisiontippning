import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: string;
  rank: number;
  country: string;
  artist: string;
  song_title: string;
  isLocked?: boolean;
  points?: number;
  finalRank?: number;
  startPosition?: number | null | string;
}

export function SortableItem(props: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id, disabled: props.isLocked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const wrapperClasses = `p-4 mb-2 bg-card text-card-foreground border rounded shadow-sm flex items-center gap-4 transition-all ${
    isDragging ? "opacity-50 border-primary relative" : ""
  } ${
    props.isLocked ? "cursor-default" : "hover:bg-muted/50 cursor-grab active:cursor-grabbing"
  }`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={wrapperClasses}
    >
      <div className="flex flex-col items-center justify-center w-8 shrink-0">
        <div className="font-bold text-xl text-primary">
          {props.rank}
        </div>
        {props.startPosition !== undefined && (
          <div className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
            Start {props.startPosition ?? '-'}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-bold truncate">{props.country}</div>
        <div className="text-sm text-muted-foreground truncate">
          {props.artist} - {props.song_title}
        </div>
      </div>
      
      {props.finalRank !== undefined && props.points !== undefined ? (
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground font-medium">Rank {props.finalRank}</span>
            <span className="font-bold text-green-600 dark:text-green-400">+{props.points} pts</span>
          </div>
        </div>
      ) : (
        !props.isLocked && <div className="text-muted-foreground shrink-0 px-2 cursor-grab active:cursor-grabbing">☰</div>
      )}
    </div>
  );
}
