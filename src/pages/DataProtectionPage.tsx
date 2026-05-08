import React from "react";
import { DeleteAccountDialog } from "../components/Settings/DeleteAccountDialog";

export const DataProtectionPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col gap-6">
      <h2 className="text-3xl font-bold">Privacy & Data Control</h2>

      <section className="bg-card text-card-foreground p-6 rounded shadow-sm border">
        <h3 className="text-xl font-bold mb-4">Your Data, Your Control</h3>
        <p className="text-muted-foreground mb-4">
          We believe in full transparency and control over your data. In
          compliance with GDPR, you have the right to completely erase your
          account and all associated data from our servers.
        </p>
        <p className="text-muted-foreground mb-4">
          Deleting your account will permanently remove:
        </p>
        <ul className="list-disc pl-6 mb-4 text-muted-foreground">
          <li>Your authentication credentials</li>
          <li>All your contest predictions</li>
          <li>Your friend connections</li>
          <li>Your private notes</li>
        </ul>
        <p className="text-muted-foreground font-bold">
          This action cannot be undone.
        </p>
      </section>

      <section className="bg-destructive/10 border-destructive border p-6 rounded shadow-sm">
        <h3 className="text-xl font-bold text-destructive mb-4">Danger Zone</h3>
        <DeleteAccountDialog />
      </section>
    </div>
  );
};
