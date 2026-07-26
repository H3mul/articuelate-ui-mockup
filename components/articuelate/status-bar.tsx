"use client"

import {
  Clock,
  MousePointerClick,
  Columns2,
  Rows2,
  Save,
  Settings,
} from "lucide-react"

function IconButton({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ElementType
  label: string
  active?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`btn-icon-xs outline-none focus:ring-2 focus:ring-border-focus ${
        active ? "text-text-primary" : "text-text-disabled"
      }`}
    >
      <Icon className="h-icon-sm w-icon-sm" />
    </button>
  )
}

export function StatusBar({ selectedCount }: { selectedCount: number }) {
  return (
    <footer className="flex h-status-bar shrink-0 items-center gap-4 bg-surface px-md text-mono-sm text-text-secondary">
      <div className="flex items-center gap-1.5">
        <Clock className="h-icon-sm w-icon-sm" />
        <span className="font-mono tabular-nums text-text-primary">
          Show 00:14:22
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <MousePointerClick className="h-icon-sm w-icon-sm" />
        <span className="font-mono tabular-nums">
          {selectedCount} selected
        </span>
      </div>

      <span className="font-mono tabular-nums text-text-disabled">6 cues</span>

      <div className="ml-auto flex items-center gap-3">
        {/* Global app actions, moved down from the toolbar */}
        <div className="flex items-center gap-1.5">
          <IconButton icon={Save} label="Save workspace" />
          <IconButton icon={Settings} label="Settings" />
        </div>

        <div className="divider-vert h-3" />

        {/* Layout panel toggles */}
        <div className="flex items-center gap-1.5">
          <span className="text-text-disabled">Layout</span>
          <IconButton icon={Columns2} label="Columns layout" active />
          <IconButton icon={Rows2} label="Rows layout" />
        </div>
      </div>
    </footer>
  )
}