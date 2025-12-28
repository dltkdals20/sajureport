import type { ThemeConfig, ThemePreset } from "./schema";

export const themePresets: Record<ThemePreset, ThemeConfig> = {
  cream: {
    preset: "cream",
    colors: {
      background: "#fbf6ef",
      card: "#fffaf4",
      border: "#f0e2d2",
      accent: "#f59e7b",
      text: "#2f2620",
      mutedText: "#756356"
    },
    typography: {
      baseFontSize: 16,
      headingScale: 1.2,
      fontFamily: "serif"
    },
    ui: {
      cardRadius: 20,
      cardShadow: "soft",
      sectionSpacing: "comfortable"
    },
    layout: {
      previewWidthMode: "reader",
      readerMaxWidth: 900,
      a4Mode: false
    }
  },
  white: {
    preset: "white",
    colors: {
      background: "#ffffff",
      card: "#f8fafc",
      border: "#e2e8f0",
      accent: "#f97316",
      text: "#1f2937",
      mutedText: "#64748b"
    },
    typography: {
      baseFontSize: 15,
      headingScale: 1.18,
      fontFamily: "system"
    },
    ui: {
      cardRadius: 16,
      cardShadow: "soft",
      sectionSpacing: "comfortable"
    },
    layout: {
      previewWidthMode: "reader",
      readerMaxWidth: 880,
      a4Mode: false
    }
  },
  dark: {
    preset: "dark",
    colors: {
      background: "#101010",
      card: "#1a1a1a",
      border: "#2a2a2a",
      accent: "#f59e7b",
      text: "#f3f4f6",
      mutedText: "#9ca3af"
    },
    typography: {
      baseFontSize: 16,
      headingScale: 1.2,
      fontFamily: "system"
    },
    ui: {
      cardRadius: 18,
      cardShadow: "medium",
      sectionSpacing: "comfortable"
    },
    layout: {
      previewWidthMode: "reader",
      readerMaxWidth: 900,
      a4Mode: false
    }
  }
};

export function getPresetTheme(preset: ThemePreset): ThemeConfig {
  return JSON.parse(JSON.stringify(themePresets[preset]));
}
