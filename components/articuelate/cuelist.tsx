"use client"

import {
  Play,
  Music,
  Lightbulb,
  Folder,
  Radio,
  SlidersHorizontal,
  Spline,
} from "lucide-react"
import type { Cue, CueKind } from "./cue-data"
import { CUES, CUE_COLORS } from "./cue-data"

function KindIcon({ kind }: { kind: CueKind }) {
  const cls = "h-3.5 w-3.5 shrink-0"
  switch (kind) {
    case "group":
      return <Folder className={cls} />
    case "light":
      return <Lightbulb className={cls} />
    case "fade":
      return <Spline className={cls} />
    case "osc":
      return <Radio className={cls} />
    case "control":
      return <SlidersHorizontal className={cls} />
    default:
      return <Music className={cls} />
  }
}

/**
 * A time cell whose progress is rendered as a background rectangle behind the
 * text (QLab-style), rather than as a separate bar. `fill` fills proportionally;
 * `outline` marks an armed/standby cell.
 */
function TimeCell({
  value,
  fill = 0,
  variant = "plain",
  emphasize = false,
}: {
  value: string
  fill?: number
  variant?: "plain" | "fill" | "outline"
  emphasize?: boolean
}) {
  return (
    <div className="relative flex h-5 items-center justify-end overflow-hidden rounded-[3px] px-1.5">
      {variant === "fill" && (
        <div
          className="absolute inset-y-0 left-0 bg-[#A6DA95]/30"
          style={{ width: `${Math.min(1, Math.max(0, fill)) * 100}%` }}
        />
      )}
      {variant === "outline" && (
        <div className="absolute inset-0 rounded-[3px] border border-[#A6DA95]/70" />
      )}
      <span
        className={`relative font-mono text-[12px] tabular-nums ${
          variant === "fill" || emphasize ? "text-[#EEF2FF]" : "text-[#A5ADCB]"
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function CueRow({
  cue,
  zebra,
  selected,
  onSelect,
}: {
  cue: Cue
  zebra: boolean
  selected: boolean
  onSelect: () => void
}) {
  const running = cue.state === "running"
  const standby = cue.state === "standby"
  const stripe = cue.color !== "none" ? CUE_COLORS[cue.color] : undefined

  let rowBg = zebra ? "bg-[#24273A]" : "bg-[#1E2030]"
  if (running) rowBg = "bg-[#A6DA95]/10"
  if (selected) rowBg = "bg-[#2F3C5E]"

  const primaryText = selected ? "text-[#EEF2FF]" : "text-[#CAD3F5]"
  const mutedText = "text-[#8087A2]"

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group grid w-full grid-cols-[20px_46px_1fr_58px_82px_58px] items-center gap-1 border-b border-[#181926]/60 px-2 py-1 text-left text-[13px] outline-none focus:ring-1 focus:ring-inset focus:ring-[#8AADF4] ${rowBg}`}
      style={{ borderLeft: `3px solid ${stripe ?? "transparent"}` }}
    >
      {/* Playhead */}
      <div className="flex items-center justify-center">
        {standby && (
          <Play className="h-3.5 w-3.5 fill-[#8AADF4] text-[#8AADF4]" strokeWidth={0} />
        )}
        {running && (
          <Play className="h-3.5 w-3.5 fill-[#A6DA95] text-[#A6DA95]" strokeWidth={0} />
        )}
      </div>

      {/* Cue number */}
      <div
        className={`font-mono text-[12px] tabular-nums ${running ? "text-[#A6DA95]" : "text-[#B8C0E0]"}`}
      >
        {cue.number}
      </div>

      {/* Name · type icon · file — all inline on a single line */}
      <div
        className="flex min-w-0 items-center gap-1.5"
        style={{ paddingLeft: cue.depth * 14 }}
      >
        <span className={mutedText}>
          <KindIcon kind={cue.kind} />
        </span>
        <span className={`shrink truncate font-sans font-medium ${primaryText}`}>
          {cue.name}
        </span>
        <span className={`shrink-0 truncate font-mono text-[11px] ${mutedText}`}>
          {cue.target}
        </span>
      </div>

      {/* Pre-wait — fills during pre-delay */}
      <TimeCell
        value={cue.preWait}
        variant={cue.preProgress ? "fill" : "plain"}
        fill={cue.preProgress ?? 0}
      />

      {/* Duration — fills with playback progress; outlined when armed */}
      <TimeCell
        value={cue.duration}
        variant={running ? "fill" : standby ? "outline" : "plain"}
        fill={cue.progress ?? 0}
        emphasize={running}
      />

      {/* Post-wait — fills during post-delay */}
      <TimeCell
        value={cue.postWait}
        variant={cue.postProgress ? "fill" : "plain"}
        fill={cue.postProgress ?? 0}
      />
    </button>
  )
}

export function Cuelist({
  selectedId,
  onSelect,
}: {
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <section className="flex min-h-0 flex-1 flex-col bg-[#1E2030]">
      {/* Header row */}
      <div className="grid shrink-0 grid-cols-[20px_46px_1fr_58px_82px_58px] items-center gap-1 border-b border-[#363A4F] px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#B8C0E0]">
        <div />
        <div>Cue</div>
        <div>Name / File</div>
        <div className="text-right">Pre</div>
        <div className="text-right">Duration</div>
        <div className="text-right">Post</div>
      </div>

      {/* Rows */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {CUES.map((cue, i) => (
          <CueRow
            key={cue.id}
            cue={cue}
            zebra={i % 2 === 1}
            selected={cue.id === selectedId}
            onSelect={() => onSelect(cue.id)}
          />
        ))}
      </div>
    </section>
  )
}
