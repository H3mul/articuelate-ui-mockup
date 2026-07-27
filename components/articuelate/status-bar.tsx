"use client"

import { AppIcon } from "@/components/icons"
import type { AppIconName } from "@/components/icons"

function IconButton({
  name,
  label,
  active,
}: {
  name: AppIconName
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
      <AppIcon name={name} className="h-icon-sm w-icon-sm" />
    </button>
  )
}

export function StatusBar({ selectedCount }: { selectedCount: number }) {
  return (
    <footer className="flex h-toolbar shrink-0 items-center gap-lg bg-surface px-md text-mono-sm text-text-secondary">
      <div className="flex items-center gap-sm">
        <AppIcon name="ui.clock" className="h-icon-sm w-icon-sm" />
        <span className="font-mono tabular-nums text-text-primary">
          Show 00:14:22
        </span>
      </div>

      <div className="flex items-center gap-sm">
        <AppIcon name="ui.mouseClick" className="h-icon-sm w-icon-sm" />
        <span className="font-mono tabular-nums">
          {selectedCount} selected
        </span>
      </div>

      <span className="font-mono tabular-nums text-text-disabled">6 cues</span>

      <div className="ml-auto flex items-center gap-md">
        {/* Global app actions */}
        <div className="flex items-center gap-sm">
          <IconButton name="ui.save" label="Save workspace" />
          <IconButton name="ui.settings" label="Settings" />
        </div>

        <div className="divider-vert h-md" />

        {/* Layout panel toggles */}
        <div className="flex items-center gap-sm">
          <span className="text-text-disabled">Layout</span>
          <IconButton name="ui.layout.columns" label="Columns layout" active />
          <IconButton name="ui.layout.rows" label="Rows layout" />
        </div>
      </div>
    </footer>
  )
}