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
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`btn-icon-sm outline-none focus:ring-2 focus:ring-border-focus ${
        tone === "danger"
          ? "text-status-error hover:text-status-error"
          : "text-text-secondary hover:text-text-primary"
      }`}
    >
      <Icon className="h-icon-md w-icon-md" />
    </button>
  )
}

export function Toolbar() {
  return (
    <header className="flex shrink-0 flex-col gap-xs bg-surface p-sm">
      {/* Transport + double conductor, composed to a single vertical height */}
      <div className="flex items-stretch gap-sm">
        {/* Panic / GO stack — Panic aligns with the current-cue box (top),
            GO grows to align with the taller next-cue box (bottom). */}
        <div className="transport-group">
          <button
            type="button"
            className="btn-panic"
          >
            <Octagon className="h-icon-sm w-icon-sm" />
            Panic
          </button>
          <button
            type="button"
            className="btn-go"
          >
            <Play className="h-icon-md w-icon-md fill-current" strokeWidth={0} />
            GO
          </button>
        </div>

        {/* Double conductor: current (muted) over next (focus) */}
        <div className="flex min-w-0 flex-1 flex-col gap-xs">
          {/* Current cue — muted attention */}
          <div className="conductor-current">
            <span className="badge-sm badge-running">
              Playing
            </span>
            <span className="shrink-0 font-mono text-mono-sm tabular-nums text-text-disabled">
              {CURRENT_CUE.number}
            </span>
            <span className="truncate font-sans text-body text-text-disabled">
              {CURRENT_CUE.name}
            </span>
          </div>

          {/* Next cue — the focus */}
          <div className="conductor-next">
            <span className="badge-sm badge-next">
              Next
            </span>
            <span className="shrink-0 font-mono text-heading font-semibold tabular-nums text-text-primary">
              {NEXT_CUE.number}
            </span>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate font-sans text-heading font-semibold text-text-primary">
                {NEXT_CUE.name}
              </span>
              <span className="truncate font-sans text-mono-sm italic text-text-disabled">
                {NEXT_CUE.notes}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cuelist action toolbar */}
      <div className="action-toolbar">
        <span className="label-mono-sm text-text-disabled">
          Add
        </span>
        <ActionButton icon={Music} label="Music" />
        <ActionButton icon={SlidersHorizontal} label="Control" />
        <ActionButton icon={Radio} label="OSC" />

        <div className="divider-vert mx-xs h-xl" />

        <span className="label-mono-sm text-text-disabled">
          Selected
        </span>
        <ActionButton icon={Pencil} label="Edit" />
        <ActionButton icon={Copy} label="Duplicate" />
        <ActionButton icon={Trash2} label="Delete" tone="danger" />

        <div className="ml-auto flex items-center gap-sm font-mono text-mono-sm text-text-disabled">
          <Plus className="h-icon-sm w-icon-sm" />
          drag media to add cues
        </div>
      </div>
    </header>
  )
}