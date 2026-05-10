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
    entries: Array.from({ length: 26 }, (_, i) => ({
      id: `entry-${i}`,
      country: i === 0 ? "Sweden" : i === 1 ? "Norway" : `Country ${i}`,
      artist: `Artist ${i}`,
      song_title: `Song ${i}`,
      start_position: i + 1,
    })),
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

vi.mock("../src/hooks/useResults", () => ({
  useResults: vi.fn(() => ({
    results: [],
    loading: false,
  })),
}));

vi.mock("../src/store/ThemeContext", () => ({
  useTheme: vi.fn(() => ({
    activeYear: { betting_started: true },
  })),
}));

// Mock DndContext to avoid complex event mocking
vi.mock("@dnd-kit/core", async () => {
  const actual = await vi.importActual("@dnd-kit/core");
  return {
    ...(actual as Record<string, unknown>),
    DndContext: ({ children }: { children: React.ReactNode }) => (
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
