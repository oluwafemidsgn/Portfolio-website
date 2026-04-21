/**
 * Shared cubic-bezier easings. Tuple-typed so framer-motion v12's
 * stricter type checks accept them without per-call `as const` casts.
 */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT_EXPO: [number, number, number, number] = [0.85, 0, 0.15, 1];
