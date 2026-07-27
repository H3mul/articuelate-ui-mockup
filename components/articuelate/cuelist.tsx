"use client"

import { useState, useRef } from "react"
import { AppIcon } from "@/components/icons"
import type { AppIconName } from "@/components/icons"
import type { Cue, CueKind } from "./cue-data"
import { CUES, CUE_COLORS } from "./cue-data"
import { MenuButton, ContextMenu, CueTypeSubmenu } from "./context-menu"
import type { ContextMenuAction } from "./context-menu"

/** Convert "MM:SS" to "M:SS.000" microsecond-style display. */
function microtime(mmss: string): string {
  const [m, s] = mmss.split(":")
  return `${parseInt(m, 10)}:${s}.00`
}

/** Strip the cue type prefix from target text (e.g. "audio · file.wav" → "file.wav"). */
function stripType(target: string): string {
  const sep = " · "
  const idx = target.indexOf(sep)
  return idx === -1 ? target : target.slice(idx + sep.length)
}

const CUE_TYPE_ICON: Record<CueKind, AppIconName> = {
  group: "cueType.group",
  fade: "cueType.fade",
  osc: "cueType.osc",
  control: "cueType.control",
  music: "cueType.audio",
}

function KindIcon({ kind }: { kind: CueKind }) {
  return <AppIcon name={CUE_TYPE_ICON[kind]} className="h-icon-sm w-icon-sm shrink-0" />
}

/**
 * A time cell whose progress is rendered as a background rectangle behind the
 * text (QLab-style), rather than as a separate bar. `fill` fills proportionally;
 * `outline` marks an armed/standby cell.
 */
function TimeCell({
  value,
  fill = 0,
  variant = "plain",
  emphasize = false,
}: {
  value: string
  fill?: number
  variant?: "plain" | "fill"
  emphasize?: boolean
}) {
  return (
    <div
      className="time-cell"
      style={variant === "fill" ? { border: "2px solid var(--color-status-running-bg-30)" } : undefined}
    >
      {variant === "fill" && (
        <div
          className="time-cell-fill"
          style={{ width: `${Math.min(1, Math.max(0, fill)) * 100}%` }}
        />
      )}
      <span className={variant === "fill" || emphasize ? "time-cell-text-emphasis" : "time-cell-text-muted"}>
        {value}
      </span>
    </div>
  )
}

function CueRow({
  cue,
  zebra,
  selected,
  onSelect,
  onMenuOpen,
}: {
  cue: Cue
  zebra: boolean
  selected: boolean
  onSelect: () => void
  onMenuOpen: (id: string, x: number, y: number) => void
}) {
  const running = cue.state === "running"
  const standby = cue.state === "standby"
  const stripe = cue.color !== "none" ? CUE_COLORS[cue.color] : undefined

  let rowCls = "cue-row-grid"
  if (selected) rowCls += " cue-row-selected"
  else if (running) rowCls += " cue-row-running"
  else if (zebra) rowCls += " bg-surface-raised"
  else rowCls += " bg-surface"

  return (
    <button
      type="button"
      onClick={onSelect}
      onContextMenu={(e) => {
        e.preventDefault()
        onMenuOpen(cue.id, e.clientX, e.clientY)
      }}
      className={rowCls}
      style={{ borderLeft: `3px solid ${stripe ?? "transparent"}` }}
    >
      {/* Drag handle */}
      <div className="drag-handle">
        <AppIcon name="ui.grip" className="h-icon-sm w-icon-sm" />
      </div>

      {/* Playhead */}
      <div className="flex items-center justify-center">
        {standby && (
          <AppIcon name="transport.play" className="h-icon-sm w-icon-sm fill-status-playhead text-status-playhead" strokeWidth={0} />
        )}
        {running && (
          <AppIcon name="transport.play" className="h-icon-sm w-icon-sm fill-status-running text-status-running" strokeWidth={0} />
        )}
      </div>

      {/* Cue number */}
      <div className={`font-mono text-mono-sm tabular-nums text-left ${running ? "text-status-running" : "text-text-secondary"}`}>
        {cue.number}
      </div>

      {/* Name · type icon */}
      <div
        className="flex min-w-0 items-center gap-sm"
        style={{ paddingLeft: `calc(var(--spacing-icon-sm) * ${cue.depth})` }}
      >
        <span className="text-text-disabled">
          <KindIcon kind={cue.kind} />
        </span>
        <span className={`shrink truncate font-sans font-medium ${selected ? "text-text-primary" : "text-text-primary"}`}>
          {cue.name}
        </span>
      </div>

      {/* Context / target */}
      <div className="truncate font-mono text-mono-sm text-left text-text-disabled">
        {stripType(cue.target)}
      </div>

      {/* Pre-wait */}
      <TimeCell
        value={microtime(cue.preWait)}
        variant={cue.preProgress ? "fill" : "plain"}
        fill={cue.preProgress ?? 0}
      />

      {/* Duration */}
      <TimeCell
        value={microtime(cue.duration)}
        variant={running ? "fill" : standby ? "outline" : "plain"}
        fill={cue.progress ?? 0}
        emphasize={running}
      />

      {/* Post-wait */}
      <TimeCell
        value={microtime(cue.postWait)}
        variant={cue.postProgress ? "fill" : "plain"}
        fill={cue.postProgress ?? 0}
      />

      {/* Context menu */}
      <div className="flex items-center justify-center">
        <MenuButton onOpen={(x, y) => onMenuOpen(cue.id, x, y)} />
      </div>
    </button>
  )
}

export function Cuelist({
  selectedId,
  onSelect,
}: {
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const [menuCueId, setMenuCueId] = useState<string | null>(null)
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const addBtnRef = useRef<HTMLButtonElement>(null)
  const addTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openMenu = (id: string, x: number, y: number) => {
    onSelect(id)
    setMenuCueId(id)
    setMenuPos({ x, y })
  }

  return (
    <section className="panel-surface flex min-h-0 flex-1 flex-col">
      {/* Header row */}
      <div className="cuelist-header">
        <div />
        <div />
        <div>Cue</div>
        <div>Name</div>
        <div />
        <div className="text-center">Pre</div>
        <div className="text-center">Duration</div>
        <div className="text-center">Post</div>
        <div />
      </div>

      {/* Scrollable cue list + footer */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {CUES.map((cue, i) => (
          <CueRow
            key={cue.id}
            cue={cue}
            zebra={i % 2 === 1}
            selected={cue.id === selectedId}
            onSelect={() => onSelect(cue.id)}
            onMenuOpen={(id, x, y) => openMenu(id, x, y)}
          />
        ))}

        {/* Cuelist footer */}
        <div className="flex shrink-0 items-center border-t border-border-divider-40 pt-md pb-md px-sm">
          <button
            ref={addBtnRef}
            type="button"
            className="btn-icon-xs"
            aria-label="Add cue"
            title="Add cue"
            onMouseEnter={() => {
              if (addTimerRef.current) clearTimeout(addTimerRef.current)
              setAddOpen(true)
            }}
            onMouseLeave={() => {
              addTimerRef.current = setTimeout(() => setAddOpen(false), 200)
            }}
          >
            <AppIcon name="actions.add" className="h-icon-sm w-icon-sm" />
          </button>
          {addOpen && addBtnRef.current && (
            <div
              className="fixed z-50"
              style={{
                top: addBtnRef.current.getBoundingClientRect().top,
                left: addBtnRef.current.getBoundingClientRect().right + 8,
              }}
              onMouseEnter={() => {
                if (addTimerRef.current) clearTimeout(addTimerRef.current)
                setAddOpen(true)
              }}
              onMouseLeave={() => {
                addTimerRef.current = setTimeout(() => setAddOpen(false), 200)
              }}
            >
              <CueTypeSubmenu
                onSelect={(cueType) => {
                  console.log("add cue", cueType)
                  setAddOpen(false)
                }}
                onClose={() => setAddOpen(false)}
              />
            </div>
          )}
        </div>
      </div>
    {/* Context menu rendered outside the button hierarchy */}
      {menuCueId && (
        <ContextMenu
          open={true}
          onClose={() => { setMenuCueId(null); setMenuPos(null) }}
          onAction={(action, cueType) => {
            console.log(menuCueId, action, cueType)
            setMenuCueId(null)
            setMenuPos(null)
          }}
          position={menuPos}
        />
      )}
    </section>
  )
}