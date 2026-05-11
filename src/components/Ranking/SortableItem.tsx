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
  calculationInfo?: string;
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

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    touchAction: "pan-y",
    WebkitTouchCallout: "none",
  };

  const wrapperClasses = `p-3 sm:p-4 mb-2 bg-card text-card-foreground border rounded shadow-sm flex items-center gap-2 sm:gap-4 transition-colors select-none ${isDragging ? "opacity-50 border-primary relative z-50" : ""
    } ${props.isLocked ? "cursor-default" : "hover:bg-muted/50 cursor-grab active:cursor-grabbing"
    }`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!props.isLocked ? attributes : {})}
      {...(!props.isLocked ? listeners : {})}
      className={wrapperClasses}
    >
      <div className="flex flex-col items-center justify-center w-20 sm:w-24 shrink-0">
        <div className="font-bold text-lg sm:text-xl text-primary">
          {props.rank}
        </div>
        {props.startPosition !== undefined && (
          <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase justify-center font-bold mt-1">
            Start&nbsp;{props.startPosition ?? '-'}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 text-center px-1">
        <div className="font-bold text-base sm:text-lg truncate">{props.country}</div>
        <div className="text-xs sm:text-sm text-muted-foreground truncate">
          {props.artist} - {props.song_title}
        </div>
      </div>

      <div className="w-20 sm:w-24 shrink-0 flex justify-end">
        {props.finalRank !== undefined && props.points !== undefined && (
          <div className="flex items-center" title={props.calculationInfo}>
            <div className="flex flex-col items-end">
              <span className="text-[10px] sm:text-sm text-muted-foreground font-medium">Rank {props.finalRank}</span>
              <span className="font-bold text-xs sm:text-base text-green-600 dark:text-green-400">+{props.points.toFixed(1)} pts</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
