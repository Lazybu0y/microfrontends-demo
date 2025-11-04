class ProfileCard extends HTMLElement {
    constructor() {
        super();
        this.dataBus = null;
        this.profileData = {};
    }

    async connectedCallback() {
        try {
            // Import DataBus from the federated module
            const DataBusModule = await import('http://localhost:3004/remoteEntry.js');
            await DataBusModule.get('./DataBus')().then(module => {
                this.dataBus = module.default;
            });

            // Subscribe to profile data changes
            this.dataBus.subscribe('mfe-profile', (data) => {
                this.profileData = data;
                this.render();
            });

            // Get initial data
            this.profileData = this.dataBus.getProfileData();
            this.render();

            console.log('mfe-profile: Connected to DataBus');
        } catch (error) {
            console.error('mfe-profile: Failed to connect to DataBus:', error);
            // Fallback to attribute-based rendering
            this.renderFallback();
        }
    }

    render() {
        const name = this.profileData.name || 'Guest';
        const dob = this.profileData.DOB || 'Unknown';
        
        this.innerHTML = `
            <div style="border: 2px solid blue; padding: 10px; margin: 10px 0; background-color: #f0f8ff;">
                <h3>👤 Profile MFE</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>DOB:</strong> ${dob}</p>
                <div style="margin-top: 10px;">
                    <input type="text" id="nameInput" placeholder="Enter new name" value="${name}" style="margin-right: 5px;">
                    <button onclick="this.parentElement.parentElement.parentElement.updateName()">Update Name</button>
                </div>
                <div style="margin-top: 5px;">
                    <input type="text" id="dobInput" placeholder="Enter DOB (e.g., 20 Oct)" value="${dob}" style="margin-right: 5px;">
                    <button onclick="this.parentElement.parentElement.parentElement.updateDOB()">Update DOB</button>
                </div>
                <small style="color: #666;">Data access: name, DOB (read/write)</small>
            </div>
        `;
    }

    renderFallback() {
        const name = this.getAttribute('name') || 'Guest';
        const title = this.getAttribute('title') || 'Visitor';
        this.innerHTML = `
            <div style="border: 2px solid red; padding: 10px;">
                <h3>👤 ${name} (Fallback Mode)</h3>
                <p>${title}</p>
                <small style="color: red;">DataBus not available</small>
            </div>
        `;
    }

    updateName() {
        if (this.dataBus) {
            const newName = this.querySelector('#nameInput').value;
            if (newName.trim()) {
                this.dataBus.updateProfileData({ name: newName });
                console.log('mfe-profile: Updated name to:', newName);
            }
        }
    }

    updateDOB() {
        if (this.dataBus) {
            const newDOB = this.querySelector('#dobInput').value;
            if (newDOB.trim()) {
                this.dataBus.updateProfileData({ DOB: newDOB });
                console.log('mfe-profile: Updated DOB to:', newDOB);
            }
        }
    }
}

customElements.define('profile-card', ProfileCard);
console.log('mfe-profile Web Component Loaded');