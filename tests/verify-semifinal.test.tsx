import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SemifinalView } from "../src/pages/SemifinalView";

// Mock the hooks
const mockToggleQualifier = vi.fn();
const mockPredictions = Array.from({ length: 9 }).map((_, i) => ({
  entry_id: `entry-${i}`,
  is_qualifier: true,
}));

vi.mock("../src/hooks/useEntries", () => ({
  useEntries: vi.fn(() => ({
    entries: Array.from({ length: 15 }).map((_, i) => ({
      id: `entry-${i}`,
      country: `Country ${i}`,
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
    toggleQualifier: mockToggleQualifier,
    loading: false,
  })),
}));

vi.mock("../src/store/ThemeContext", () => ({
  useTheme: vi.fn(() => ({
    activeYear: { betting_started: true },
  })),
}));

describe("SemifinalView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
  });

  it("allows selecting a 10th qualifier", () => {
    render(<SemifinalView semiFinal={1} />);

    const unselectedEntry = screen.getByText("Country 10");
    fireEvent.click(unselectedEntry);

    expect(mockToggleQualifier).toHaveBeenCalledWith("entry-10", true);
    expect(window.alert).not.toHaveBeenCalled();
  });

  it("prevents selecting an 11th qualifier", () => {
    // Modify mock to have 10 selected
    mockPredictions.push({ entry_id: "entry-9", is_qualifier: true });

    render(<SemifinalView semiFinal={1} />);

    const unselectedEntry = screen.getByText("Country 10");
    fireEvent.click(unselectedEntry);

    expect(window.alert).toHaveBeenCalledWith(
      "You can only select exactly 10 qualifiers!",
    );
    expect(mockToggleQualifier).not.toHaveBeenCalled();

    // Cleanup
    mockPredictions.pop();
  });
});
