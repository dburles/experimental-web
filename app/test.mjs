// @ts-check

import { LitElement, css, html } from "lit";
import message from "./lib/a.mjs";
import "./button.mjs";

export class AppTest extends LitElement {
  static styles = css`
    span {
      color: coral;
    }
  `;

  static properties = {
    count: { type: Number },
  };

  constructor() {
    super();
    this.count = 0;
  }

  increment() {
    this.count += 1;
  }

  render() {
    return html`
      <span>${message}</span>
      <app-button @click="${this.increment}">Click me ${this.count}</app-button>
    `;
  }
}

customElements.define("app-test", AppTest);
