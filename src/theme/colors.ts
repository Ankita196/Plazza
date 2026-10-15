/**
 * Plazza Design System - Centralized Color Palette
 * Modify colors here to change the entire app theme in one place.
 */

export const Colors = {
  // Brand Colors
  primary: '#0D9488',          // Plazza Medical Teal
  primaryDark: '#0F766E',      // Dark Teal for headers & active containers
  primaryLight: '#CCFBF1',     // Very light teal for chips & highlights
  primaryBorder: '#99F6E4',

  // Secondary & Accents
  secondary: '#059669',        // Emerald green for actions & cart buttons
  secondaryLight: '#ECFDF5',   // Light green button background
  secondaryDisabled: '#6EE7B7',

  // Surfaces & Backgrounds
  background: '#F8FAFC',       // Clean slate app background
  surface: '#FFFFFF',          // Card & modal background
  surfaceSubtle: '#F1F5F9',    // Input & chip background

  // Text Hierarchy
  textPrimary: '#0F172A',      // Headings & primary labels
  textSecondary: '#64748B',    // Subtitles & descriptions
  textMuted: '#94A3B8',        // Inactive tabs, placeholder text
  textInverse: '#FFFFFF',      // White text on dark buttons/headers

  // Borders & Dividers
  border: '#E2E8F0',           // Card and container borders
  borderLight: '#F1F5F9',      // Subtle list dividers

  // Status & Feedback
  success: '#059669',
  successLight: '#DCFCE7',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  danger: '#DC2626',
  dangerLight: '#FEF2F2',
  info: '#3B82F6',
  infoLight: '#EFF6FF',

  // Prescription (Rx) Specific
  rxText: '#DC2626',
  rxBg: '#FEE2E2',
  rxBorder: '#F87171',

  // Promotional & Offers
  offerText: '#0369A1',
  offerBg: '#E0F2FE',
  offerBorder: '#38BDF8',

  // Debug & Dark Container
  darkContainer: '#1E293B',
  darkContainerBorder: '#334155',
} as const;

export type ColorName = keyof typeof Colors;
