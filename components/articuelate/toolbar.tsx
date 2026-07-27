"use client"

import { CURRENT_CUE, NEXT_CUE } from "./cue-data"
import { AppIcon } from "@/components/icons"
import type { AppIconName } from "@/components/icons"

function ActionButton({
  name,
  label,
  tone = "default",
  onClick,
}: {
  name: AppIconName
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
          ? "btn-danger"
          : "text-text-secondary hover:text-text-primary"
      }`}
    >
      <AppIcon name={name} className="h-icon-md w-icon-md" />
    </button>
  )
}

export function Toolbar() {
  return (
    <header className="flex shrink-0 flex-col gap-sm bg-surface p-sm">
      {/* Transport + double conductor, composed to a single vertical height */}
      <div className="flex items-stretch gap-sm">
        {/* Panic / GO stack */}
        <div className="transport-group">
          <button
            type="button"
            className="btn-panic btn-danger"
          >
            <AppIcon name="transport.panic" className="h-icon-sm w-icon-sm" />
            Panic
          </button>
          <button
            type="button"
            className="btn-go"
          >
            <AppIcon name="transport.go" className="h-icon-md w-icon-md fill-current" strokeWidth={0} />
            GO
          </button>
        </div>

        {/* Double conductor: current (muted) over next (focus) */}
        <div className="flex min-w-0 flex-1 flex-col gap-sm">
          {/* Current cue */}
          <div className="conductor-current">
            <span className="badge-sm badge-chip badge-running">
              Playing
            </span>
            <span className="shrink-0 font-mono text-mono-sm tabular-nums text-text-disabled">
              {CURRENT_CUE.number}
            </span>
            <span className="truncate font-sans text-body text-text-disabled">
              {CURRENT_CUE.name}
            </span>
          </div>

          {/* Next cue */}
          <div className="conductor-next">
            <span className="badge-sm badge-chip bg-status-standby/15 text-status-standby">
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
        <ActionButton name="cueType.audio" label="Music" />
        <ActionButton name="cueType.control" label="Control" />
        <ActionButton name="cueType.osc" label="OSC" />

        <div className="divider-vert mx-xs h-xl" />

        <span className="label-mono-sm text-text-disabled">
          Selected
        </span>
        <ActionButton name="actions.edit" label="Edit" />
        <ActionButton name="actions.duplicate" label="Duplicate" />
        <ActionButton name="actions.delete" label="Delete" tone="danger" />
      </div>
    </header>
  )
}