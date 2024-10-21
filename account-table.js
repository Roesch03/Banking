import { LitElement, html, css } from "lit";
import { Task } from "@lit/task";

export class AccountTable extends LitElement {
  static styles = css`
    p {
      color: blue;
    }
  `;

  static properties = {
    accounts: { type: Array },
  };

  constructor() {
    super();
    this.data = [];
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

  connectedCallback() {
    super.connectedCallback();
    this.loadTableData(); // Tabelle wird beim Laden der Komponente initialisiert
  }

  // Diese Methode lädt die Daten neu
  async loadTableData() {
    try {
      console.log("fetching");
      const response = await fetch("/api/accounts");
      if (response.ok) {
        const jsonData = await response.json();
        this.data = jsonData; // Daten in der Tabelle speichern
        this.requestUpdate(); // Komponente neu rendern
      } else {
        console.error("Fehler beim Laden der Tabelle");
      }
    } catch (error) {
      console.error("Fehler:", error);
    }
  }

  handleRelead() {
    this.loadTableData();
  }

  render() {
    // return this._productTask.render({
    //   pending: () => html`<p>Loading product...</p>`,
    //
    //   complete: (accounts) => html`
    //     <button @click="${this.handleRelead}">neu laden</button>
    //     <table>
    //       <tr>
    //         <th>ID</th>
    //         <th>Name</th>
    //         <th>Betrag</th>
    //       </tr>
    //       ${accounts.map(
    //         (account) => html`
    //           <tr>
    //             <td>${account.id}</td>
    //             <td>${account.kontoname}</td>
    //             <td>$${account.betrag.toFixed(2)}</td>
    //           </tr>
    //         `
    //       )}
    //     </table>
    //   `,
    //
    //   error: (e) => html`<p>Error: ${e}</p>`,
    // });
    return html`
      <button @click="${this.handleRelead}">neu laden</button>
      <table>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Betrag</th>
        </tr>
        ${this.data.map(
          (account) => html`
            <tr>
              <td>${account.id}</td>
              <td>${account.kontoname}</td>
              <td>$${account.betrag.toFixed(2)}</td>
            </tr>
          `
        )}
      </table>
    `;
  }
}
customElements.define("account-table", AccountTable);
