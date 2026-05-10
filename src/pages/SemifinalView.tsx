import React, { useMemo, useState } from "react";
import { useEntries } from "../hooks/useEntries";
import { usePredictions } from "../hooks/usePredictions";
import { useResults } from "../hooks/useResults";
import { Countdown } from "../components/Countdown";
import { useTheme } from "../store/ThemeContext";

interface SemifinalViewProps {
  semiFinal: 1 | 2;
}

export const SemifinalView: React.FC<SemifinalViewProps> = ({ semiFinal }) => {
  const { activeYear } = useTheme();
  const predictionType = `semi${semiFinal}` as const;
  const { entries, loading: entriesLoading } = useEntries(predictionType);
  const { results, loading: resultsLoading } = useResults();
  const {
    predictions,
    toggleQualifier,
    loading: predictionsLoading,
  } = usePredictions(predictionType);

  const isCompleted = semiFinal === 1 ? activeYear?.semi1_completed : activeYear?.semi2_completed;

  const selectedCount = useMemo(() => {
    return predictions.filter((p) => p.is_qualifier).length;
  }, [predictions]);

  const deadline = semiFinal === 1 ? activeYear?.semi1_start : activeYear?.semi2_start;
  const isLocked = deadline ? new Date(deadline).getTime() <= new Date().getTime() : false;

  const [shakeMax, setShakeMax] = useState(false);
  const [shakeEntryId, setShakeEntryId] = useState<string | null>(null);

  const handleToggle = (entryId: string, currentStatus: boolean) => {
    if (isLocked) {
      return; // Silently ignore clicks if betting window has closed
    }
    if (!activeYear?.betting_started) {
      alert("Betting has not started yet. Please wait for the administrator to open the betting window.");
      return;
    }
    if (!currentStatus && selectedCount >= 10) {
      setShakeMax(true);
      setShakeEntryId(entryId);
      setTimeout(() => {
        setShakeMax(false);
        setShakeEntryId(null);
      }, 400);
      return;
    }
    toggleQualifier(entryId, !currentStatus);
  };

  if (entriesLoading || predictionsLoading || resultsLoading) {
    return (
      <div className="p-4 text-center">Loading semifinal {semiFinal}...</div>
    );
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

  const isValid = selectedCount === 10;

  return (
    <div className="flex flex-col max-w-3xl mx-auto gap-6 p-4">
      <div className="flex justify-between items-start sm:items-center sticky top-0 bg-background/95 backdrop-blur py-4 z-10 border-b gap-4">
        <div>
          <h2 className="text-2xl font-bold">Semifinal {semiFinal}</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2">
            <p className="text-muted-foreground text-sm sm:text-base">{isLocked ? "Betting is closed" : "Select your 10 qualifiers"}</p>
            {deadline && <Countdown targetDateIso={deadline} />}
          </div>
        </div>
        {!isLocked && (
          <div
            className={`mt-1 sm:mt-0 px-3 py-1 rounded font-bold text-sm shrink-0 ${isValid ? "bg-green-100 text-green-800" : "bg-secondary text-secondary-foreground"} ${shakeMax ? "animate-shake" : ""}`}
          >
            {selectedCount} / 10
          </div>
        )}
      </div>

      <div className="grid gap-3">
        {entries.map((entry) => {
          const isSelected =
            predictions.find((p) => p.entry_id === entry.id)?.is_qualifier ??
            false;

          const result = results.find((r) => r.entry_id === entry.id);
          const hasProgressed = semiFinal === 1 ? result?.is_semi1_qualifier : result?.is_semi2_qualifier;
          
          let scoreText = null;
          let entryStyling = "hover:bg-muted/50 text-foreground bg-card border-border";

          if (isCompleted) {
            if (hasProgressed && isSelected) {
              // Bet & Progress: solid green
              scoreText = "+3";
              entryStyling = "border-green-600 bg-green-600 text-white shadow-sm";
            } else if (hasProgressed && !isSelected) {
              // No bet & Progress: see-through green
              scoreText = "+0";
              entryStyling = "border-green-500 bg-green-500/20 text-foreground shadow-sm";
            } else if (!hasProgressed && isSelected) {
              // Bet & No progress: see-through red
              entryStyling = "border-red-500 bg-red-500/20 text-foreground shadow-sm";
            } else {
              // No bet & No progress: gray
              entryStyling = "opacity-50 border-dashed border-gray-400 dark:border-gray-600 bg-muted/30 text-foreground";
            }
          } else if (isSelected) {
            entryStyling = "border-primary bg-primary/10 text-foreground shadow-sm";
          }

          return (
            <div
              key={entry.id}
              className={`relative p-4 border rounded flex flex-col items-center justify-center transition-all text-center ${entryStyling} ${
                isLocked 
                  ? "pointer-events-none cursor-default" 
                  : `cursor-pointer`
              } ${shakeEntryId === entry.id ? "animate-shake" : ""}`}
              onClick={() => handleToggle(entry.id, isSelected)}
            >
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isCompleted && hasProgressed && isSelected ? 'bg-green-700 text-white' : 'bg-muted text-foreground'}`}>
                {entry.start_position}
              </div>
              <div className="font-bold text-lg">{entry.country}</div>
              <div className={isCompleted && hasProgressed && isSelected ? "text-green-100" : "text-muted-foreground"}>
                {entry.artist} - {entry.song_title}
              </div>
              {scoreText && (
                <div className={`absolute right-4 top-1/2 -translate-y-1/2 font-bold ${isCompleted && hasProgressed && isSelected ? 'text-white' : 'text-green-600 dark:text-green-400'}`}>
                  {scoreText}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
