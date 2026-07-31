/**
 * The shared tool-workspace primitives — docs/TOOL_REDESIGN_PLAN.md §3.
 *
 * Every tool imports from here rather than reaching into individual files, so
 * the workspace stays one coherent surface and a change to its contract is a
 * change in one place.
 */
export { CodePane } from './CodePane'
export { DropZone } from './DropZone'
export { ErrorDetail, StatusBar } from './StatusBar'
export { SegmentButton, ToolbarAction, ToolbarGroup, ToolToolbar } from './ToolToolbar'
export { Pane, ToolWorkspace } from './ToolWorkspace'
