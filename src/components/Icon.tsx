import {
  Home, Clock, List, Dumbbell, Settings,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  X, Check, Plus, Minus, Flag, FileText, Timer,
  Search, ArrowUp, ArrowRight, Repeat, Bell, Link,
  MoreHorizontal, Download, Upload, Play, GripVertical, Trash2,
} from 'lucide-react';

const ICON_MAP = {
  home: Home,
  history: Clock,
  list: List,
  barbell: Dumbbell,
  settings: Settings,
  chevL: ChevronLeft,
  chevR: ChevronRight,
  chevD: ChevronDown,
  chevU: ChevronUp,
  close: X,
  check: Check,
  plus: Plus,
  minus: Minus,
  flag: Flag,
  note: FileText,
  timer: Timer,
  search: Search,
  arrowUp: ArrowUp,
  arrowR: ArrowRight,
  swap: Repeat,
  bell: Bell,
  link: Link,
  more: MoreHorizontal,
  download: Download,
  upload: Upload,
  play: Play,
  drag: GripVertical,
  trash: Trash2,
} as const;

export type IconName = keyof typeof ICON_MAP;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.5 }: IconProps) {
  const Comp = ICON_MAP[name];
  if (!Comp) return null;
  return <Comp size={size} color={color} strokeWidth={strokeWidth} style={{ flexShrink: 0, display: 'block' }} />;
}
