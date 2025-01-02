// @ts-check

import { LitElement, html, css } from "lit";

class AppButton extends LitElement {
  static styles = css`
    button {
      background-color: var(--color-purple-500);
      color: var(--color-white);
      border: none;
      padding: var(--space-2) var(--space-4);
      font-size: var(--font-size-base);
      cursor: pointer;
      border-radius: var(--radius-md);
      &:hover {
        background-color: var(--color-purple-700);
      }
    }
  `;

  render() {
    return html`<button><slot></slot></button>`;
  }
}

customElements.define("app-button", AppButton);
