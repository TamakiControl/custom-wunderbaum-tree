/*
 * Note: import as module:
 *     `<script defer type="module" src="playground.js"></script>`
 */

import { Wunderbaum } from "../dist/wunderbaum.esm.js";

const tree = new Wunderbaum({
  element: "#tree",
  id: "Playground",
  // header: "Playground",
  // columns: [{title: "test"}],
  types: {
    book: { icon: "bi bi-book", classes: "extra-book-class" },
  },
  // showSpinner: true,
  // source: "https://hurz",
  source: {
    children: [
      { title: "Node 1", expanded: true, children: [{ title: "Node 1.1" }] },
      { title: "Node 2", selected: true, icon: "../docs/assets/favicon/favicon-16x16.png"
    , children: [{title: "book2", type: "book"}]},
      { title: "Node 3", type: "book" },
    ],
  },
  click: (e) => {
    // return false
  },
  deactivate: (e) => {
    // return false
  },
  activate: (e) => {
    // return false
  },
});

console.log(`Created  ${tree}`);

tree.ready
  .then(() => {
    console.log(`${tree} is ready.`);
    // tree.root.setStatus("loading")
  })
  .catch((err) => {
    console.error(`${tree} init failed.`, err);
  });
