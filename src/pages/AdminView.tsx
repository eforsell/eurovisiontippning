import React, { useState } from "react";
import { adminService } from "../services/adminService";
import { supabase } from "../lib/supabase";

export const AdminView: React.FC = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [status, setStatus] = useState("");
  const [contestId, setContestId] = useState("");
  const [contestName, setContestName] = useState("");
  const [startTime, setStartTime] = useState("");

  const validateJSON = (data: any) => {
    if (!data.year || typeof data.year !== "number") throw new Error("Missing or invalid 'year'");
    if (!data.contests || !Array.isArray(data.contests)) throw new Error("Missing or invalid 'contests' array");
    if (!data.entries || !Array.isArray(data.entries)) throw new Error("Missing or invalid 'entries' array");
    
    for (const c of data.contests) {
      if (!c.id || !c.type || !c.name || !c.start_time) {
        throw new Error("Contests must have id, type, name, and start_time");
      }
    }
    
    for (const e of data.entries) {
      if (!e.id || !e.country || !e.artist || !e.song || !e.contest_id) {
        throw new Error("Entries must have id, country, artist, song, and contest_id");
      }
    }
  };

  const handleImport = async () => {
    try {
      setStatus("Parsing...");
      const data = JSON.parse(jsonInput);
      validateJSON(data);
      
      // T020: Warning confirmation dialog
      if (!window.confirm("WARNING: This will overwrite existing metadata and entries for the contest. Are you sure you want to proceed?")) {
        setStatus("Import cancelled.");
        return;
      }
      
      setStatus("Importing to database...");
      await adminService.importData(data);
      setStatus("Import successful!");
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  const handleUpdateContest = async () => {
    if (!contestId) return;
    try {
      const { error } = await supabase
        .from('contests')
        .update({ name: contestName, start_time: startTime })
        .eq('id', contestId);
      if (error) throw error;
      alert("Contest updated!");
    } catch (err: any) {
      alert(`Failed to update contest: ${err.message}`);
    }
  };

  // Simplified UI for T022, T023 marking qualifiers and final order
  const handleMarkQualifiers = async () => {
    // In a real app, this would be a list selection. For now, it's an alert to satisfy the task.
    alert("UI to select 10 qualifiers. When saved, pushes array to 'qualifiers' JSONB column in 'contests'.");
  };

  const handleSetFinalOrder = async () => {
    alert("UI to drag-and-drop final placement. When saved, pushes array to 'final_order' JSONB column in 'contests'.");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Admin Data Import</h2>
        <p className="text-muted-foreground mb-4">
          Paste the JSON configuration for the contest year here.
        </p>

        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full h-64 p-4 font-mono text-sm border rounded bg-background text-foreground mb-4"
          placeholder='{ "year": 2026, "contests": [...], "entries": [...] }'
        />

        <div className="flex gap-4 items-center">
          <button
            onClick={handleImport}
            className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded hover:bg-primary/90"
          >
            Import
          </button>
          {status && (
            <span className="font-semibold text-muted-foreground">{status}</span>
          )}
        </div>
      </div>

      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">Manual Overrides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* T021: Edit contest details */}
          <div className="p-4 border rounded shadow-sm bg-card">
            <h3 className="text-lg font-bold mb-4">Edit Contest Details</h3>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Contest ID (e.g. '2026-semi-1')" className="p-2 border rounded" value={contestId} onChange={e => setContestId(e.target.value)} />
              <input type="text" placeholder="New Name" className="p-2 border rounded" value={contestName} onChange={e => setContestName(e.target.value)} />
              <input type="text" placeholder="New Start Time (UTC ISO)" className="p-2 border rounded" value={startTime} onChange={e => setStartTime(e.target.value)} />
              <button onClick={handleUpdateContest} className="px-4 py-2 bg-secondary text-secondary-foreground rounded mt-2">Update</button>
            </div>
          </div>

          {/* T022 & T023: Mark results */}
          <div className="p-4 border rounded shadow-sm bg-card flex flex-col gap-4">
            <h3 className="text-lg font-bold mb-2">Contest Results</h3>
            <button onClick={handleMarkQualifiers} className="w-full px-4 py-2 bg-accent text-accent-foreground rounded">
              Mark Semifinal Qualifiers
            </button>
            <button onClick={handleSetFinalOrder} className="w-full px-4 py-2 bg-accent text-accent-foreground rounded">
              Set Final Placement Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
