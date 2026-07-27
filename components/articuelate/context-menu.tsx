"use client"

import { useState, useRef, useEffect, useLayoutEffect } from "react"
import { AppIcon } from "@/components/icons"

export type ContextMenuAction =
  | "addBefore"
  | "addAfter"
  | "changeType"
  | "duplicate"
  | "delete"

const CUE_TYPE_ITEMS = [
  { type: "audio" as const, label: "Music", icon: "cueType.audio" },
  { type: "control" as const, label: "Playback", icon: "cueType.control" },
  { type: "osc" as const, label: "OSC", icon: "cueType.osc" },
]

const MENU_ITEMS: { action: ContextMenuAction; label: string; icon: string; danger?: boolean; separator?: boolean; hasSubmenu?: boolean }[] = [
  { action: "addBefore", label: "Add Cue Before", icon: "actions.add", hasSubmenu: true },
  { action: "addAfter", label: "Add Cue After", icon: "actions.add", separator: true, hasSubmenu: true },
  { action: "changeType", label: "Change Cue Type", icon: "cueType.control", hasSubmenu: true },
  { action: "duplicate", label: "Duplicate Cue", icon: "actions.duplicate" },
  { action: "delete", label: "Delete Cue", icon: "actions.delete", danger: true },
]

export function CueTypeSubmenu({
  onSelect,
  onClose,
}: {
  onSelect: (cueType: string) => void
  onClose: () => void
}) {
  const [selected, setSelected] = useState("audio")

  return (
    <div className="flex rounded-sm outline outline-2 outline-border-subtle shadow-lg overflow-hidden">
      {CUE_TYPE_ITEMS.map((item) => (
        <button
          key={item.type}
          type="button"
          className={`flex items-center gap-xs px-sm text-left text-mono-sm outline-none transition-colors h-xl ${
            selected === item.type
              ? "bg-selection text-text-primary"
              : "bg-element text-text-secondary hover:bg-element-hover"
          }`}
          onClick={() => {
            setSelected(item.type)
            onSelect(item.type)
            onClose()
          }}
          onMouseEnter={() => setSelected(item.type)}
        >
          <AppIcon name={item.icon as any} className="h-icon-sm w-icon-sm" />
          {item.label}
        </button>
      ))}
    </div>
  )
}

export function ContextMenu({
  open,
  onClose,
  onAction,
  position,
}: {
  open: boolean
  onClose: () => void
  onAction: (action: ContextMenuAction, cueType?: string) => void
  position: { x: number; y: number } | null
}) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [submenuItem, setSubmenuItem] = useState<string | null>(null)
  const [submenuPos, setSubmenuPos] = useState<{ x: number; y: number } | null>(null)
  const [submenuFlip, setSubmenuFlip] = useState(false)
  const [menuFlip, setMenuFlip] = useState(false)
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const submenuRef = useRef<HTMLDivElement>(null)

  const showSubmenu = (action: string | null) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    if (action) {
      setSubmenuItem(action)
      const rect = itemRefs.current[action]?.getBoundingClientRect()
      if (rect) {
        const sidebarW = 320
        const boundary = window.innerWidth - sidebarW
        const submenuW = 180
        const overflows = rect.right + 10 + submenuW > boundary
        const x = overflows ? rect.left - 10 - submenuW : rect.right + 10
        setSubmenuFlip(overflows)
        setSubmenuPos({ x, y: rect.top + (rect.height - 24) / 2 })
      }
    } else {
      hoverTimer.current = setTimeout(() => {
        setSubmenuItem(null)
      }, 150)
    }
  }

  const keepSubmenu = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
  }

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [open, onClose])

  // Cleanup hover timer on unmount
  useEffect(() => {
    return () => { if (hoverTimer.current) clearTimeout(hoverTimer.current) }
  }, [])

  // Submenu position is handled by useLayoutEffect below after submenu renders
  useEffect(() => {}, [submenuItem])

  // Measure submenu width after render and adjust position with flip
  useLayoutEffect(() => {
    if (!submenuRef.current || !submenuItem) return
    const sidebarW = 320
    const boundary = window.innerWidth - sidebarW
    const submenuW = submenuRef.current.offsetWidth
    const menuItem = itemRefs.current[submenuItem]
    if (!menuItem) return
    const rect = menuItem.getBoundingClientRect()
    const overflows = rect.right + 10 + submenuW > boundary
    const x = overflows ? rect.left - 10 - submenuW : rect.right + 10
    const y = rect.top + (rect.height - 24) / 2
    setSubmenuFlip(overflows)
    setSubmenuPos({ x, y })
  }, [submenuItem])

  if (!open || !position) return null

  // Measure menu width after render and flip if it would overlap the sidebar
  useLayoutEffect(() => {
    if (!menuRef.current) return
    const sidebarW = 320
    const boundary = window.innerWidth - sidebarW
    const menuW = menuRef.current.offsetWidth
    const flip = position.x + menuW > boundary
    setMenuFlip(flip)
  }, [open, position])

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-max rounded-sm border-2 border-border-subtle bg-element shadow-lg"
      style={{ top: position.y, left: menuFlip ? position.x - (menuRef.current?.offsetWidth ?? 0) : position.x }}
    >
      {MENU_ITEMS.map((item) => (
        <div key={item.action}>
          <button
            ref={(el) => { itemRefs.current[item.action] = el }}
            type="button"
            className={`flex w-full items-center gap-sm px-md py-xs text-left text-body outline-none transition-colors ${
              item.danger
                ? "text-status-error hover:bg-status-error-bg"
                : "text-text-primary hover:bg-selection focus:bg-selection"
            }`}
            onClick={() => {
              if (item.hasSubmenu) {
                // submenu handles selection
              } else {
                onAction(item.action)
                onClose()
              }
            }}
            onMouseEnter={() => showSubmenu(item.hasSubmenu ? item.action : null)}
            onMouseLeave={() => { if (!item.hasSubmenu) showSubmenu(null) }}
          >
            <AppIcon name={item.icon as any} className="h-icon-sm w-icon-sm shrink-0" />
            {item.label}
          </button>
          {item.separator && <div className="mx-md my-xs h-px bg-element-border" />}
        </div>
      ))}

      {submenuItem && submenuPos && (
        <div
          ref={submenuRef}
          className="fixed z-50"
          style={{ top: submenuPos.y, left: submenuPos.x }}
          onMouseEnter={() => keepSubmenu()}
          onMouseLeave={() => showSubmenu(null)}
        >
          <CueTypeSubmenu
            onSelect={(cueType) => {
              onAction(submenuItem as ContextMenuAction, cueType)
              onClose()
            }}
            onClose={onClose}
          />
        </div>
      )}
    </div>
  )
}

export function MenuButton({
  onOpen,
}: {
  onOpen: (x: number, y: number) => void
}) {
  const btnRef = useRef<HTMLSpanElement>(null)

  return (
    <span
      ref={btnRef}
      role="button"
      tabIndex={0}
      className="btn-icon-xs cursor-pointer outline-none focus:ring-2 focus:ring-border-focus"
      aria-label="Cue menu"
      title="Cue menu"
      onClick={(e) => {
        e.stopPropagation()
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        onOpen(rect.left, rect.bottom)
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
          onOpen(rect.left, rect.bottom)
        }
      }}
    >
      <AppIcon name="ui.menu" className="h-icon-sm w-icon-sm" />
    </span>
  )
}