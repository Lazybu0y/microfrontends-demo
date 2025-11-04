# Microfrontends Demo with Data Sharing

A comprehensive demonstration project showcasing **5 different microfrontend integration patterns** with **cross-MFE data sharing capabilities** in a single application.

## Architecture Overview

This project demonstrates how different microfrontend (MFE) integration strategies can coexist in a single container application. Each MFE uses a different integration approach, illustrating the trade-offs between build-time and runtime integration.

### Container (Host Application)
- **Port**: 3000
- **Technology**: React 18 + Webpack 5 + Module Federation
- **Role**: Main orchestrator that integrates all microfrontends
- **Location**: [container/](container/)

### Microfrontends

#### 1. MFE-Home (Runtime - Module Federation)
- **Port**: 3001
- **Integration**: Webpack Module Federation (Runtime)
- **Exposed**: `./Home` component via `remoteEntry.js`
- **Technology**: React 18
- **Location**: [mfe-home/](mfe-home/)
- **Characteristics**:
  - ✅ Runtime decoupling - deployed independently
  - ✅ Independent version control
  - ⚠️ Medium build complexity
  - 🎯 **Use case**: Modern microfrontends with independent deployments

#### 2. MFE-Analytics (Runtime - Module Federation)
- **Port**: 3002
- **Integration**: Webpack Module Federation (Runtime)
- **Exposed**: `./Analytics` component via `remoteEntry.js`
- **Technology**: React 18
- **Location**: [mfe-analytics/](mfe-analytics/)
- **Characteristics**:
  - ✅ Runtime decoupling - deployed independently
  - ✅ Independent version control
  - ⚠️ Medium build complexity
  - 🎯 **Use case**: Modern microfrontends with independent deployments

#### 3. MFE-Tasks (Build-time - Direct Import)
- **Port**: N/A (bundled at build time)
- **Integration**: Direct ES6 import of Web Component
- **Technology**: Vanilla JavaScript Web Component
- **Location**: [mfe-tasks/](mfe-tasks/)
- **Characteristics**:
  - ❌ No runtime decoupling - built together
  - ✅ Simple build process
  - ✅ Shared codebase version control
  - 🎯 **Use case**: Internal teams, tightly coupled components

#### 4. MFE-Reports (Build-time - NPM Package)
- **Port**: N/A (bundled at build time)
- **Integration**: NPM package (`@acme/mfe-reports`)
- **Technology**: React 18 component library
- **Location**: [mfe-reports/](mfe-reports/)
- **Data Access**: Via props from container (name - read, state - read/write)
- **Characteristics**:
  - ❌ No runtime decoupling - versioned dependency
  - ✅ Moderate build simplicity
  - ✅ Strong version control via npm
  - ✅ Receives data via container props
  - 🎯 **Use case**: Versioned distribution, shared component libraries

#### 5. MFE-Profile (Runtime - Web Component)
- **Port**: 3003 (served via http-server)
- **Integration**: Dynamically loaded vanilla Web Component
- **Technology**: Vanilla JavaScript Custom Element
- **Location**: [mfe-profile/](mfe-profile/)
- **Data Access**: Via DataBus API (name, DOB - read/write)
- **Characteristics**:
  - ✅ Full runtime decoupling
  - ✅ Easy build process
  - ✅ Independent version control
  - ✅ Direct DataBus integration
  - 🎯 **Use case**: Polyglot teams, legacy integration, framework-agnostic components

#### 6. MFE-Data-Bus (Runtime - Module Federation)
- **Port**: 3004
- **Integration**: Webpack Module Federation (Runtime)
- **Exposed**: `./DataBus` singleton via `remoteEntry.js`
- **Technology**: Vanilla JavaScript
- **Location**: [mfe-data-bus/](mfe-data-bus/)
- **Configuration**: [rules.json](container/public/rules.json)
- **Characteristics**:
  - ✅ Independent data sharing module
  - ✅ Configuration-driven access control
  - ✅ Cross-MFE state synchronization
  - ✅ API-based selective data access
  - 🎯 **Use case**: Secure, controlled data sharing between MFEs

## Integration Patterns Comparison

| Integration Type           | MFEs                    | Runtime Decoupling | Build Simplicity | Version Control | Ideal Use Case                      |
|---------------------------|-------------------------|--------------------|--------------------|-----------------|-------------------------------------|
| Build-time (import)       | mfe-home, mfe-tasks     | ❌                 | ✅ Simple          | Shared codebase | Internal teams                      |
| Build-time (npm)          | mfe-reports             | ❌                 | ✅ Moderate        | ✅ Strong       | Versioned distribution              |
| Runtime (web component)   | mfe-profile             | ✅                 | ✅ Easy            | ✅ Independent  | Polyglot, legacy                    |
| Runtime (federation)      | mfe-analytics, mfe-home | ✅                 | ⚠️ Medium          | ✅ Independent  | Modern MFEs with independent deploys|

## Project Structure

```
microfrontends-demo/
├── container/              # Host application (port 3000)
│   ├── src/
│   │   ├── index.js       # Entry point with async bootstrap
│   │   └── bootstrap.js   # Main app with DataBus init & MFE integrations
│   ├── public/
│   │   ├── index.html
│   │   └── rules.json     # DataBus access control configuration
│   ├── webpack.config.js  # Module Federation config (includes mfe-data-bus)
│   └── package.json
│
├── mfe-home/              # Module Federation MFE (port 3001)
│   ├── src/
│   │   └── Home.jsx       # Exposed component
│   ├── webpack.config.js  # Exposes ./Home
│   └── package.json
│
├── mfe-analytics/         # Module Federation MFE (port 3002)
│   ├── src/
│   │   └── Analytics.jsx  # Exposed component
│   ├── webpack.config.js  # Exposes ./Analytics
│   └── package.json
│
├── mfe-tasks/             # Build-time Web Component
│   ├── src/
│   │   └── task-card.js   # Custom element definition
│   └── index.js           # Entry point
│
├── mfe-reports/           # NPM package MFE (receives data via props)
│   ├── src/
│   │   └── Reports.jsx    # Exported component with data props
│   ├── webpack.config.js  # Build config
│   └── package.json       # Published as @acme/mfe-reports
│
├── mfe-profile/           # Runtime Web Component (port 3003)
│   └── profile.js         # Custom element with DataBus integration
│
└── mfe-data-bus/          # Data sharing module (port 3004) [NEW]
    ├── src/
    │   ├── DataBus.js     # Core data sharing logic
    │   └── index.js       # Entry point
    ├── public/
    │   ├── index.html
    │   └── rules.json     # Data access rules configuration
    ├── webpack.config.js  # Module Federation config (exposes ./DataBus)
    └── package.json

```

## How It Works

### Container Integration Logic

The container ([container/src/bootstrap.js](container/src/bootstrap.js)) demonstrates all integration patterns with data sharing:

```javascript
// 1. Build-time import (mfe-tasks)
import "../../mfe-tasks";

// 2. NPM package import (mfe-reports) - now with data props
import { Reports } from "@acme/mfe-reports";

// 3. Module Federation lazy load (mfe-home, mfe-analytics, mfe-data-bus)
const Home = React.lazy(() => import("mfeHome/Home"));
const Analytics = React.lazy(() => import("mfeAnalytics/Analytics"));

// 4. Runtime Web Component load (mfe-profile) - connects to DataBus
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'http://localhost:3003/profile.js';
  document.head.appendChild(script);
}, []);

// 5. NEW: DataBus initialization and data management
useEffect(() => {
  const initializeDataBus = async () => {
    const DataBus = (await import("mfeDataBus/DataBus")).default;
    await DataBus.initialize({
      name: "Santosh Singh",
      DOB: "20 Oct",
      state: "Minnesota"
    }, './rules.json');
    
    // Subscribe to reports data for NPM package props
    DataBus.subscribe('mfe-reports', setReportsData);
  };
  initializeDataBus();
}, []);

// 6. Render with data props for NPM package
<Reports reportsData={reportsData} onUpdateState={handleReportsStateUpdate} />
```

### Module Federation Setup

The container consumes remote modules via Webpack Module Federation:

```javascript
// container/webpack.config.js
remotes: {
  mfeHome: "mfeHome@http://localhost:3001/remoteEntry.js",
  mfeAnalytics: "mfeAnalytics@http://localhost:3002/remoteEntry.js"
}
```

Each federated MFE exposes its components:

```javascript
// mfe-home/webpack.config.js
exposes: {
  "./Home": "./src/Home.jsx"
}
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (comes with Node.js)

### Installation

```bash
# Install all dependencies (including workspace dependencies)
npm install
```

### Running the Application

#### Start all microfrontends concurrently:
```bash
npm run start:all
```

This will start:
- Container on http://localhost:3000
- MFE-Home on http://localhost:3001
- MFE-Analytics on http://localhost:3002
- MFE-Profile on http://localhost:3003
- **MFE-Data-Bus on http://localhost:3004** (NEW)
- Build MFE-Reports (build-time only, no dev server)

#### Start individual microfrontends:
```bash
npm run start:container   # Container only
npm run start:home        # MFE-Home only
npm run start:analytics   # MFE-Analytics only
npm run start:profile     # MFE-Profile only
npm run start:data-bus    # Data sharing module (NEW)
npm run start:reports     # Build MFE-Reports
```

**Important**: The DataBus must be running before starting the container for full functionality.
### Accessing the Application

Open http://localhost:3000 in your browser to see the container application with all microfrontends integrated.

## Technology Stack

- **React 18**: UI library for React-based microfrontends
- **Webpack 5**: Module bundler with Module Federation plugin
- **Babel**: JavaScript transpiler for JSX and modern JS features
- **Web Components**: Custom elements for framework-agnostic components
- **http-server**: Simple static file server for vanilla JS MFEs
- **Concurrently**: Run multiple npm scripts simultaneously

## Key Concepts Demonstrated

### 1. Module Federation
Webpack 5's Module Federation enables runtime code sharing between independently deployed applications. Each federated MFE:
- Runs on its own dev server
- Exposes specific modules via `remoteEntry.js`
- Can be deployed independently
- Shares dependencies (React, React-DOM) to avoid duplication

### 2. Web Components
Standard browser API for creating reusable custom elements:
- Framework-agnostic
- Encapsulated functionality
- Can be loaded at build-time or runtime
- No dependencies required

### 3. NPM Package Integration
Traditional dependency management approach:
- Versioned releases
- Familiar workflow for teams
- Build-time integration
- Suitable for component libraries

### 4. Async Bootstrap Pattern
The container uses `index.js` → `bootstrap.js` pattern to enable Module Federation's async dependency loading.

## Development Notes

### Workspace Setup
This project uses npm workspaces to manage multiple packages in a monorepo structure. All microfrontends are defined in the root [package.json](package.json) `workspaces` field.

### Port Configuration
- Container: 3000
- MFE-Home: 3001
- MFE-Analytics: 3002
- MFE-Profile: 3003

Ensure these ports are available before starting the application.

### Shared Dependencies
Module Federation microfrontends share React and React-DOM to avoid loading them multiple times, improving performance and ensuring compatibility.

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure all dev servers are running and accessible on their respective ports.

### Module Not Found
- Verify all dependencies are installed: `npm install`
- Check that all dev servers are running for federated modules
- Ensure MFE-Reports is built: `npm run start:reports`

### Port Already in Use
If a port is already occupied, you can modify the port in the respective webpack.config.js file or package.json script.

## Data Sharing Architecture (NEW)

### Overview

This project implements a sophisticated **cross-MFE data sharing system** that allows different microfrontends to share and synchronize data while maintaining security and independence. The system addresses the critical challenge of data communication between independently deployed microfrontends.

### Problem Statement

Traditional microfrontend architectures struggle with data sharing because:
- MFEs are independently deployed and can't directly communicate
- Different integration patterns (Module Federation, Web Components, NPM packages) require different data access methods
- Security concerns arise when MFEs need selective access to shared data
- Container apps may or may not have initial data to share

### Solution: Independent DataBus Module

We implemented an **independent data sharing module** (`mfe-data-bus`) that:
- ✅ Works with all MFE integration patterns
- ✅ Provides **API-driven selective data access** per MFE
- ✅ Uses **configuration-driven access control** via `rules.json`
- ✅ Enables **real-time data synchronization** between MFEs
- ✅ Supports **container independence** (works with/without initial data)

### Data Sharing Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                            Container (Port 3000)                    │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────────┐ │
│  │   DataBus Init  │  │   NPM Package    │  │   Module Federation │ │
│  │   Sample Data   │  │   mfe-reports    │  │   mfe-home          │ │
│  │                 │  │   (via props)    │  │   mfe-analytics     │ │
│  └─────────────────┘  └──────────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     MFE-Data-Bus (Port 3004)                       │
│  ┌─────────────────────────────────────────────────────────────────│
│  │ DataBus Core Engine                                            │
│  │ • rules.json Configuration Loading                             │
│  │ • API-based Data Access (getProfileData, getReportsData)      │
│  │ • Selective Field Filtering per MFE                           │
│  │ • Data Validation & Permission Enforcement                    │
│  │ • Cross-MFE Change Notifications                              │
│  └─────────────────────────────────────────────────────────────────│
└─────────────────────────────────────────────────────────────────────┘
                                   │
                     ┌─────────────┼─────────────┐
                     ▼             ▼             ▼
┌─────────────────┐ ┌─────────────┐ ┌─────────────┐
│  mfe-profile    │ │ mfe-reports │ │ mfe-home/   │
│  (Port 3003)    │ │ (via props) │ │ analytics   │
│  Web Component  │ │ NPM Package │ │ Fed Modules │
│  DataBus API    │ │ Container   │ │ DataBus API │
│  name, DOB R/W  │ │ Mediated    │ │ (Future)    │
└─────────────────┘ └─────────────┘ └─────────────┘
```

### Implementation Details

#### 1. MFE-Data-Bus Module

**Location**: [mfe-data-bus/](mfe-data-bus/)  
**Purpose**: Independent Module Federation service for data sharing

**Key Features**:
- **Configuration-Driven**: Uses `rules.json` to define data access permissions
- **API-Based Access**: Provides MFE-specific methods (`getProfileData()`, `getReportsData()`)
- **Field-Level Security**: Each MFE can only access configured fields
- **Real-Time Sync**: Automatic change notifications to subscribed MFEs
- **Validation**: Built-in data validation based on rules

**Sample rules.json**:
```json
{
  "version": "1.0",
  "mfeDataAccess": {
    "mfe-profile": {
      "readable": ["name", "DOB"],
      "writable": ["name", "DOB"],
      "description": "Profile MFE can read and update name and date of birth"
    },
    "mfe-reports": {
      "readable": ["state", "name"],
      "writable": ["state"],
      "description": "Reports MFE can read name and state, but only update state"
    }
  },
  "dataValidation": {
    "name": { "type": "string", "maxLength": 100, "required": true },
    "DOB": { "type": "string", "pattern": "^\\d{1,2} \\w+$" },
    "state": { "type": "string", "enum": ["Minnesota", "California", "Texas"] }
  }
}
```

#### 2. Container Integration

**File**: [container/src/bootstrap.js](container/src/bootstrap.js)

The container initializes the DataBus with sample data and manages data flow:

```javascript
// Initialize DataBus with sample data
const DataBus = (await import("mfeDataBus/DataBus")).default;
await DataBus.initialize({
  name: "Santosh Singh",
  DOB: "20 Oct",
  state: "Minnesota"
}, './rules.json');

// For NPM packages: Pass data as props
<Reports reportsData={reportsData} onUpdateState={handleReportsStateUpdate} />

// Subscribe to changes for NPM package updates
DataBus.subscribe('mfe-reports', (data) => setReportsData(data));
```

#### 3. MFE Integration Patterns

**Web Component (mfe-profile)**:
```javascript
// Direct DataBus API access
const DataBus = await import('mfeDataBus/DataBus');
this.dataBus = DataBus.default;

// Get filtered data (only name + DOB)
this.profileData = this.dataBus.getProfileData();

// Update data (validates permissions)
this.dataBus.updateProfileData({ name: "New Name" });
```

**NPM Package (mfe-reports)**:
```javascript
// Receives data via props from container
export const Reports = ({ reportsData, onUpdateState }) => {
  // Container handles DataBus interaction
  // MFE focuses on UI logic
  return <div>User: {reportsData.name}, State: {reportsData.state}</div>;
};
```

### Key Benefits Achieved

#### 1. **MFE Independence**
- Each MFE can work in different container applications
- No tight coupling to specific data sources
- Clear API contracts per MFE

#### 2. **Security & Access Control**
- Field-level permissions per MFE
- Runtime validation of data access
- Configuration-driven security rules

#### 3. **Flexible Integration**
- Works with Module Federation, Web Components, NPM packages
- Container can start with or without initial data
- MFEs can be included in multiple container apps

#### 4. **Maintainability**
- Centralized data sharing logic
- Configuration changes don't require code updates
- Clear separation of concerns

### Data Flow Examples

#### Example 1: Profile Name Update
1. User updates name in `mfe-profile` Web Component
2. `mfe-profile` calls `DataBus.updateProfileData({ name: "New Name" })`
3. DataBus validates write permissions for `mfe-profile`
4. DataBus updates central state and notifies all subscribers
5. `mfe-reports` receives updated data via container props
6. All MFEs showing name reflect the change

#### Example 2: State Selection in Reports
1. User selects state in `mfe-reports` NPM package
2. `mfe-reports` calls `onUpdateState("California")` prop function
3. Container calls `DataBus.updateReportsData({ state: "California" })`
4. DataBus validates write permissions for `mfe-reports`
5. DataBus updates state and notifies subscribers
6. Other MFEs (if subscribed to state data) receive updates

### Architecture Decisions & Rationale

#### Why Independent DataBus Module?
- **Reusability**: Can be used across different container applications
- **Security**: Centralized access control and validation
- **Scalability**: Easy to add new MFEs by updating rules.json
- **Maintenance**: Single source of truth for data sharing logic

#### Why Different Integration Patterns for Different MFEs?
- **mfe-profile (Web Component + DataBus API)**: Demonstrates direct API access for runtime modules
- **mfe-reports (NPM Package + Props)**: Shows how build-time modules integrate via container mediation
- **Future MFEs**: Can choose the pattern that best fits their integration strategy

#### Why Configuration-Driven Access?
- **Flexibility**: Change permissions without code changes
- **Security**: Clear, auditable access rules
- **Governance**: Ops teams can manage data access policies

### Current Limitations & Future Enhancements

#### Known Issues
- **Web Component DataBus Access**: Currently in fallback mode due to Module Federation timing
- **Global Access Concerns**: Direct global exposure has security implications

#### Planned Improvements
1. **DataBus Mediator Pattern**: Secure container-mediated access for Web Components
2. **Event-Based Communication**: Loose coupling via custom events
3. **Advanced Validation**: Schema-based validation with TypeScript support
4. **Audit Logging**: Track data access and modifications
5. **Performance Optimization**: Lazy loading and caching strategies

## Learning Resources

- [Webpack Module Federation Documentation](https://webpack.js.org/concepts/module-federation/)
- [Web Components MDN Guide](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Microfrontends Pattern](https://martinfowler.com/articles/micro-frontends.html)
- [Module Federation Data Sharing Patterns](https://webpack.js.org/concepts/module-federation/)
