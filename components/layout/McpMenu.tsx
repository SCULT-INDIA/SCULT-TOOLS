'use client'

import { type DropdownTileItem, DropdownTileMenu } from './DropdownTileMenu'

/** Each row is a real, existing anchor on `/mcp` (see the `id=` attributes
 * on that page's own `<section>`s), not an invented sub-page. */
const ITEMS: readonly DropdownTileItem[] = [
  {
    slug: 'endpoint',
    name: 'The Endpoint',
    icon: 'Network',
    tile: 'green',
    href: '/mcp#endpoint',
  },
  {
    slug: 'connect',
    name: 'Connect',
    icon: 'Rocket',
    tile: 'blue',
    href: '/mcp#connect',
  },
  {
    slug: 'tools',
    name: "What's Callable",
    icon: 'Bot',
    tile: 'lavender',
    href: '/mcp#tools',
  },
  {
    slug: 'rate-limits',
    name: 'Rate Limits',
    icon: 'Gauge',
    tile: 'yellow',
    href: '/mcp#rate-limits',
  },
]

/** The "MCP" dropdown — sections of the single `/mcp` page as a tile
 * grid, with "Explore the MCP server" promoted to the panel's top CTA. */
export function McpMenu() {
  return (
    <DropdownTileMenu
      label="MCP"
      activeMatch={(p) => p === '/mcp'}
      items={ITEMS}
      browseAllHref="/mcp"
      browseAllLabel="Explore the MCP server"
    />
  )
}
