/*!
 * Wunderbaum - types
 * Copyright (c) 2021-2022, Martin Wendt. Released under the MIT license.
 * @VERSION, @DATE (https://github.com/mar10/wunderbaum)
 */

import { WunderbaumNode } from "./wb_node";
import { Wunderbaum } from "./wunderbaum";

/** Passed to find... methods. Should return true if node matches. */
export type MatcherCallback = (node: WunderbaumNode) => boolean;
/** When set as option, called when the value is needed (e.g. `colspan` type definition). */
export type BoolOptionResolver = (node: WunderbaumNode) => boolean;
/** When set as option, called when the value is needed (e.g. `icon` type definition). */
export type BoolOrStringOptionResolver = (
  node: WunderbaumNode
) => boolean | string;

export type NodeAnyCallback = (node: WunderbaumNode) => any;
export type NodeStringCallback = (node: WunderbaumNode) => string;

export type NodeVisitResponse = "skip" | boolean | void;
export type NodeVisitCallback = (node: WunderbaumNode) => NodeVisitResponse;

// type WithWildcards<T> = T & { [key: string]: unknown };

/* -----------------------------------------------------------------------------
 * EVENT CALLBACK TYPES
 * ---------------------------------------------------------------------------*/

export interface WbTreeEventType {
  /** Name of the event. */
  type: string;
  /** The affected tree instance. */
  tree: Wunderbaum;
  /** Exposed utility module methods. */
  util: any;
  /** Originating HTML event, e.g. `click` if any. */
  event?: Event;
  // [key: string]: unknown;
}

export interface WbNodeEventType extends WbTreeEventType {
  /** The affected target node. */
  node: WunderbaumNode;
  /**
   * Contains the node's type information, i.e. `tree.types[node.type]` if
   * defined. Set to `{}` otherwise. @see {@link Wunderbaum.types}
   */
  typeInfo: NodeTypeDefinition;
}

export interface WbActivateEventType extends WbNodeEventType {
  prevNode: WunderbaumNode;
  /** The original event. */
  event: Event;
}

export interface WbChangeEventType extends WbNodeEventType {
  info: WbEventInfo;
  inputElem: HTMLInputElement;
  inputValue: any;
}

export interface WbClickEventType extends WbTreeEventType {
  /** The original event. */
  event: MouseEvent;
  node: WunderbaumNode;
  info: WbEventInfo;
}

export interface WbErrorEventType extends WbNodeEventType {
  error: any;
}

export interface WbDeactivateEventType extends WbNodeEventType {
  nextNode: WunderbaumNode;
  /** The original event. */
  event: Event;
}

export interface WbEnhanceTitleEventType extends WbNodeEventType {
  titleSpan: HTMLSpanElement;
}

export interface WbFocusEventType extends WbTreeEventType {
  /** The original event. */
  event: FocusEvent;
  /** True if `focusin`, false if `focusout`. */
  flag: boolean;
}

export interface WbKeydownEventType extends WbTreeEventType {
  /** The original event. */
  event: KeyboardEvent;
  node: WunderbaumNode;
  info: WbEventInfo;
  /** Canical name of the key including modifiers. @see {@link eventToString} */
  eventName: string;
}

export interface WbInitEventType extends WbTreeEventType {
  error?: any;
}

export interface WbReceiveEventType extends WbNodeEventType {
  response: any;
}

export interface WbRenderEventType extends WbNodeEventType {
  /**
   * True if the node's markup was not yet created. In this case the render
   * event should create embeddeb input controls (in addition to update the
   * values according to to current node data).
   */
  isNew: boolean;
  /** The node's `<span class='wb-node'>` element. */
  nodeElem: HTMLSpanElement;
  /** True if the node only displays the title and is stretched over all remaining columns. */
  isColspan: boolean;
  /**
   * Array of node's `<span class='wb-col'>` elements.
   * The first element is `<span class='wb-node wb-col'>`, which contains the
   * node title and icon (`idx: 0`, id: '*'`).
   */
  allColInfosById: ColumnEventInfoMap;
  /**
   * Array of node's `<span class='wb-node'>` elements, *that should be rendered*.
   * In contrast to `allColInfosById`, the node title is not part of this array.
   * If node.isColspan() is true, this array is empty (`[]`).
   */
  renderColInfosById: ColumnEventInfoMap;
}

/**
 * Contains the node's type information, i.e. `tree.types[node.type]` if
 * defined. @see {@link Wunderbaum.types}
 */
export interface NodeTypeDefinition {
  // /** Type ID that matches `node.type`. */
  // id: string;
  /** En/disable checkbox for matching nodes. */
  checkbox?: boolean | BoolOrStringOptionResolver;
  /** Optional class names that are added to all `div.wb-row` elements of matching nodes. */
  classes?: string;
  /** Only show title and hide other columns if any. */
  colspan?: boolean | BoolOptionResolver;
  /** Default icon for matching nodes. */
  icon?: boolean | string | BoolOrStringOptionResolver;
  /**
   * See also {@link WunderbaumNode.getOption|WunderbaumNode.getOption()}
   * to evaluate `node.NAME` setting and `tree.types[node.type].NAME`.
   */
  // and more
  [key: string]: unknown;
  // _any: any;
}

/* -----------------------------------------------------------------------------
 * DATA TYPES
 * ---------------------------------------------------------------------------*/

export type NodeTypeDefinitionMap = { [type: string]: NodeTypeDefinition };

/**
 * Column type definitions.
 * @see {@link `Wunderbaum.columns`}
 */
export interface ColumnDefinition {
  /** Column ID as defined in `tree.columns` definition ("*" for title column). */
  id: string;
  /** Column header (defaults to id) */
  title: string;
  /** Column header tooltip (optional) */
  tooltip?: string;
  /** Column width or weight.
   * Either an absolute pixel value (e.g. `"50px"`) or a relative weight (e.g. `1`)
   * that is used to calculate the width  inside the remaining available space.
   * Default: `"*"`, which is interpreted as `1`.
   */
  width?: string | number;
  /** Only used for columns with a relative weight.
   * Default: `4px`.
   */
  minWidth?: string | number;
  /** Optional class names that are added to all `span.wb-col` elements of that column.*/
  classes?: string;
  /** Optional HTML content that is rendered into all `span.wb-col` elements of that column.*/
  html?: string;
  // Internal use:
  _weight?: number;
  _widthPx?: number;
  _ofsPx?: number;
}

export type ColumnDefinitionList = Array<ColumnDefinition>;

/**
 * Column information (passed to the `render` event).
 */
export interface ColumnEventInfo {
  /** Column ID as defined in `tree.columns` definition ("*" for title column). */
  id: string;
  /** Column index (0: leftmost title column). */
  idx: number;
  /** The cell's `<span class='wb-col'>` element (null for plain trees). */
  elem: HTMLSpanElement | null;
  /** The value of `tree.columns[]` for the current index. */
  info: ColumnDefinition;
}

export type ColumnEventInfoMap = { [colId: string]: ColumnEventInfo };

/**
 * Additional inforation derived from mouse or keyboard events.
 * @see {@link Wunderbaum.getEventInfo}
 */
export interface WbEventInfo {
  /** The tree instance. */
  tree: Wunderbaum;
  /** The affected node instance instance if any. */
  node: WunderbaumNode | null;
  /** The affected part of the node span (e.g. title, expander, ...). */
  region: NodeRegion;
  /** The definition of the affected column if any. */
  colDef?: ColumnDefinition;
  /** The index of affected column or -1. */
  colIdx: number;
  /** The column definition ID of affected column if any. */
  colId?: string;
  /** The affected column's span tag if any. */
  colElem?: HTMLSpanElement;
}

// export type WbTreeCallbackType = (e: WbTreeEventType) => any;
// export type WbNodeCallbackType = (e: WbNodeEventType) => any;
// export type WbRenderCallbackType = (e: WbRenderEventType) => void;

export type FilterModeType = null | "dim" | "hide";
export type ApplyCommandType =
  | "moveUp"
  | "moveDown"
  | "indent"
  | "outdent"
  | "remove"
  | "rename"
  | "addChild"
  | "addSibling"
  | "cut"
  | "copy"
  | "paste"
  | "down"
  | "first"
  | "last"
  | "left"
  | "pageDown"
  | "pageUp"
  | "parent"
  | "right"
  | "up";

export type NodeFilterResponse = "skip" | "branch" | boolean | void;
export type NodeFilterCallback = (node: WunderbaumNode) => NodeFilterResponse;
export type AddNodeType = "before" | "after" | "prependChild" | "appendChild";
export type DndModeType = "before" | "after" | "over";

/** Possible values for `setModified()`. */
export enum ChangeType {
  /** Re-render the whole viewport, headers, and all rows. */
  any = "any",
  /** Update current row title, icon, columns, and status. */
  data = "data",
  /** Redraw the header and update the width of all row columns. */
  header = "header",
  /** Re-render the whole current row. */
  row = "row",
  /** Alias for 'any'. */
  structure = "structure",
  /** Update current row's classes, to reflect active, selected, ... */
  status = "status",
  /** Update the 'top' property of all rows. */
  vscroll = "vscroll",
}

/** Possible values for `setStatus()`. */
export enum NodeStatusType {
  ok = "ok",
  loading = "loading",
  error = "error",
  noData = "noData",
  // paging = "paging",
}

/** Define the subregion of a node, where an event occurred. */
export enum NodeRegion {
  unknown = "",
  checkbox = "checkbox",
  column = "column",
  expander = "expander",
  icon = "icon",
  prefix = "prefix",
  title = "title",
}

/** Initial navigation mode and possible transition. */
export enum NavModeEnum {
  startRow = "startRow", // Start with row mode, but allow cell-nav mode
  cell = "cell", // Cell-nav mode only
  startCell = "startCell", // Start in cell-nav mode, but allow row mode
  row = "row", // Row mode only
}

/* -----------------------------------------------------------------------------
 * METHOD OPTIONS TYPES
 * ---------------------------------------------------------------------------*/

/** Possible values for {@link WunderbaumNode.addChildren()}. */
export interface AddChildrenOptions {
  /** Insert children before this node (or index)
   * @default undefined or null:  append as last child
   */
  before?: WunderbaumNode | number | null;
  /**
   * Set `node.expanded = true` according to tree.options.minExpandLevel.
   * This does *not* load lazy nodes.
   * @default true
   */
  applyMinExpanLevel?: boolean;
  /** (@internal Internal use, do not set! ) */
  _level?: number;
}

/** Possible values for {@link Wunderbaum.applyCommand()} and {@link WunderbaumNode.applyCommand()}. */
export interface ApplyCommandOptions {
  [key: string]: unknown;
}

/** Possible values for {@link Wunderbaum.expandAll()} and {@link WunderbaumNode.expandAll()}. */
export interface ExpandAllOptions {
  /** Restrict expand level @default 99 */
  depth?: number;
  /** Expand and load lazy nodes @default false  */
  loadLazy?: boolean;
  /** Ignore `minExpandLevel` option @default false */
  force?: boolean;
}

/** Possible values for {@link Wunderbaum.filterNodes()} and {@link Wunderbaum.filterBranches()}. */
export interface FilterNodesOptions {
  mode?: string;
  leavesOnly?: boolean;
  fuzzy?: boolean;
  highlight?: boolean;
  hideExpanders?: boolean;
  autoExpand?: boolean;
  noData?: boolean;
}

/** Possible values for {@link WunderbaumNode.makeVisible()}. */
export interface MakeVisibleOptions {
  /** Do not animate expand (currently not implemented). @default false */
  noAnimation?: boolean;
  /** Scroll node into visible viewport area if required. @default true */
  scrollIntoView?: boolean;
  /** Do not send events. @default false */
  noEvents?: boolean;
}

/** Possible values for {@link Wunderbaum.navigate()}. */
export interface NavigateOptions {
  activate?: boolean;
  event?: Event;
}

/** Possible values for {@link WunderbaumNode.render()}. */
export interface RenderOptions {
  change?: ChangeType;
  after?: any;
  isNew?: boolean;
  preventScroll?: boolean;
  isDataChange?: boolean;
  top?: number;
  resizeCols?: boolean;
}

/** Possible values for {@link scrollIntoView()}. */
export interface ScrollIntoViewOptions {
  /** Do not animate (currently not implemented). @default false */
  noAnimation?: boolean;
  /** Do not send events. @default false */
  noEvents?: boolean;
  /** Keep this node visible at the top in any case. */
  topNode?: WunderbaumNode;
  /** Add N pixel offset at top. */
  ofsY?: number;
}

/** Possible values for {@link Wunderbaum.scrollTo()}. */
export interface ScrollToOptions extends ScrollIntoViewOptions {
  /** Which node to scroll into the viewport.*/
  node: WunderbaumNode;
}

/** Possible values for `node.setActive()`. */
export interface SetActiveOptions {
  /** Generate (de)activate event, even if node already has this status (default: false). */
  retrigger?: boolean;
  /** Do not generate (de)activate event  (default: false). */
  noEvents?: boolean;
  /** Set node as focused node (default: true). */
  focusNode?: boolean;
  /** Set node as focused node (default: false). */
  focusTree?: boolean;
  /** Optional original event that will be passed to the (de)activate handler. */
  event?: Event;
  /** Call {@link setColumn}. */
  colIdx?: number;
}

/** Possible values for `node.setExpanded()`. */
export interface SetExpandedOptions {
  /** Ignore {@link minExpandLevel}. @default false */
  force?: boolean;
  /** Immediately update viewport (async otherwise). @default false */
  immediate?: boolean;
  /** Do not animate expand (currently not implemented). @default false */
  noAnimation?: boolean;
  /** Do not send events. @default false */
  noEvents?: boolean;
  /** Scroll up to bring expanded nodes into viewport. @default false */
  scrollIntoView?: boolean;
}

/** Possible values for `node.setSetModified()`. */
export interface SetModifiedOptions {
  /** Force immediate redraw instead of throttled/async mode. @default false */
  immediate?: boolean;
  /** Remove HTML markup of all rendered nodes before redraw. @default false */
  removeMarkup?: boolean;
}

/** Possible values for `node.setSelected()`. */
export interface SetSelectedOptions {
  /** Ignore restrictions. @default false */
  force?: boolean;
  /** Do not send events. @default false */
  noEvents?: boolean;
}

/** Possible values for `node.setSetModified()`. */
export interface SetStatusOptions {
  /** Displayed as status node title. */
  message?: string;
  /** Used as tooltip. */
  details?: string;
}

/** Possible values for {@link Wunderbaum.updateColumns()}. */
export interface UpdateColumnsOptions {
  calculateCols?: boolean;
  updateRows?: boolean;
}

/** Possible values for {@link Wunderbaum.visitRows()} and {@link Wunderbaum.visitRowsUp()}. */
export interface VisitRowsOptions {
  reverse?: boolean;
  includeSelf?: boolean;
  includeHidden?: boolean;
  wrap?: boolean;
  start?: WunderbaumNode | null;
}

/* -----------------------------------------------------------------------------
 * wb_ext_dnd
 * ---------------------------------------------------------------------------*/

export type DropRegionType = "over" | "before" | "after";
export type DropRegionTypeSet = Set<DropRegionType>;
// type AllowedDropRegionType =
//   | "after"
//   | "afterBefore"
//   // | "afterBeforeOver" // == all == true
//   | "afterOver"
//   | "all" // == true
//   | "before"
//   | "beforeOver"
//   | "none" // == false == "" == null
//   | "over"; // == "child"

export type DndOptionsType = {
  /**
   * Expand nodes after n milliseconds of hovering
   * Default: 1500
   */
  autoExpandMS: 1500;
  // /**
  //  * Additional offset for drop-marker with hitMode = "before"/"after"
  //  * Default:
  //  */
  // dropMarkerInsertOffsetX: -16;
  // /**
  //  * Absolute position offset for .fancytree-drop-marker relatively to ..fancytree-title (icon/img near a node accepting drop)
  //  * Default:
  //  */
  // dropMarkerOffsetX: -24;
  // /**
  //  * Root Container used for drop marker (could be a shadow root)
  //  * (#1021 `document.body` is not available yet)
  //  * Default:
  //  */
  // dropMarkerParent: "body";
  /**
   * true: Drag multiple (i.e. selected) nodes. Also a callback() is allowed
   * Default: false
   */
  multiSource: false;
  /**
   * Restrict the possible cursor shapes and modifier operations (can also be set in the dragStart event)
   * Default: "all"
   */
  effectAllowed: "all";
  // /**
  //  * 'copy'|'link'|'move'|'auto'(calculate from `effectAllowed`+modifier keys) or callback(node, data) that returns such string.
  //  * Default:
  //  */
  // dropEffect: "auto";
  /**
   * Default dropEffect ('copy', 'link', or 'move') when no modifier is pressed (overide in dragDrag, dragOver).
   * Default: "move"
   */
  dropEffectDefault: string;
  /**
   * Prevent dropping nodes from different Wunderbaum trees
   * Default: false
   */
  preventForeignNodes: boolean;
  /**
   * Prevent dropping items on unloaded lazy Wunderbaum tree nodes
   * Default: true
   */
  preventLazyParents: boolean;
  /**
   * Prevent dropping items other than Wunderbaum tree nodes
   * Default: false
   */
  preventNonNodes: boolean;
  /**
   * Prevent dropping nodes on own descendants
   * Default: true
   */
  preventRecursion: boolean;
  /**
   * Prevent dropping nodes under same direct parent
   * Default: false
   */
  preventSameParent: false;
  /**
   * Prevent dropping nodes 'before self', etc. (move only)
   * Default: true
   */
  preventVoidMoves: boolean;
  /**
   * Enable auto-scrolling while dragging
   * Default: true
   */
  scroll: boolean;
  /**
   * Active top/bottom margin in pixel
   * Default: 20
   */
  scrollSensitivity: 20;
  /**
   * Pixel per event
   * Default: 5
   */
  scrollSpeed: 5;
  // /**
  //  * Allow dragging of nodes to different IE windows
  //  * Default: false
  //  */
  // setTextTypeJson: boolean;
  /**
   * Optional callback passed to `toDict` on dragStart @since 2.38
   * Default: null
   */
  sourceCopyHook: null;
  // Events (drag support)
  /**
   * Callback(sourceNode, data), return true, to enable dnd drag
   * Default: null
   */
  dragStart?: WbNodeEventType;
  /**
   * Callback(sourceNode, data)
   * Default: null
   */
  dragDrag: null;
  /**
   * Callback(sourceNode, data)
   * Default: null
   */
  dragEnd: null;
  // Events (drop support)
  /**
   * Callback(targetNode, data), return true, to enable dnd drop
   * Default: null
   */
  dragEnter: null;
  /**
   * Callback(targetNode, data)
   * Default: null
   */
  dragOver: null;
  /**
   * Callback(targetNode, data), return false to prevent autoExpand
   * Default: null
   */
  dragExpand: null;
  /**
   * Callback(targetNode, data)
   * Default: null
   */
  dragDrop: null;
  /**
   * Callback(targetNode, data)
   * Default: null
   */
  dragLeave: null;
};
