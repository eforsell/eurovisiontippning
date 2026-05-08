import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: string;
  rank: number;
  country: string;
  artist: string;
  song_title: string;
}

export function SortableItem(props: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 mb-2 bg-card text-card-foreground border rounded shadow-sm flex items-center gap-4 ${isDragging ? "opacity-50 border-primary relative" : "hover:bg-muted/50 cursor-grab active:cursor-grabbing"}`}
    >
      <div className="font-bold text-xl w-8 text-center text-muted-foreground">
        {props.rank}
      </div>
      <div className="flex-1">
        <div className="font-bold">{props.country}</div>
        <div className="text-sm text-muted-foreground">
          {props.artist} - {props.song_title}
        </div>
      </div>
      <div className="text-muted-foreground">☰</div>
    </div>
  );
}
