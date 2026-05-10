import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LandingPage } from "../src/pages/LandingPage";
import { ThemeProvider } from "../src/store/ThemeContext";

// Mock supabase client to prevent real network calls
vi.mock("../src/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        limit: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: {
              year: 2026,
              primary_color: "#000000",
              secondary_color: "#ffffff",
            },
            error: null,
          }),
        })),
      })),
    })),
    auth: {
      signInWithOAuth: vi.fn(),
    },
  },
}));

describe("LandingPage", () => {
  it("renders the hero section and login CTA", async () => {
    render(
      <ThemeProvider>
        <LandingPage />
      </ThemeProvider>,
    );

    // Assert CTA visibility
    const loginButton = await screen.findByRole("button", {
      name: /Sign in with Google/i,
    });
    expect(loginButton).toBeInTheDocument();

    // Assert Hero text
    const heading = screen.getByText(/Eurovision 2026 Predictions/i);
    expect(heading).toBeInTheDocument();
  });
});
