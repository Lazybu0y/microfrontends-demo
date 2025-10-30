class ProfileCard extends HTMLElement {
    connectedCallback() {
        const name = this.getAttribute('name') || 'Guest';
        const title = this.getAttribute('title') || 'Visitor';
        this.innerHTML = `<div style="border: 2px solid blue; padding: 10px;">
            <h3>👤 ${name}</h3>
            <p>${title}</p>
        </div>`;
    }
}

customElements.define('profile-card', ProfileCard);
console.log('mfe-profile Web Component Loaded');