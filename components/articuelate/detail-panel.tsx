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
    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A5ADCB]">
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
    <label className={`flex flex-col gap-1 ${className}`}>
      <FieldLabel>{label}</FieldLabel>
      <input
        type="text"
        defaultValue={value}
        className={`h-7 rounded-sm border border-[#363A4F] bg-[#11121C] px-2 text-[13px] text-[#CAD3F5] outline-none focus:ring-2 focus:ring-[#8AADF4] ${
          mono ? "font-mono tabular-nums" : "font-sans"
        }`}
      />
    </label>
  )
}

/** Volume slider — accent color orange/peach for music control */
function VolumeSlider({ initial }: { initial: number }) {
  const [value, setValue] = useState(Math.round(initial * 100))
  const db = value === 0 ? "-∞" : `${((value / 100) * 24 - 24).toFixed(1)}`
  return (
    <label className="flex flex-col gap-2">
      <FieldLabel>Target Volume</FieldLabel>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label="Target volume"
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#11121C] outline-none focus:ring-2 focus:ring-[#F5A97F] accent-[#F5A97F]"
        style={{
          background: `linear-gradient(to right, #F5A97F ${value}%, #11121C ${value}%)`,
        }}
      />
      <div className="text-right font-mono text-[11px] tabular-nums text-[#B8C0E0]">
        {db} dB
      </div>
    </label>
  )
}

function DurationField() {
  return (
    <div className="flex flex-col gap-1">
      <FieldLabel>Duration</FieldLabel>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[13px] tabular-nums text-[#CAD3F5]">
          00:45
        </span>
        <span className="font-mono text-[10px] text-[#6E738D]">
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
    <div className="flex flex-col gap-2">
      <FieldLabel>Trigger Condition</FieldLabel>
      <div className="flex gap-1">
        <div className="flex overflow-hidden rounded-sm border border-[#363A4F]">
          {options.map((o) => {
            const active = mode === o.key
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => setMode(o.key)}
                className={`h-7 px-2.5 font-sans text-[12px] outline-none transition-colors focus:ring-1 focus:ring-inset focus:ring-[#8AADF4] ${
                  active
                    ? "bg-[#2F3C5E] text-[#EEF2FF]"
                    : "bg-[#11121C] text-[#A5ADCB] hover:bg-[#181926]"
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
            className="h-7 w-full appearance-none rounded-sm border border-[#363A4F] bg-[#11121C] pl-2 pr-7 font-mono text-[12px] text-[#CAD3F5] outline-none focus:ring-2 focus:ring-[#8AADF4]"
          >
            {CUES.map((c) => (
              <option key={c.id} value={c.number}>
                {c.number} · {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A5ADCB]" />
        </div>
      )}
    </div>
  )
}

function ColorPicker({ initial }: { initial: CueColor }) {
  const [color, setColor] = useState<CueColor>(initial)
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>Highlight</FieldLabel>
      <div className="flex items-center gap-1.5">
        {COLOR_ORDER.map((c) => {
          const active = color === c
          return (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
              className={`h-6 w-6 rounded-full outline-none transition-transform focus:ring-2 focus:ring-[#8AADF4] ${
                active ? "ring-2 ring-[#EEF2FF] ring-offset-2 ring-offset-[#1E2030]" : ""
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
    <div className="grid grid-cols-3 gap-6">
      {/* Column 1: Identity */}
      <div className="flex flex-col gap-4">
        <TextField label="Number" value={cue.number} mono />
        <TextField label="Name" value={cue.name} />
        <label className="flex flex-col gap-1">
          <FieldLabel>Notes</FieldLabel>
          <textarea
            defaultValue={cue.notes}
            className="h-16 resize-none rounded-sm border border-[#363A4F] bg-[#11121C] px-2 py-1.5 font-sans text-[12px] text-[#CAD3F5] outline-none focus:ring-2 focus:ring-[#8AADF4]"
          />
        </label>
      </div>

      {/* Column 2: Timing & Duration */}
      <div className="flex flex-col gap-4">
        <TextField label="Pre-delay" value={cue.preWait} mono />
        <TextField label="Post-delay" value={cue.postWait} mono />
        <DurationField />
      </div>

      {/* Column 3: Trigger & Appearance */}
      <div className="flex flex-col gap-4">
        <TriggerSelector initial={cue.triggerCondition} />
        <ColorPicker initial={cue.color} />
      </div>
    </div>
  )
}

function MusicTab({ cue }: { cue: Cue }) {
  if (cue.kind !== "music") {
    return <div className="text-[13px] text-[#6E738D]">Not a music cue</div>
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Media file */}
      <label className="flex flex-col gap-1">
        <FieldLabel>Media File</FieldLabel>
        <div className="flex h-7 items-center gap-2 rounded-sm border border-[#363A4F] bg-[#11121C] px-2">
          <FileAudio className="h-3.5 w-3.5 shrink-0 text-[#8AADF4]" />
          <span className="truncate font-mono text-[12px] text-[#CAD3F5]">
            {cue.mediaFile}
          </span>
          <button
            type="button"
            className="ml-auto shrink-0 rounded-sm border border-[#363A4F] bg-[#181926] px-2 py-0.5 font-sans text-[11px] text-[#B8C0E0] outline-none hover:bg-[#24273A] focus:ring-2 focus:ring-[#8AADF4]"
          >
            Browse…
          </button>
        </div>
      </label>

      {/* Volume (peach accent) */}
      <VolumeSlider initial={cue.volume} />

      {/* Fade times */}
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Fade In" value="00:02" mono />
        <TextField label="Fade Out" value="00:03" mono />
      </div>
    </div>
  )
}

function OSCTab({ cue }: { cue: Cue }) {
  if (cue.kind !== "osc") {
    return <div className="text-[13px] text-[#6E738D]">Not an OSC cue</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <TextField label="OSC Task" value="/projector/power 1" />
      <TextField label="Host" value="10.0.0.42" />
      <TextField label="Port" value="3333" mono />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center text-[13px] text-[#6E738D]">
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
      className={`px-3 py-2 font-sans text-[12px] font-medium outline-none transition-colors focus:ring-2 focus:ring-inset focus:ring-[#8AADF4] ${
        active
          ? "bg-[#2F3C5E] text-[#EEF2FF]"
          : "bg-[#11121C] text-[#A5ADCB] hover:bg-[#181926] hover:text-[#CAD3F5]"
      }`}
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
    <section className="flex h-64 shrink-0 flex-col bg-[#1E2030]">
      {/* Header: solid tab bar on left, title and cue info on right */}
      <div className="flex shrink-0 items-stretch border-b border-[#363A4F]">
        {/* Solid tab bar */}
        <div className="flex items-stretch gap-0 bg-[#181926]">
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
        <div className="flex items-center gap-3 border-l border-[#363A4F] px-3">
          <span className="font-sans text-[13px] font-semibold text-[#CAD3F5]">
            Cue Settings
          </span>
          {cue && (
            <span className="font-mono text-[12px] text-[#A5ADCB]">
              {cue.number} · {cue.name}
            </span>
          )}
        </div>
      </div>

      {/* Tab content */}
      {!cue ? (
        <EmptyState />
      ) : (
        <div className="flex min-h-0 flex-1 overflow-y-auto p-4">
          {tab === "general" && <GeneralTab cue={cue} />}
          {tab === "music" && <MusicTab cue={cue} />}
          {tab === "osc" && <OSCTab cue={cue} />}
        </div>
      )}
    </section>
  )
}
