# Microfrontends Demo

A comprehensive demonstration project showcasing **4 different microfrontend integration patterns** in a single application.

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
- **Characteristics**:
  - ❌ No runtime decoupling - versioned dependency
  - ✅ Moderate build simplicity
  - ✅ Strong version control via npm
  - 🎯 **Use case**: Versioned distribution, shared component libraries

#### 5. MFE-Profile (Runtime - Web Component)
- **Port**: 3003 (served via http-server)
- **Integration**: Dynamically loaded vanilla Web Component
- **Technology**: Vanilla JavaScript Custom Element
- **Location**: [mfe-profile/](mfe-profile/)
- **Characteristics**:
  - ✅ Full runtime decoupling
  - ✅ Easy build process
  - ✅ Independent version control
  - 🎯 **Use case**: Polyglot teams, legacy integration, framework-agnostic components

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
│   │   └── bootstrap.js   # Main app with all MFE integrations
│   ├── public/
│   │   └── index.html
│   ├── webpack.config.js  # Module Federation config
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
├── mfe-reports/           # NPM package MFE
│   ├── src/
│   │   └── Reports.jsx    # Exported component
│   ├── webpack.config.js  # Build config
│   └── package.json       # Published as @acme/mfe-reports
│
└── mfe-profile/           # Runtime Web Component (port 3003)
    └── profile.js         # Standalone custom element

```

## How It Works

### Container Integration Logic

The container ([container/src/bootstrap.js](container/src/bootstrap.js)) demonstrates all integration patterns:

```javascript
// 1. Build-time import (mfe-tasks)
import "mfe-tasks";

// 2. NPM package import (mfe-reports)
import { Reports } from "@acme/mfe-reports";

// 3. Module Federation lazy load (mfe-home, mfe-analytics)
const Home = React.lazy(() => import("mfeHome/Home"));
const Analytics = React.lazy(() => import("mfeAnalytics/Analytics"));

// 4. Runtime Web Component load (mfe-profile)
useEffect(() => {
  import("http://localhost:3003/profile.js");
}, []);
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
- Build MFE-Reports (build-time only, no dev server)

#### Start individual microfrontends:
```bash
npm run start:container   # Container only
npm run start:home        # MFE-Home only
npm run start:analytics   # MFE-Analytics only
npm run start:profile     # MFE-Profile only
npm run start:reports     # Build MFE-Reports
```
#### start mfe-profile in seperate terminal
```bash
npx http-server mfe-profile -p 3003 -c-1
```
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

## Learning Resources

- [Webpack Module Federation Documentation](https://webpack.js.org/concepts/module-federation/)
- [Web Components MDN Guide](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Microfrontends Pattern](https://martinfowler.com/articles/micro-frontends.html)
