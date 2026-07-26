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
      className={`flex h-4 w-5 items-center justify-center rounded-sm border border-[#363A4F] bg-[#11121C] outline-none hover:bg-[#181926] focus:ring-2 focus:ring-[#8AADF4] ${
        active ? "text-[#CAD3F5]" : "text-[#A5ADCB]"
      }`}
    >
      <Icon className="h-3 w-3" />
    </button>
  )
}

export function StatusBar({ selectedCount }: { selectedCount: number }) {
  return (
    <footer className="flex h-6 shrink-0 items-center gap-4 bg-[#1E2030] px-3 text-[11px] text-[#B8C0E0]">
      <div className="flex items-center gap-1.5">
        <Clock className="h-3 w-3" />
        <span className="font-mono tabular-nums text-[#CAD3F5]">
          Show 00:14:22
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <MousePointerClick className="h-3 w-3" />
        <span className="font-mono tabular-nums">
          {selectedCount} selected
        </span>
      </div>

      <span className="font-mono tabular-nums text-[#A5ADCB]">6 cues</span>

      <div className="ml-auto flex items-center gap-3">
        {/* Global app actions, moved down from the toolbar */}
        <div className="flex items-center gap-1.5">
          <IconButton icon={Save} label="Save workspace" />
          <IconButton icon={Settings} label="Settings" />
        </div>

        <div className="h-3 w-px bg-[#363A4F]" />

        {/* Layout panel toggles */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#A5ADCB]">Layout</span>
          <IconButton icon={Columns2} label="Columns layout" active />
          <IconButton icon={Rows2} label="Rows layout" />
        </div>
      </div>
    </footer>
  )
}
