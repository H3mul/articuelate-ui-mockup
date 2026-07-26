"use client"

import {
  Play,
  Octagon,
  Music,
  SlidersHorizontal,
  Radio,
  Plus,
  Trash2,
  Pencil,
  Copy,
} from "lucide-react"
import { CURRENT_CUE, NEXT_CUE } from "./cue-data"

function ActionButton({
  icon: Icon,
  label,
  tone = "default",
  onClick,
}: {
  icon: React.ElementType
  label: string
  tone?: "default" | "danger"
  onClick?: () => void
}) {
  const toneCls =
    tone === "danger"
      ? "text-[#ED8796] hover:text-[#ED8796]"
      : "text-[#B8C0E0] hover:text-[#CAD3F5]"
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-8 w-8 items-center justify-center rounded-sm border border-[#363A4F] bg-[#11121C] outline-none transition-colors hover:bg-[#181926] active:bg-[#090A0F] focus:ring-2 focus:ring-[#8AADF4] ${toneCls}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

export function Toolbar() {
  return (
    <header className="flex shrink-0 flex-col gap-1 bg-[#1E2030] p-2">
      {/* Transport + double conductor, composed to a single vertical height */}
      <div className="flex items-stretch gap-2">
        {/* Panic / GO stack — Panic aligns with the current-cue box (top),
            GO grows to align with the taller next-cue box (bottom). */}
        <div className="flex shrink-0 flex-col gap-1">
          <button
            type="button"
            className="flex h-7 w-24 shrink-0 items-center justify-center gap-1.5 rounded-sm border border-[#363A4F] bg-[#11121C] font-sans text-[12px] font-semibold tracking-wide text-[#ED8796] outline-none transition-colors hover:bg-[#181926] active:bg-[#090A0F] focus:ring-2 focus:ring-[#ED8796]"
          >
            <Octagon className="h-3.5 w-3.5" />
            Panic
          </button>
          <button
            type="button"
            className="flex w-24 flex-1 items-center justify-center gap-2 rounded-sm border border-[#494F6A] bg-[#11121C] font-sans text-base font-bold tracking-widest text-[#A6DA95] outline-none transition-colors hover:bg-[#181926] active:bg-[#090A0F] focus:ring-2 focus:ring-[#A6DA95]"
          >
            <Play className="h-4 w-4 fill-current" strokeWidth={0} />
            GO
          </button>
        </div>

        {/* Double conductor: current (muted) over next (focus) */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {/* Current cue — muted attention */}
          <div className="flex h-7 items-center gap-2 rounded-sm border border-[#363A4F] bg-[#181926] px-3">
            <span className="shrink-0 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#6E738D]">
              Playing
            </span>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-[#A5ADCB]">
              {CURRENT_CUE.number}
            </span>
            <span className="truncate font-sans text-[13px] text-[#A5ADCB]">
              {CURRENT_CUE.name}
            </span>
          </div>

          {/* Next cue — the focus */}
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-sm border border-[#494F6A] bg-[#11121C] px-3 py-1.5">
            <span className="shrink-0 rounded-sm bg-[#8AADF4]/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8AADF4]">
              Next
            </span>
            <span className="shrink-0 font-mono text-[15px] font-semibold tabular-nums text-[#EEF2FF]">
              {NEXT_CUE.number}
            </span>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate font-sans text-[15px] font-semibold text-[#EEF2FF]">
                {NEXT_CUE.name}
              </span>
              <span className="truncate font-sans text-[12px] italic text-[#A5ADCB]">
                {NEXT_CUE.notes}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cuelist action toolbar */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6E738D]">
          Add
        </span>
        <ActionButton icon={Music} label="Music" />
        <ActionButton icon={SlidersHorizontal} label="Control" />
        <ActionButton icon={Radio} label="OSC" />

        <div className="mx-1 h-6 w-px bg-[#363A4F]" />

        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6E738D]">
          Selected
        </span>
        <ActionButton icon={Pencil} label="Edit" />
        <ActionButton icon={Copy} label="Duplicate" />
        <ActionButton icon={Trash2} label="Delete" tone="danger" />

        <div className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-[#6E738D]">
          <Plus className="h-3 w-3" />
          drag media to add cues
        </div>
      </div>
    </header>
  )
}
