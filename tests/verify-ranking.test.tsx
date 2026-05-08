import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FinalView } from "../src/pages/FinalView";

// Mock the hooks
const mockUpdateRanks = vi.fn();
const mockPredictions = [
  { entry_id: "entry-1", rank: 2 },
  { entry_id: "entry-0", rank: 1 },
];

vi.mock("../src/hooks/useEntries", () => ({
  useEntries: vi.fn(() => ({
    entries: [
      {
        id: "entry-0",
        country: "Sweden",
        artist: "Artist A",
        song_title: "Song A",
        start_position: 1,
      },
      {
        id: "entry-1",
        country: "Norway",
        artist: "Artist B",
        song_title: "Song B",
        start_position: 2,
      },
    ],
    loading: false,
  })),
}));

vi.mock("../src/hooks/usePredictions", () => ({
  usePredictions: vi.fn(() => ({
    predictions: mockPredictions,
    updateRanks: mockUpdateRanks,
    loading: false,
  })),
}));

// Mock DndContext to avoid complex event mocking
vi.mock("@dnd-kit/core", async () => {
  const actual = await vi.importActual("@dnd-kit/core");
  return {
    ...(actual as any),
    DndContext: ({ children }: any) => (
      <div data-testid="dnd-context">{children}</div>
    ),
  };
});

describe("FinalView", () => {
  it("renders the entries sorted by rank from predictions", () => {
    render(<FinalView />);

    // The list should show Sweden then Norway based on mock ranks (1, 2)
    // Wait, rank 1 is entry-0 (Sweden), rank 2 is entry-1 (Norway)
    const items = screen.getAllByText(/Sweden|Norway/i);

    // items[0] should be Sweden, items[1] should be Norway
    expect(items[0].textContent).toBe("Sweden");
    expect(items[1].textContent).toBe("Norway");
  });
});
