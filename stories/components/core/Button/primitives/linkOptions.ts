import type { Component } from "vue";

/** Props that render a button as a link while keeping its look. */
export type ButtonLinkOptions = {
  /** Renders the button as a link to this URL. */
  href?: string;
  /** Where the link opens, e.g. "_blank" for a new tab. */
  target?: string;
  /** Defaults to "noopener noreferrer" for links that open in a new tab. */
  rel?: string;
  /**
   * The element or component to render, e.g. a router's link component, which
   * then receives its own props (such as `to`) as attributes.
   */
  as?: string | Component;
};
