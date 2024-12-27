// @ts-check

import { LitElement, css, html } from "lit";
import message from "./components/a.js";

export class HelloWorld extends LitElement {
  static styles = css`
    span {
      color: coral;
    }
  `;

  render() {
    return html`<span>${message}</span>`;
  }
}
customElements.define("hello-world", HelloWorld);
