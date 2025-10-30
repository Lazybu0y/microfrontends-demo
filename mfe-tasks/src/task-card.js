class TaskCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "Untitled";
    const status = this.getAttribute("status") || "pending";
    this.innerHTML = `
      <div style="border:1px solid #ddd;padding:8px;margin:5px;border-radius:6px;">
        <h4>📝 ${title}</h4>
        <p>Status: <b>${status}</b></p>
        <h3>All code bundled into container's main.js   </h3>
      </div>
    `;
  }
}
customElements.define("task-card", TaskCard);
//console.log("mfe-tasks Web Component Loaded");