"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";

const muiTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#c96442" },
    secondary: { main: "#535146" },
    background: {
      default: "#faf9f5",
      paper: "#f5f4ef",
    },
    text: {
      primary: "#3d3929",
      secondary: "#6e6d68",
    },
    divider: "#dad9d4",
  },
  typography: {
    fontFamily: "Outfit, sans-serif",
    fontSize: 14,
  },
  shape: {
    borderRadius: 16,
  },
});

export function MuiThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}
