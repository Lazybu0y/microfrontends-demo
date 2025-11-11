class ProfileCard extends HTMLElement {
    constructor() {
        super();
        this.dataBusAPI = null;
        this.profileData = {};
    }

    async connectedCallback() {
        try {
            // Wait for DataBus API to be ready
            if (window.DataBusAPI && window.DataBusAPI.isDataBusReady()) {
                this.initializeWithDataBus();
            } else {
                // Listen for databus-ready event
                window.addEventListener('databus-ready', () => {
                    this.initializeWithDataBus();
                });
                
                // Also check periodically in case event was missed
                let attempts = 0;
                const checkDataBus = () => {
                    if (window.DataBusAPI && window.DataBusAPI.isDataBusReady()) {
                        this.initializeWithDataBus();
                    } else if (attempts < 50) { // Wait up to 5 seconds
                        attempts++;
                        setTimeout(checkDataBus, 100);
                    } else {
                        console.warn('mfe-profile: DataBus not available, using fallback');
                        this.renderFallback();
                    }
                };
                checkDataBus();
            }
        } catch (error) {
            console.error('mfe-profile: Failed to connect to DataBus:', error);
            this.renderFallback();
        }
    }

    initializeWithDataBus() {
        try {
            this.dataBusAPI = window.DataBusAPI;

            // Subscribe to profile data changes
            this.dataBusAPI.subscribeToProfileData((data) => {
                this.profileData = data;
                this.render();
            });

            // Get initial data
            this.profileData = this.dataBusAPI.getProfileData();
            this.render();

            console.log('mfe-profile: Connected to Container DataBus API');
        } catch (error) {
            console.error('mfe-profile: Failed to initialize with DataBus:', error);
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
        if (this.dataBusAPI) {
            const newName = this.querySelector('#nameInput').value;
            if (newName.trim()) {
                this.dataBusAPI.updateProfileData({ name: newName });
                console.log('mfe-profile: Updated name to:', newName);
            }
        }
    }

    updateDOB() {
        if (this.dataBusAPI) {
            const newDOB = this.querySelector('#dobInput').value;
            if (newDOB.trim()) {
                this.dataBusAPI.updateProfileData({ DOB: newDOB });
                console.log('mfe-profile: Updated DOB to:', newDOB);
            }
        }
    }
}

customElements.define('profile-card', ProfileCard);
console.log('mfe-profile Web Component Loaded');