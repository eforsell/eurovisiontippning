import React, { useState } from "react";
import { adminService, AdminImportData } from "../services/adminService";

export const AdminView: React.FC = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [status, setStatus] = useState("");

  const handleImport = async () => {
    try {
      setStatus("Parsing...");
      const data = JSON.parse(jsonInput) as AdminImportData;
      setStatus("Importing to database...");
      await adminService.importData(data);
      setStatus("Import successful!");
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Admin Data Import</h2>
      <p className="text-muted-foreground">
        Paste the JSON configuration for the contest year here.
      </p>

      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        className="w-full h-64 p-4 font-mono text-sm border rounded bg-background text-foreground"
        placeholder='{ "year": 2025, ... }'
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
  );
};
