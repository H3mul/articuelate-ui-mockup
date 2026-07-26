"use client"

import { useState, useId, useRef, useMemo, useLayoutEffect } from "react"
import { Pause, Play, X, SkipBack, Spline } from "lucide-react"
import type { ActiveCue, FadeState } from "./cue-data"
import { ACTIVE_CUES, CUE_COLORS, fmt } from "./cue-data"

/** S-curve fade glyph. Points down for fade-out, up (flipped) for fade-in. */
function FadeIcon({ dir, className = "" }: { dir: "out" | "in"; className?: string }) {
  return <Spline className={`${className} ${dir === "in" ? "-scale-y-100" : ""}`} />
}

/**
 * Vertical segmented LED meter column. Fills bottom-to-top.
 * Color zones: green (low), amber (mid), red (high).
 */
function VerticalLEDMeter({
  level,
  count = 12,
  width = "w-2",
}: {
  level: number
  count?: number
  width?: string
}) {
  const normalizedLevel = Math.min(1, Math.max(0, level))
  const litCount = Math.round(normalizedLevel * count)

  return (
    <div className={`flex ${width} flex-col-reverse items-center gap-px`}>
      {Array.from({ length: count }).map((_, i) => {
        const isLit = i < litCount
        let color = "#A6DA95"
        if (i >= Math.floor(count * 0.66)) color = "#EED49F"
        if (i >= Math.floor(count * 0.83)) color = "#ED8796"
        return (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: isLit ? color : "#11121C",
              opacity: isLit ? 1 : 0.25,
              border: "1px solid #2A2D3E",
            }}
          />
        )
      })}
    </div>
  )
}

/**
 * Stylised waveform progress bar.
 * Renders a fixed pseudo-waveform of mirrored vertical bars. A left-to-right
 * highlight clip (progress 0-1) shows elapsed playback in a brighter accent;
 * bars past the playhead are muted/dim.
 */
function WaveformProgress({
  progress,
  accentColor = "#8AADF4",
  dimColor = "#363A4F",
  height = 28,
  barWidth = 4,
  barGap = 3,
  onChange,
  label,
}: {
  progress: number
  accentColor?: string
  dimColor?: string
  height?: number
  barWidth?: number
  barGap?: number
  onChange?: (v: number) => void
  label?: string
}) {
  const id = useId()
  const clipId = `wv-clip-${id.replace(/:/g, "")}`
  const containerRef = useRef<HTMLDivElement>(null)
  const [numBars, setNumBars] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const w = el.getBoundingClientRect().width
      setContainerWidth(w)
      setNumBars(Math.max(1, Math.floor((w + barGap) / (barWidth + barGap))))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [barWidth, barGap])

  const amplitudes = useMemo(() => {
    if (numBars === 0) return []
    return Array.from({ length: numBars }, (_, i) => {
      const t = i / numBars
      const base = 0.4 + 0.55 * Math.abs(Math.sin(i * 2.3 + 0.7))
      const env = Math.sin(Math.PI * t) * 0.35 + 0.65
      return Math.min(1, base * env)
    })
  }, [numBars])

  const h = height
  const r = Math.min(barWidth / 2, h / 2)

  if (numBars === 0 || containerWidth === 0) {
    return <div ref={containerRef} className="relative w-full" style={{ height }} />
  }

  return (
    <div ref={containerRef} className="relative w-full" style={{ height }}>
      {onChange && (
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(progress * 100)}
          onChange={(e) => onChange(Number(e.target.value) / 100)}
          aria-label={label ?? "Scrub"}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        />
      )}
      <svg
        viewBox={`0 0 ${containerWidth} ${h}`}
        preserveAspectRatio="none"
        width="100%"
        height={h}
        aria-hidden
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={0} width={containerWidth * progress} height={h} />
          </clipPath>
        </defs>

        {amplitudes.map((amp, i) => {
          const x = i * (barWidth + barGap)
          const barH = Math.max(1, h * amp)
          return (
            <path
              key={i}
              d={`M ${x} ${h} L ${x} ${h - barH + r} Q ${x} ${h - barH} ${x + r} ${h - barH} L ${x + barWidth - r} ${h - barH} Q ${x + barWidth} ${h - barH} ${x + barWidth} ${h - barH + r} L ${x + barWidth} ${h} Z`}
              fill={dimColor}
            />
          )
        })}

        <g clipPath={`url(#${clipId})`}>
          {amplitudes.map((amp, i) => {
            const x = i * (barWidth + barGap)
            const barH = Math.max(1, h * amp)
            return (
              <path
                key={i}
                d={`M ${x} ${h} L ${x} ${h - barH + r} Q ${x} ${h - barH} ${x + r} ${h - barH} L ${x + barWidth - r} ${h - barH} Q ${x + barWidth} ${h - barH} ${x + barWidth} ${h - barH + r} L ${x + barWidth} ${h} Z`}
                fill={accentColor}
                opacity={0.9}
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}

function GlobalButton({
  icon,
  label,
  active,
  danger,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  danger?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-7 w-7 items-center justify-center rounded-sm border outline-none transition-colors focus:ring-2 focus:ring-[#8AADF4] ${
        danger
          ? "border-[#363A4F] bg-[#11121C] text-[#ED8796] hover:bg-[#ED8796]/15"
          : active
          ? "border-[#F5A97F] bg-[#F5A97F]/15 text-[#F5A97F]"
          : "border-[#363A4F] bg-[#11121C] text-[#B8C0E0] hover:bg-[#181926] hover:text-[#CAD3F5]"
      }`}
    >
      {icon}
    </button>
  )
}

function CueButton({
  icon,
  label,
  active,
  danger,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  danger?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-6 w-6 items-center justify-center rounded-sm border outline-none transition-colors focus:ring-2 focus:ring-[#8AADF4] ${
        danger
          ? "border-[#363A4F] bg-[#11121C] text-[#ED8796] hover:bg-[#ED8796]/15"
          : active
          ? "border-[#8AADF4] bg-[#8AADF4]/15 text-[#8AADF4]"
          : "border-[#363A4F] bg-[#11121C] text-[#B8C0E0] hover:bg-[#24273A] hover:text-[#CAD3F5]"
      }`}
    >
      {icon}
    </button>
  )
}

function ActiveCueRow({ cue }: { cue: ActiveCue }) {
  const [paused, setPaused] = useState(false)
  const [fade, setFade] = useState<FadeState>("none")
  const [progress, setProgress] = useState(cue.progress)
  const stripe = cue.color !== "none" ? CUE_COLORS[cue.color] : "#6E738D"
  const accentColor = cue.color !== "none" ? CUE_COLORS[cue.color] : "#8AADF4"

  return (
    <div
      className="relative flex h-20 items-stretch gap-1.5 rounded-sm border border-[#363A4F] bg-[#181926] px-2"
      style={{ borderLeft: `3px solid ${stripe}` }}
    >
      {/* Left column: Top row (identity + buttons), Middle row (file + time), Bottom row (waveform) */}
      <div className="flex min-w-0 min-h-0 flex-1 flex-col justify-between pt-1.5">
        {/* Top row: Identity + transport buttons */}
        <div className="flex shrink-0 items-center justify-between">
          <div className="flex min-w-0 items-baseline gap-1">
            <span className="w-6 shrink-0 text-right font-mono text-[11px] tabular-nums text-[#8AADF4]">
              {cue.number}
            </span>
            <span className="truncate font-sans text-[12px] font-medium text-[#EEF2FF]">
              {cue.name}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <CueButton
              icon={<SkipBack className="h-3 w-3" />}
              label="Back to Start"
              onClick={() => setProgress(0)}
            />
            <CueButton
              icon={paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              label={paused ? "Resume" : "Pause"}
              active={paused}
              onClick={() => setPaused((p) => !p)}
            />
            <CueButton
              icon={<FadeIcon dir={fade === "out" ? "in" : "out"} className="h-3 w-3" />}
              label={fade === "out" ? "Fade In" : "Fade Out"}
              active={fade !== "none"}
              onClick={() => setFade((f) => (f === "out" ? "in" : "out"))}
            />
            <CueButton
              icon={<X className="h-3 w-3" />}
              label={`Stop ${cue.name}`}
              danger
            />
          </div>
        </div>

        {/* Middle row: File name and timing info */}
        <div className="flex items-baseline gap-1">
          <span className="w-6 shrink-0" />
          <span className="min-w-0 flex-1 truncate font-mono text-[9px] text-[#6E738D]">
            {cue.file}
          </span>
          <span className="shrink-0 font-mono text-[9px] tabular-nums text-[#A5ADCB]">
            {fmt(cue.duration)} -{fmt(cue.remaining)}
          </span>
        </div>

        {/* Bottom row: Waveform progress */}
        <div className="flex w-full items-end">
          <WaveformProgress
            progress={progress}
            accentColor={accentColor}
            onChange={setProgress}
            label={`Scrub ${cue.name}`}
            height={20}
            barWidth={3}
            barGap={2}
          />
        </div>
      </div>

      {/* Right column: Vertical stereo meters — full row height */}
      <div className="flex shrink-0 items-center self-center gap-px">
        <VerticalLEDMeter level={cue.level} count={10} width="w-1.5" />
        <VerticalLEDMeter level={cue.level * 0.9} count={10} width="w-1.5" />
      </div>
    </div>
  )
}

export function RuntimeSidebar() {
  const [gain, setGain] = useState(88)
  const [globalPaused, setGlobalPaused] = useState(false)
  const [globalFade, setGlobalFade] = useState<FadeState>("none")
  const [deviceOk, setDeviceOk] = useState(true)

  return (
    <aside className="flex w-80 shrink-0 flex-col bg-[#1E2030]">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-[#363A4F] px-3 py-2">
        <span className="font-sans text-[13px] font-semibold text-[#CAD3F5]">Active Cues</span>
        <span className="ml-auto rounded-sm bg-[#A6DA95]/15 px-1.5 py-0.5 font-mono text-[10px] text-[#A6DA95]">
          {ACTIVE_CUES.length} running
        </span>
      </div>

      {/* Global controls — buttons + master gain + vertical stereo master meter */}
      <div className="flex shrink-0 items-center gap-2 border-b border-[#363A4F] px-3 py-2">
        {/* Controls column */}
        <div className="flex flex-1 flex-col gap-2">
          {/* Transport buttons */}
          <div className="flex items-center gap-1">
            <GlobalButton icon={<SkipBack className="h-3.5 w-3.5" />} label="Restart All" />
            <GlobalButton
              icon={
                globalPaused
                  ? <Play className="h-3.5 w-3.5" />
                  : <Pause className="h-3.5 w-3.5" />
              }
              label={globalPaused ? "Resume All" : "Pause All"}
              active={globalPaused}
              onClick={() => setGlobalPaused((p) => !p)}
            />
            <GlobalButton
              icon={
                <FadeIcon
                  dir={globalFade === "out" ? "in" : "out"}
                  className="h-3.5 w-3.5"
                />
              }
              label={globalFade === "out" ? "Fade In" : "Fade Out"}
              active={globalFade !== "none"}
              onClick={() => setGlobalFade((f) => (f === "out" ? "in" : "out"))}
            />
            <GlobalButton icon={<X className="h-3.5 w-3.5" />} label="Kill All" danger />
          </div>

          {/* Master gain slider */}
          <div className="flex items-center gap-2">
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-[#A5ADCB]">
              Master
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={gain}
              onChange={(e) => setGain(Number(e.target.value))}
              aria-label="Master gain"
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-[#F5A97F] outline-none focus:ring-2 focus:ring-[#F5A97F]"
              style={{
                background: `linear-gradient(to right, #F5A97F ${gain}%, #11121C ${gain}%)`,
              }}
            />
            <span className="w-12 shrink-0 text-right font-mono text-[10px] tabular-nums text-[#B8C0E0]">
              {gain === 0 ? "-∞" : `${((gain / 100) * 24 - 24).toFixed(1)}`} dB
            </span>
          </div>

          {/* Device status chip */}
          <button
            type="button"
            onClick={() => setDeviceOk((v) => !v)}
            title="Select audio device"
            className="flex w-full items-center gap-2 rounded-full border border-[#363A4F] bg-[#11121C] px-3 py-1 text-left outline-none transition-colors hover:bg-[#181926] focus:ring-2 focus:ring-[#8AADF4]"
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: deviceOk ? "#A6DA95" : "#EED49F" }}
            />
            <span className="font-mono text-[10px] text-[#A5ADCB]">Audio Interface 1</span>
            <span className="ml-auto font-mono text-[10px] text-[#6E738D]">
              {deviceOk ? "Operational" : "Error"}
            </span>
          </button>
        </div>

        {/* Master out vertical stereo meters — flush right */}
        <div className="flex shrink-0 items-end gap-px self-stretch py-0.5">
          <VerticalLEDMeter level={0.72} count={12} width="w-2" />
          <VerticalLEDMeter level={0.66} count={12} width="w-2" />
        </div>
      </div>

      {/* Per-cue rows */}
      <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-2">
        {ACTIVE_CUES.map((cue) => (
          <ActiveCueRow key={cue.id} cue={cue} />
        ))}
      </div>
    </aside>
  )
}
