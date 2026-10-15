/**
 * Plazza Design System - Centralized Color Palette
 * Extracted directly from the official Plazza application design:
 * - Deep Burgundy / Wine header: #830026
 * - Vibrant Magenta / Pink actions & ADD buttons: #E60067
 * - Soft Cyan offer tags: #0284C7 & #E0F2FE
 */

export const Colors = {
  // Brand Header & Accents (Plazza Deep Burgundy)
  primary: '#830026',          // Deep Burgundy / Maroon header and brand identity
  primaryDark: '#67001E',      // Darker Burgundy for status bar & contrast
  primaryLight: '#FDF2F8',     // Soft rose tint
  primaryBorder: '#FBCFE8',    // Subtle rose border

  // Secondary & Action Accents (Plazza Vibrant Magenta / Hot Pink)
  secondary: '#E60067',        // Vibrant Pink for ADD button, Active Tab, & CTA
  secondaryLight: '#FDF2F8',   // Light pink button background
  secondaryDisabled: '#F472B6',// Muted pink when limit reached

  // Surfaces & Backgrounds
  background: '#F8FAFC',       // Clean light app background
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

  // Promotional & Offers ("Best offer applied" in screenshot)
  offerText: '#0284C7',
  offerBg: '#E0F2FE',
  offerBorder: '#BAE6FD',

  // Debug & Dark Container
  darkContainer: '#1E293B',
  darkContainerBorder: '#334155',
} as const;

export type ColorName = keyof typeof Colors;
