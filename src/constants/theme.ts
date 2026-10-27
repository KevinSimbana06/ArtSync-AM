import { Platform } from "react-native";

export const Theme = {
  colors: {
    background: "#FAF8F8",
    surface: "#FFFFFF",
    surfaceMuted: "#F4EFEF",
    primary: "#D62261",
    primaryLight: "#FCE4EC",
    primaryDark: "#B8144B",
    textPrimary: "#1F1A1C",
    textSecondary: "#665E62",
    textMuted: "#8E8589",
    textOnPrimary: "#FFFFFF",
    imagePlaceholder: "#F5C6CB",
    cardBorder: "#F0E6E8",
    toastBackground: "#261619",
    toastText: "#FFFFFF",
  },
  typography: {
    fontTitle: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    fontBody: Platform.select({
      ios: "System",
      android: "sans-serif",
      default: "sans-serif",
    }),
  },
  radius: {
    sm: 8,
    md: 14,
    lg: 20,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
} as const;
