"use client"

import { CURRENT_CUE, NEXT_CUE } from "./cue-data"
import { AppIcon } from "@/components/icons"

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
    </header>
  )
}