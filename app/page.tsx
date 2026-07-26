"use client"

import { useState } from "react"
import { Toolbar } from "@/components/articuelate/toolbar"
import { Cuelist } from "@/components/articuelate/cuelist"
import { DetailPanel } from "@/components/articuelate/detail-panel"
import { RuntimeSidebar } from "@/components/articuelate/runtime-sidebar"
import { StatusBar } from "@/components/articuelate/status-bar"
import { CUES } from "@/components/articuelate/cue-data"

export default function Page() {
  const [selectedId, setSelectedId] = useState<string | null>("c2")
  const selectedCue = CUES.find((c) => c.id === selectedId) ?? null

  return (
    <div className="flex h-screen flex-col gap-1 bg-[#181926] font-sans text-[#CAD3F5]">
      {/* Main workspace: left column (toolbar + cuelist + detail) is truncated
          on the right by the full-height runtime sidebar. The 1px gutters let
          the app background show through so panels recede at their edges. */}
      <main className="flex min-h-0 flex-1 gap-1">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Toolbar />
          <Cuelist selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        <RuntimeSidebar />
      </main>

      {/* Contextual editor spans the full window width, beneath the workspace */}
      <DetailPanel cue={selectedCue} />

      <StatusBar selectedCount={selectedId ? 1 : 0} />
    </div>
  )
}
