/*!
 * Wunderbaum - common
 * Copyright (c) 2021-2022, Martin Wendt. Released under the MIT license.
 * @VERSION, @DATE (https://github.com/mar10/wunderbaum)
 */

import { escapeRegex } from "./util";
import { WunderbaumNode } from "./wb_node";
import { Wunderbaum } from "./wunderbaum";

// export type WunderbaumOptions = any;
export type MatcherType = (node: WunderbaumNode) => boolean;
export type BoolOptionResolver = (node: WunderbaumNode) => boolean;

export const DEFAULT_DEBUGLEVEL = 4; // Replaced by rollup script
export const ROW_HEIGHT = 22;
export const ICON_WIDTH = 20;
export const ROW_EXTRA_PAD = 7; // 2x $col-padding-x + 3px rounding errors
export const RENDER_MIN_PREFETCH = 5;
export const RENDER_MAX_PREFETCH = 5;
export const TEST_IMG = new RegExp(/\.|\//); // strings are considered image urls if they contain '.' or '/'
// export const RECURSIVE_REQUEST_ERROR = "$recursive_request";
// export const INVALID_REQUEST_TARGET_ERROR = "$request_target_invalid";

export type NodeAnyCallback = (node: WunderbaumNode) => any;

export type NodeVisitResponse = "skip" | boolean | void;
export type NodeVisitCallback = (node: WunderbaumNode) => NodeVisitResponse;

// type WithWildcards<T> = T & { [key: string]: unknown };
export interface WbTreeEventType {
  /** Name of the event. */
  type: string;
  /** The affected tree. */
  tree: Wunderbaum;
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
  typeInfo: NodeTypeInfo;
}

export interface WbRenderEventType extends WbNodeEventType {
  /**
   * True if the node's markup was not yet created. In this case the render
   * event should create embeddeb input controls (in addition to update the
   * values according to to current node data).
   */
  isNew: boolean;
  /** True if the node only displays the title and is stretched over all remaining columns. */
  isColspan: boolean;
  // /** */
  // isDataChange: boolean;
  /** The node's `<span class='wb-node'>` element. */
  nodeElem: HTMLSpanElement;
  /**
   * Array of node's `<span class='wb-col'>` elements.
   * The first element is `<span class='wb-node wb-col'>`, which contains the
   * node title and icon (`idx: 0`, id: '*'`).
   */
  allColInfosById: ColumnEventInfos;
  /**
   * Array of node's `<span class='wb-node'>` elements, *that should be rendered*.
   * In contrast to `allColInfosById`, the node title is not part of this array.
   * If node.isColspan() is true, this array is empty (`[]`).
   */
  renderColInfosById: ColumnEventInfos;
}

/**
 * Contains the node's type information, i.e. `tree.types[node.type]` if
 * defined. @see {@link Wunderbaum.types}
 */
export type NodeTypeInfo = {
  icon?: string;
  classes?: string;
  // and more
  [key: string]: unknown;
};
export type NodeTypeInfos = { [type: string]: NodeTypeInfo };

/**
 * @see {@link `Wunderbaum.columns`}
 */
export interface ColumnDefinition {
  /** Column ID as defined in `tree.columns` definition ("*" for title column). */
  id: string;
  // /** */
  // idx: number;
  /** */
  title: string;
  /** e.g. '75px' or '*'. */
  width: string;
  /** e.g. '75px' or '*'. */
  minWidth?: string;
  /** Optional classes that are added to the column span. */
  classes?: string;
  /** Optional HTML code  that is rendered into the cell span. */
  html?: string;
  // Internal use:
  _weight?: number;
  _widthPx?: number;
  _ofsPx?: number;
}
export type ColumnDefinitions = Array<ColumnDefinition>;

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
export type ColumnEventInfos = { [colId: string]: ColumnEventInfo };

export type WbTreeCallbackType = (e: WbTreeEventType) => any;
export type WbNodeCallbackType = (e: WbNodeEventType) => any;
export type WbRenderCallbackType = (e: WbRenderEventType) => void;

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
export enum TargetType {
  unknown = "",
  checkbox = "checkbox",
  column = "column",
  expander = "expander",
  icon = "icon",
  prefix = "prefix",
  title = "title",
}

export let iconMap = {
  error: "bi bi-exclamation-triangle",
  // loading: "bi bi-hourglass-split wb-busy",
  loading: "bi bi-chevron-right wb-busy",
  // loading: "bi bi-arrow-repeat wb-spin",
  // loading: '<div class="spinner-border spinner-border-sm" role="status"> <span class="visually-hidden">Loading...</span> </div>',
  // noData: "bi bi-search",
  noData: "bi bi-question-circle",
  expanderExpanded: "bi bi-chevron-down",
  // expanderExpanded: "bi bi-dash-square",
  expanderCollapsed: "bi bi-chevron-right",
  // expanderCollapsed: "bi bi-plus-square",
  expanderLazy: "bi bi-chevron-right wb-helper-lazy-expander",
  // expanderLazy: "bi bi-chevron-bar-right",
  checkChecked: "bi bi-check-square",
  checkUnchecked: "bi bi-square",
  checkUnknown: "bi dash-square-dotted",
  radioChecked: "bi bi-circle-fill",
  radioUnchecked: "bi bi-circle",
  radioUnknown: "bi bi-circle-dotted",
  folder: "bi bi-folder2",
  folderOpen: "bi bi-folder2-open",
  doc: "bi bi-file-earmark",
};

export const KEY_NODATA = "__not_found__";

/** Initial navigation mode and possible transition. */
export enum NavigationModeOption {
  startRow = "startRow", // Start with row mode, but allow cell-nav mode
  cell = "cell", // Cell-nav mode only
  startCell = "startCell", // Start in cell-nav mode, but allow row mode
  row = "row", // Row mode only
}

/** Tree's current navigation mode (see `tree.setNavigationMode()`). */
export enum NavigationMode {
  row = "row",
  cellNav = "cellNav",
  cellEdit = "cellEdit",
}

/** Define which keys are handled by embedded <input> control, and should
 * *not* be passed to tree navigation handler in cell-edit mode. */
export const INPUT_KEYS = {
  text: ["left", "right", "home", "end", "backspace"],
  number: ["up", "down", "left", "right", "home", "end", "backspace"],
  checkbox: [],
  link: [],
  radiobutton: ["up", "down"],
  "select-one": ["up", "down"],
  "select-multiple": ["up", "down"],
};

/** Key codes that trigger grid navigation, even when inside an input element. */
export const NAVIGATE_IN_INPUT_KEYS: Set<string> = new Set([
  "ArrowDown",
  "ArrowUp",
  "Enter",
  "Escape",
]);

/** Possible values for `node.makeVisible()`. */
export interface MakeVisibleOptions {
  /** Do not animate expand (currently not implemented). @default false */
  noAnimation?: boolean;
  /** Ignore restrictions. @default true */
  scrollIntoView?: boolean;
  /** Do not send events. @default false */
  noEvents?: boolean;
}

/** Possible values for `node.scrollIntoView()`. */
export interface ScrollIntoViewOptions {
  /** Do not animate (currently not implemented). @default false */
  noAnimation?: boolean;
  /** Do not send events. @default false */
  noEvents?: boolean;
  /** Keep this node visible at the top in any case. */
  topNode?: WunderbaumNode;
}

/** Possible values for `tree.scrollTo()`. */
export interface ScrollToOptions extends ScrollIntoViewOptions {
  /** Which node to scroll into the viewport.*/
  node: WunderbaumNode;
}

/** Possible values for `node.setActive()`. */
export interface SetActiveOptions {
  /** Generate (de)activate event, even if node already has this status. */
  retrigger?: boolean;
  /** Do not generate (de)activate event. */
  noEvents?: boolean;
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
  /** Scroll to bring expanded nodes into viewport. @default false */
  scrollIntoView?: boolean;
}

/** Possible values for `node.setSelected()`. */
export interface SetSelectedOptions {
  /** Ignore restrictions. @default false */
  force?: boolean;
  /** Do not send events. @default false */
  noEvents?: boolean;
}

/** Possible values for `node.setSetModified()`. */
export interface SetModifiedOptions {
  /** Force immediate redraw instead of throttled/async mode. @default false */
  immediate?: boolean;
  /** Remove HTML markup of all rendered nodes before redraw. @default false */
  removeMarkup?: boolean;
}

/** Possible values for `node.setSetModified()`. */
export interface SetStatusOptions {
  /** Displayed as status node title. */
  message?: string;
  /** Used as tooltip. */
  details?: string;
}

/** Map `KeyEvent.key` to navigation action. */
export const KEY_TO_ACTION_DICT: { [key: string]: string } = {
  " ": "toggleSelect",
  "+": "expand",
  Add: "expand",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  Backspace: "parent",
  "/": "collapseAll",
  Divide: "collapseAll",
  End: "lastCol",
  Home: "firstCol",
  "Control+End": "last",
  "Control+Home": "first",
  "Meta+ArrowDown": "last", // macOs
  "Meta+ArrowUp": "first", // macOs
  "*": "expandAll",
  Multiply: "expandAll",
  PageDown: "pageDown",
  PageUp: "pageUp",
  "-": "collapse",
  Subtract: "collapse",
};

/** Return a callback that returns true if the node title contains a substring (case-insensitive). */
export function makeNodeTitleMatcher(s: string): MatcherType {
  s = escapeRegex(s.toLowerCase());
  return function (node: WunderbaumNode) {
    return node.title.toLowerCase().indexOf(s) >= 0;
  };
}

/** Return a callback that returns true if the node title starts with a string (case-insensitive). */
export function makeNodeTitleStartMatcher(s: string): MatcherType {
  s = escapeRegex(s);
  const reMatch = new RegExp("^" + s, "i");
  return function (node: WunderbaumNode) {
    return reMatch.test(node.title);
  };
}
