export type CueKind = "music" | "control" | "osc" | "group" | "fade"

export type CueState = "idle" | "standby" | "running"

/** How a cue is triggered relative to its neighbours. */
export type TriggerCondition = "playhead" | "with" | "after"

export type CueColor = "none" | "red" | "orange" | "green" | "blue" | "purple"

export interface Cue {
  id: string
  number: string
  name: string
  notes: string
  /** display string for the target/media summary in the list */
  target: string
  kind: CueKind
  triggerCondition: TriggerCondition
  /** cue number this trigger references (for "with" / "after") */
  triggerTarget?: string
  preWait: string
  duration: string
  postWait: string
  depth: number
  state: CueState
  color: CueColor
  /** media file path — only meaningful for music cues */
  mediaFile?: string
  /** target output volume 0-1 — only meaningful for music cues */
  volume: number
  /** progress 0-1, only relevant while running */
  progress?: number
  /** pre-delay progress 0-1 while the cue is counting into playback */
  preProgress?: number
  /** post-delay progress 0-1 while the cue is winding down */
  postProgress?: number
  isGroup?: boolean
}

/** Highlight colors — the QLab-style swatch set. */
export const CUE_COLORS: Record<CueColor, string> = {
  none: "var(--color-text-disabled)",
  red: "var(--color-status-error)",
  orange: "var(--color-status-group)",
  green: "var(--color-status-running)",
  blue: "var(--color-status-playhead)",
  purple: "var(--color-status-standby)",
}

export const CUES: Cue[] = [
  {
    id: "c1",
    number: "1",
    name: "Preshow Music",
    notes: "House playlist — start 30 min before doors.",
    target: "group · 2 cues",
    kind: "group",
    triggerCondition: "playhead",
    preWait: "00:00",
    duration: "12:00",
    postWait: "00:00",
    depth: 0,
    state: "idle",
    color: "orange",
    volume: 0.7,
    isGroup: true,
  },
  {
    id: "c1-1",
    number: "1.1",
    name: "Volume Down",
    notes: "Dim house to 50% as music settles.",
    target: "universe 1 · ch 12",
    kind: "control",
    triggerCondition: "with",
    triggerTarget: "1",
    preWait: "00:02",
    duration: "00:03",
    postWait: "00:00",
    depth: 1,
    state: "idle",
    color: "none",
    volume: 0,
  },
  {
    id: "c1-2",
    number: "1.2",
    name: "Send OSC · Projector On",
    notes: "/projector/power 1",
    target: "osc · 10.0.0.42",
    kind: "osc",
    triggerCondition: "after",
    triggerTarget: "1.1",
    preWait: "00:00",
    duration: "00:00",
    postWait: "00:00",
    depth: 1,
    state: "idle",
    color: "none",
    volume: 0,
  },
  {
    id: "c2",
    number: "2",
    name: "Act 1 Intro",
    notes: "Fade in under the announcement.",
    target: "audio · act1_intro.wav",
    kind: "music",
    triggerCondition: "playhead",
    preWait: "00:00",
    duration: "00:45",
    postWait: "00:02",
    depth: 0,
    state: "idle",
    color: "blue",
    mediaFile: "act1_intro.wav",
    volume: 0.85,
  },
  {
    id: "c3",
    number: "3",
    name: "Thunderclap",
    notes: "Hard hit on the lightning flash.",
    target: "audio · thunder_01.wav",
    kind: "music",
    triggerCondition: "playhead",
    preWait: "00:03",
    duration: "00:06",
    postWait: "00:00",
    depth: 0,
    state: "standby",
    color: "none",
    mediaFile: "thunder_01.wav",
    volume: 1,
    preProgress: 0.6,
  },
  {
    id: "c4",
    number: "4",
    name: "Rain Ambience",
    notes: "Loop through the storm scene.",
    target: "audio · rain_loop.wav",
    kind: "music",
    triggerCondition: "playhead",
    preWait: "00:00",
    duration: "04:30",
    postWait: "00:00",
    depth: 0,
    state: "running",
    color: "green",
    mediaFile: "rain_loop.wav",
    volume: 0.62,
    progress: 0.42,
  },
  {
    id: "c4-1",
    number: "4.1",
    name: "Distant Rumble",
    notes: "Under-bed rumble, triggered with rain.",
    target: "audio · rumble_lo.wav",
    kind: "music",
    triggerCondition: "with",
    triggerTarget: "4",
    preWait: "00:00",
    duration: "06:00",
    postWait: "00:00",
    depth: 1,
    state: "running",
    color: "none",
    mediaFile: "rumble_lo.wav",
    volume: 0.4,
    progress: 0.31,
  },
]

/** The cue currently on the playhead and the one queued next. */
export const CURRENT_CUE = { number: "3", name: "Thunderclap" }
export const NEXT_CUE = {
  number: "4",
  name: "Rain Ambience",
  notes: "Loop through the storm scene.",
}

export type FadeState = "none" | "out" | "in"

/** Cues that have been triggered and are still playing back. */
export interface ActiveCue {
  id: string
  number: string
  name: string
  file: string
  /** seconds */
  elapsed: number
  remaining: number
  duration: number
  progress: number
  color: CueColor
  /** live output level 0-1 for the per-cue meter */
  level: number
}

export const ACTIVE_CUES: ActiveCue[] = [
  {
    id: "c4",
    number: "4",
    name: "Rain Ambience",
    file: "rain_loop.wav",
    elapsed: 113,
    remaining: 157,
    duration: 270,
    progress: 0.42,
    color: "green",
    level: 0.54,
  },
  {
    id: "c4-1",
    number: "4.1",
    name: "Distant Rumble",
    file: "rumble_lo.wav",
    elapsed: 111,
    remaining: 249,
    duration: 360,
    progress: 0.31,
    color: "none",
    level: 0.33,
  },
  {
    id: "c2",
    number: "2",
    name: "Act 1 Intro",
    file: "act1_intro.wav",
    elapsed: 38,
    remaining: 7,
    duration: 45,
    progress: 0.84,
    color: "blue",
    level: 0.78,
  },
]

/** mm:ss formatter for the runtime panel. */
export function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}
