import {
  AppWindow,
  Braces,
  Briefcase,
  Code,
  FileCode2,
  Gauge,
  Lightbulb,
  Link2,
  Mail,
  MessageCircleQuestion,
  Palette,
  QrCode,
  Quote,
  Radar,
  Receipt,
  Search,
  Timer,
  TrendingUp,
  Type,
  Wrench,
} from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'

/**
 * Registry entries name their icon as a string, so the registry stays a plain
 * data module with no React imports. This maps those names to components.
 *
 * Importing named icons individually (rather than the barrel) keeps the bundle
 * to only the icons actually used.
 *
 * Unknown names fall back to a wrench rather than throwing, so a typo in the
 * registry degrades visually instead of breaking the build. The registry test
 * asserts every referenced icon resolves, which is where a typo gets caught.
 */
const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  AppWindow,
  Braces,
  Briefcase,
  Code,
  FileCode2,
  Gauge,
  Lightbulb,
  Link2,
  Mail,
  MessageCircleQuestion,
  Palette,
  QrCode,
  Quote,
  Radar,
  Receipt,
  Search,
  Timer,
  TrendingUp,
  Type,
}

export function hasIcon(name: string): boolean {
  return name in ICONS
}

export function Icon({
  name,
  className,
  ...rest
}: { name: string; className?: string } & SVGProps<SVGSVGElement>) {
  const Cmp = ICONS[name] ?? Wrench
  return <Cmp className={className} aria-hidden="true" focusable="false" {...rest} />
}
