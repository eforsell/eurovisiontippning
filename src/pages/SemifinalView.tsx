import React, { useMemo } from "react";
import { useEntries } from "../hooks/useEntries";
import { usePredictions } from "../hooks/usePredictions";
import { Countdown } from "../components/Countdown";

interface SemifinalViewProps {
  semiFinal: 1 | 2;
}

export const SemifinalView: React.FC<SemifinalViewProps> = ({ semiFinal }) => {
  const { entries, loading: entriesLoading } = useEntries(semiFinal);
  const predictionType = `semi${semiFinal}` as const;
  const {
    predictions,
    toggleQualifier,
    loading: predictionsLoading,
  } = usePredictions(predictionType);

  const selectedCount = useMemo(() => {
    return predictions.filter((p) => p.is_qualifier).length;
  }, [predictions]);

  // Mock deadline for demonstration since we don't have contest loaded
  const mockDeadline = `2026-05-1${semiFinal + 1}T19:00:00Z`;

  const handleToggle = (entryId: string, currentStatus: boolean) => {
    if (new Date(mockDeadline).getTime() <= new Date().getTime()) {
      alert("Voting is closed!");
      return;
    }
    if (!currentStatus && selectedCount >= 10) {
      alert("You can only select exactly 10 qualifiers!");
      return;
    }
    toggleQualifier(entryId, !currentStatus);
  };

  if (entriesLoading || predictionsLoading) {
    return (
      <div className="p-4 text-center">Loading semifinal {semiFinal}...</div>
    );
  }

  const isValid = selectedCount === 10;

  return (
    <div className="flex flex-col max-w-3xl mx-auto gap-6 p-4">
      <div className="flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur py-4 z-10 border-b">
        <div>
          <h2 className="text-2xl font-bold">Semifinal {semiFinal}</h2>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-muted-foreground">Select your 10 qualifiers</p>
            <Countdown targetDateIso={mockDeadline} />
          </div>
        </div>
        <div
          className={`px-4 py-2 rounded font-bold text-lg ${isValid ? "bg-green-100 text-green-800" : "bg-secondary text-secondary-foreground"}`}
        >
          {selectedCount} / 10
        </div>
      </div>

      <div className="grid gap-3">
        {entries.map((entry) => {
          const isSelected =
            predictions.find((p) => p.entry_id === entry.id)?.is_qualifier ??
            false;

          return (
            <div
              key={entry.id}
              className={`relative p-4 border rounded flex flex-col items-center justify-center cursor-pointer transition-colors text-center ${isSelected ? "border-primary bg-primary/10 shadow-sm" : "hover:bg-muted/50"}`}
              onClick={() => handleToggle(entry.id, isSelected)}
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                {entry.start_position}
              </div>
              <div className="font-bold text-lg">{entry.country}</div>
              <div className="text-muted-foreground">
                {entry.artist} - {entry.song_title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
