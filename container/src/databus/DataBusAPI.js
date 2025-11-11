import DataBus from './DataBus.js';

/**
 * DataBusAPI - Global API wrapper for Web Components and external access
 * 
 * This provides a secure, controlled interface for Web Components to access
 * the DataBus without exposing the entire DataBus instance globally.
 */
class DataBusAPI {
  constructor(dataBusInstance) {
    this.dataBus = dataBusInstance;
    this.isReady = false;
  }

  /**
   * Initialize the API after DataBus is ready
   */
  setReady() {
    this.isReady = true;
    console.log('DataBusAPI is ready for Web Components');
    
    // Dispatch custom event to notify Web Components
    window.dispatchEvent(new CustomEvent('databus-ready', {
      detail: { api: this }
    }));
  }

  /**
   * Check if DataBus is ready
   */
  isDataBusReady() {
    return this.isReady && this.dataBus.isInitialized;
  }

  /**
   * Profile MFE specific methods
   */
  getProfileData() {
    if (!this.isDataBusReady()) {
      console.warn('DataBus not ready');
      return {};
    }
    return this.dataBus.getProfileData();
  }

  updateProfileData(updates) {
    if (!this.isDataBusReady()) {
      console.warn('DataBus not ready');
      return;
    }
    return this.dataBus.updateProfileData(updates);
  }

  subscribeToProfileData(callback) {
    if (!this.isDataBusReady()) {
      console.warn('DataBus not ready');
      return;
    }
    return this.dataBus.subscribe('mfe-profile', callback);
  }

  /**
   * Reports MFE specific methods (for future Web Component version)
   */
  getReportsData() {
    if (!this.isDataBusReady()) {
      console.warn('DataBus not ready');
      return {};
    }
    return this.dataBus.getReportsData();
  }

  updateReportsData(updates) {
    if (!this.isDataBusReady()) {
      console.warn('DataBus not ready');
      return;
    }
    return this.dataBus.updateReportsData(updates);
  }

  subscribeToReportsData(callback) {
    if (!this.isDataBusReady()) {
      console.warn('DataBus not ready');
      return;
    }
    return this.dataBus.subscribe('mfe-reports', callback);
  }

  /**
   * Generic subscribe method for any MFE
   */
  subscribe(mfeName, callback) {
    if (!this.isDataBusReady()) {
      console.warn('DataBus not ready');
      return;
    }
    return this.dataBus.subscribe(mfeName, callback);
  }

  /**
   * Get current rules (for debugging)
   */
  getRules() {
    if (!this.isDataBusReady()) {
      console.warn('DataBus not ready');
      return null;
    }
    return this.dataBus.getRules();
  }
}

// Create and export the API instance
const dataBusAPI = new DataBusAPI(DataBus);

// Expose globally for Web Components
window.DataBusAPI = dataBusAPI;

export default dataBusAPI;