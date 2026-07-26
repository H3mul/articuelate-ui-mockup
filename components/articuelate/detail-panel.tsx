"use client"

import { useState } from "react"
import { FileAudio, ChevronDown } from "lucide-react"
import type { Cue, CueColor, TriggerCondition } from "./cue-data"
import { CUES, CUE_COLORS } from "./cue-data"

const COLOR_ORDER: CueColor[] = [
  "none",
  "red",
  "orange",
  "green",
  "blue",
  "purple",
]

type TabType = "general" | "music" | "osc"

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="field-label">
      {children}
    </span>
  )
}

function TextField({
  label,
  value,
  mono = false,
  className = "",
}: {
  label: string
  value: string
  mono?: boolean
  className?: string
}) {
  return (
    <label className={`flex flex-col gap-xs ${className}`}>
      <FieldLabel>{label}</FieldLabel>
      <input
        type="text"
        defaultValue={value}
        className={`input-md ${mono ? "font-mono tabular-nums" : "font-sans"}`}
      />
    </label>
  )
}

/** Volume slider — accent color orange/peach for music control */
function VolumeSlider({ initial }: { initial: number }) {
  const [value, setValue] = useState(Math.round(initial * 100))
  const db = value === 0 ? "-∞" : `${((value / 100) * 24 - 24).toFixed(1)}`
  return (
    <label className="flex flex-col gap-sm">
      <FieldLabel>Target Volume</FieldLabel>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label="Target volume"
        className="slider-peach"
        style={{
          background: `linear-gradient(to right, var(--color-status-group) ${value}%, var(--color-element) ${value}%)`,
        }}
      />
      <div className="text-right font-mono text-mono-sm tabular-nums text-text-secondary">
        {db} dB
      </div>
    </label>
  )
}

function DurationField() {
  return (
    <div className="flex flex-col gap-xs">
      <FieldLabel>Duration</FieldLabel>
      <div className="flex items-baseline gap-sm">
        <span className="font-mono text-body tabular-nums text-text-primary">
          00:45
        </span>
        <span className="font-mono text-mono-sm text-text-disabled">
          (derived from media)
        </span>
      </div>
    </div>
  )
}

function TriggerSelector({ initial }: { initial: TriggerCondition }) {
  const [mode, setMode] = useState<TriggerCondition>(initial)
  const options: { key: TriggerCondition; label: string }[] = [
    { key: "playhead", label: "Playhead" },
    { key: "with", label: "With Cue" },
    { key: "after", label: "After Cue" },
  ]
  return (
    <div className="flex flex-col gap-sm">
      <FieldLabel>Trigger Condition</FieldLabel>
      <div className="flex gap-xs">
        <div className="flex overflow-hidden rounded-sm border border-element-border">
          {options.map((o) => {
            const active = mode === o.key
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => setMode(o.key)}
                className={`tab-btn ${
                  active ? "tab-btn-active" : "tab-btn-inactive"
                }`}
              >
                {o.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Target cue selector on a new line for with/after */}
      {mode !== "playhead" && (
        <div className="relative">
          <select
            defaultValue="4"
            aria-label="Target cue"
            className="h-control-sm w-full appearance-none rounded-sm border border-element-border bg-element pl-sm pr-7 font-mono text-mono-sm text-text-primary outline-none focus:ring-2 focus:ring-border-focus"
          >
            {CUES.map((c) => (
              <option key={c.id} value={c.number}>
                {c.number} · {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-icon-sm w-icon-sm -translate-y-1/2 text-text-disabled" />
        </div>
      )}
    </div>
  )
}

function ColorPicker({ initial }: { initial: CueColor }) {
  const [color, setColor] = useState<CueColor>(initial)
  return (
    <div className="flex flex-col gap-sm">
      <FieldLabel>Highlight</FieldLabel>
      <div className="flex items-center gap-xs.5">
        {COLOR_ORDER.map((c) => {
          const active = color === c
          return (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
              className={`h-xl w-xl rounded-full outline-none transition-transform focus:ring-2 focus:ring-border-focus ${
                active ? "ring-2 ring-white ring-offset-2 ring-offset-surface" : ""
              }`}
              style={{
                backgroundColor: CUE_COLORS[c],
                opacity: c === "none" ? 0.5 : 1,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

function GeneralTab({ cue }: { cue: Cue }) {
  return (
    <div className="grid grid-cols-3 gap-xl">
      {/* Column 1: Identity */}
      <div className="flex flex-col gap-lg">
        <TextField label="Number" value={cue.number} mono />
        <TextField label="Name" value={cue.name} />
        <label className="flex flex-col gap-xs">
          <FieldLabel>Notes</FieldLabel>
          <textarea
            defaultValue={cue.notes}
            className="field-textarea"
          />
        </label>
      </div>

      {/* Column 2: Timing & Duration */}
      <div className="flex flex-col gap-lg">
        <TextField label="Pre-delay" value={cue.preWait} mono />
        <TextField label="Post-delay" value={cue.postWait} mono />
        <DurationField />
      </div>

      {/* Column 3: Trigger & Appearance */}
      <div className="flex flex-col gap-lg">
        <TriggerSelector initial={cue.triggerCondition} />
        <ColorPicker initial={cue.color} />
      </div>
    </div>
  )
}

function MusicTab({ cue }: { cue: Cue }) {
  if (cue.kind !== "music") {
    return <div className="text-body text-text-disabled">Not a music cue</div>
  }

  return (
    <div className="flex flex-col gap-lg">
      {/* Media file */}
      <label className="flex flex-col gap-xs">
        <FieldLabel>Media File</FieldLabel>
        <div className="flex h-control-sm items-center gap-sm rounded-sm border border-element-border bg-element px-sm">
          <FileAudio className="h-icon-sm w-icon-sm shrink-0 text-status-playhead" />
          <span className="truncate font-mono text-mono-sm text-text-primary">
            {cue.mediaFile}
          </span>
          <button
            type="button"
            className="ml-auto shrink-0 rounded-sm border border-element-border bg-element-hover px-sm py-xs font-sans text-mono-sm text-text-secondary outline-none hover:bg-surface-raised focus:ring-2 focus:ring-border-focus"
          >
            Browse…
          </button>
        </div>
      </label>

      {/* Volume (peach accent) */}
      <VolumeSlider initial={cue.volume} />

      {/* Fade times */}
      <div className="grid grid-cols-2 gap-md">
        <TextField label="Fade In" value="00:02" mono />
        <TextField label="Fade Out" value="00:03" mono />
      </div>
    </div>
  )
}

function OSCTab({ cue }: { cue: Cue }) {
  if (cue.kind !== "osc") {
    return <div className="text-body text-text-disabled">Not an OSC cue</div>
  }

  return (
    <div className="flex flex-col gap-lg">
      <TextField label="OSC Task" value="/projector/power 1" />
      <TextField label="Host" value="10.0.0.42" />
      <TextField label="Port" value="3333" mono />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center text-body text-text-disabled">
      Select a cue to edit its settings
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? "tab-btn-active" : "tab-btn-inactive"}
    >
      {children}
    </button>
  )
}

export function DetailPanel({ cue }: { cue: Cue | null }) {
  const [tab, setTab] = useState<TabType>("general")

  // Determine available tabs based on cue type
  const tabs: TabType[] = ["general"]
  if (cue?.kind === "music") tabs.push("music")
  if (cue?.kind === "osc") tabs.push("osc")

  return (
    <section className="detail-panel flex-col">
      {/* Header: solid tab bar on left, title and cue info on right */}
      <div className="flex shrink-0 items-stretch border-b border-element-border">
        {/* Solid tab bar */}
        <div className="flex items-stretch gap-0 bg-element-hover">
          {tabs.map((t) => (
            <TabButton
              key={t}
              active={tab === t}
              onClick={() => setTab(t)}
            >
              {t === "general" && "General"}
              {t === "music" && "Audio"}
              {t === "osc" && "OSC"}
            </TabButton>
          ))}
        </div>

        {/* Title and cue info */}
        <div className="flex items-center gap-md border-l border-element-border px-md">
          <span className="font-sans text-body font-semibold text-text-primary">
            Cue Settings
          </span>
          {cue && (
            <span className="font-mono text-mono-sm text-text-disabled">
              {cue.number} · {cue.name}
            </span>
          )}
        </div>
      </div>

      {/* Tab content */}
      {!cue ? (
        <EmptyState />
      ) : (
        <div className="flex min-h-0 flex-1 overflow-y-auto p-lg">
          {tab === "general" && <GeneralTab cue={cue} />}
          {tab === "music" && <MusicTab cue={cue} />}
          {tab === "osc" && <OSCTab cue={cue} />}
        </div>
      )}
    </section>
  )
}