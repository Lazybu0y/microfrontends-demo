class DataBus {
  constructor() {
    this.data = {};
    this.subscribers = new Map();
    this.rules = null;
    this.isInitialized = false;
    console.log('Container DataBus instance created');
  }

  async loadRules(rulesPath = './rules.json') {
    try {
      const response = await fetch(rulesPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch rules: ${response.status}`);
      }
      this.rules = await response.json();
      console.log('Container DataBus rules loaded:', this.rules.version);
    } catch (error) {
      console.error('Failed to load DataBus rules:', error);
      this.rules = this.getDefaultRules();
      console.log('Using default rules as fallback');
    }
  }

  getDefaultRules() {
    return {
      version: "1.0-default",
      mfeDataAccess: {
        "mfe-profile": { 
          readable: ["name", "DOB"], 
          writable: ["name", "DOB"],
          description: "Profile MFE can read and update name and date of birth"
        },
        "mfe-reports": { 
          readable: ["state", "name"], 
          writable: ["state"],
          description: "Reports MFE can read name and state, but only update state"
        }
      },
      dataValidation: {},
      defaultData: {}
    };
  }

  async initialize(initialData = {}, rulesPath) {
    if (!this.rules) {
      await this.loadRules(rulesPath);
    }
    
    this.data = { 
      ...this.rules.defaultData, 
      ...initialData 
    };
    
    this.isInitialized = true;
    this.notifySubscribers('all');
    console.log('Container DataBus initialized with data:', this.data);
  }

  getData(mfeName) {
    this.ensureInitialized();
    return this.filterDataForRead(mfeName);
  }

  updateData(mfeName, updates) {
    this.ensureInitialized();
    const validatedUpdates = this.validateUpdates(mfeName, updates);
    
    Object.keys(validatedUpdates).forEach(key => {
      this.data[key] = validatedUpdates[key];
    });
    
    this.notifyAllMFEs();
    console.log(`Container DataBus updated by ${mfeName}:`, validatedUpdates);
  }

  getProfileData() { 
    return this.getData('mfe-profile'); 
  }
  
  updateProfileData(updates) { 
    return this.updateData('mfe-profile', updates); 
  }
  
  getReportsData() { 
    return this.getData('mfe-reports'); 
  }
  
  updateReportsData(updates) { 
    return this.updateData('mfe-reports', updates); 
  }
  
  getAnalyticsData() { 
    return this.getData('mfe-analytics'); 
  }

  getHomeData() { 
    return this.getData('mfe-home'); 
  }

  subscribe(mfeName, callback) {
    if (!this.subscribers.has(mfeName)) {
      this.subscribers.set(mfeName, []);
    }
    this.subscribers.get(mfeName).push(callback);
    
    if (this.isInitialized) {
      callback(this.filterDataForRead(mfeName));
    }
  }

  filterDataForRead(mfeName) {
    const mfeRules = this.rules.mfeDataAccess[mfeName];
    if (!mfeRules) {
      console.warn(`No rules found for MFE: ${mfeName}`);
      return {};
    }

    const readableFields = mfeRules.readable || [];
    return Object.keys(this.data)
      .filter(key => readableFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = this.data[key];
        return obj;
      }, {});
  }

  validateUpdates(mfeName, updates) {
    const mfeRules = this.rules.mfeDataAccess[mfeName];
    if (!mfeRules) {
      throw new Error(`No rules found for MFE: ${mfeName}`);
    }

    const writableFields = mfeRules.writable || [];
    const validatedUpdates = {};

    Object.keys(updates).forEach(key => {
      if (!writableFields.includes(key)) {
        console.warn(`${mfeName} attempted to update unauthorized field: ${key}`);
        return;
      }

      const validationRule = this.rules.dataValidation[key];
      if (validationRule && !this.validateValue(updates[key], validationRule)) {
        console.warn(`Invalid value for ${key}:`, updates[key]);
        return;
      }

      validatedUpdates[key] = updates[key];
    });

    return validatedUpdates;
  }

  validateValue(value, rule) {
    if (rule.type === 'string' && typeof value !== 'string') return false;
    if (rule.maxLength && value.length > rule.maxLength) return false;
    if (rule.pattern && !new RegExp(rule.pattern).test(value)) return false;
    if (rule.enum && !rule.enum.includes(value)) return false;
    return true;
  }

  notifyAllMFEs() {
    Object.keys(this.rules.mfeDataAccess).forEach(mfeName => {
      this.notifySubscribers(mfeName);
    });
  }

  notifySubscribers(mfeName) {
    if (this.subscribers.has(mfeName)) {
      const filteredData = this.filterDataForRead(mfeName);
      this.subscribers.get(mfeName).forEach(callback => {
        callback(filteredData);
      });
    }
  }

  ensureInitialized() {
    if (!this.isInitialized) {
      throw new Error('DataBus not initialized. Call initialize() first.');
    }
  }

  getRules() {
    return this.rules;
  }

  async reloadRules(rulesPath) {
    await this.loadRules(rulesPath);
    console.log('Container DataBus rules reloaded');
  }
}

export default new DataBus();