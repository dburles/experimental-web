import { jsx as h } from "react";
import message from "./components/a.js";
import Style from "scoped-style-components/Style.js";
import css from "fake-tag";

export default function App() {
  return h(Style, {
    css: css`
      > span {
        color: coral;
      }
    `,
    children: [h("span", { children: message })],
  });
}
