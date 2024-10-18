import { LitElement, html, css } from "lit";
import { Task } from "@lit/task";

export class AccountTable extends LitElement {
  static styles = css`
    p {
      color: blue;
    }
  `;

  static properties = {};

  constructor() {
    super();
  }
  _productTask = new Task(this, {
    task: async ([], { signal }) => {
      const response = await fetch(`/api/accounts`, { signal });

      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    },

    args: () => [],
  });

  render() {
    return this._productTask.render({
      pending: () => html`<p>Loading product...</p>`,

      complete: (accounts) => html`
        <table>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Betrag</th>
          </tr>
          ${accounts.map(
            (account) => html`
              <tr>
                <td>${account.id}</td>
                <td>${account.kontoname}</td>
                <td>$${account.betrag.toFixed(2)}</td>
              </tr>
            `
          )}
        </table>
      `,

      error: (e) => html`<p>Error: ${e}</p>`,
    });
  }
}
customElements.define("account-table", AccountTable);
