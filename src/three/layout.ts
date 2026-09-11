/**
 * Placements shared between the machine and whatever is sitting on the tray.
 * The portafilter twists when it locks, which carries its spouts with it — the
 * pour streams have to follow, or they miss the cup.
 */
export const PORTAFILTER_IDLE = 0.26;
export const PORTAFILTER_LOCKED = -0.82;

/** Where the milk pitcher waits, and where it lifts to under the steam wand. */
export const PITCHER_PARK: [number, number, number] = [-2.95, 0, 1.35];
export const PITCHER_STEAM: [number, number, number] = [-2.33, 0, 0.75];
