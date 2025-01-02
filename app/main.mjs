// @ts-check

import { LitElement, html } from "lit";
import "./navigation.mjs";
import { Router } from "@lit-labs/router";

class AppMain extends LitElement {
  _routes = new Router(this, [
    {
      path: "/",
      render: () => html`<h1>Home</h1>`,
    },
    {
      path: "/projects",
      enter: async () => Boolean(await import("./test.mjs")),
      render: () =>
        html`<h1>Projects</h1>
          <app-test></app-test>`,
    },
    { path: "/about", render: () => html`<h1>About</h1>` },
  ]);

  render() {
    return html`
      <header>
        <app-navigation></app-navigation>
      </header>
      <main>${this._routes.outlet()}</main>
      <footer>...</footer>
    `;
  }
}

customElements.define("app-main", AppMain);
