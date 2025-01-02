// @ts-check

import { LitElement, html, css } from "lit";

class AppNavigation extends LitElement {
  static styles = css`
    ul {
      display: flex;
      padding: 0;
      gap: var(--space-5);
      list-style: none;
      li {
        a {
          color: var(--color-green-600);
        }
      }
    }
  `;

  render() {
    return html`
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/projects">Projects</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    `;
  }
}

customElements.define("app-navigation", AppNavigation);
