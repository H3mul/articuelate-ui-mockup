import {
  Play,
  Pause,
  X,
  Octagon,
  SkipBack,
  Spline,
  Music,
  Folder,
  ListVideo,
  Network,
  Plus,
  Trash2,
  Pencil,
  Copy,
  FileAudio,
  ChevronDown,
  Settings,
  Save,
  Columns2,
  Rows2,
  Clock,
  MousePointerClick,
  GripVertical,
  EllipsisVertical,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  // Transport
  "transport.play": Play,
  "transport.pause": Pause,
  "transport.stop": X,
  "transport.panic": Octagon,
  "transport.skipBack": SkipBack,
  "transport.go": Play,
  "transport.go.fill": Play,

  // Cue types
  "cueType.audio": Music,
  "cueType.group": Folder,
  "cueType.control": ListVideo,
  "cueType.osc": Network,
  "cueType.fade": Spline,

  // Actions
  "actions.add": Plus,
  "actions.delete": Trash2,
  "actions.edit": Pencil,
  "actions.duplicate": Copy,
  "actions.browse": FileAudio,

  // UI
  "ui.settings": Settings,
  "ui.save": Save,
  "ui.layout.columns": Columns2,
  "ui.layout.rows": Rows2,
  "ui.clock": Clock,
  "ui.mouseClick": MousePointerClick,
  "ui.chevronDown": ChevronDown,
  "ui.fileAudio": FileAudio,
  "ui.grip": GripVertical,
  "ui.menu": EllipsisVertical,
}

export type AppIconName = keyof typeof ICON_MAP

export function AppIcon({
  name,
  className = "",
  size,
  ...props
}: {
  name: AppIconName
  className?: string
  size?: number
  [key: string]: unknown
}) {
  const Icon = ICON_MAP[name]
  if (!Icon) return null

  return <Icon className={className} size={size} {...props} />
}