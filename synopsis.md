# Microfrontend Integration Patterns - Comprehensive Synopsis

## Table of Contents
1. [Patterns Implemented in This Demo](#patterns-implemented-in-this-demo)
2. [Additional Patterns Not Implemented](#additional-patterns-not-implemented)
3. [Comparison Matrix](#comparison-matrix)
4. [Recommendations](#recommendations)
5. [Decision Framework](#decision-framework)
6. [Best Practices](#best-practices)

---

## Patterns Implemented in This Demo

### 1. Build-time Integration (Direct Import) - `mfe-tasks`
**Implementation:** Web Component imported directly at build time

**Location:** [mfe-tasks/](mfe-tasks/)

**How it works:**
- Container imports via `import "mfe-tasks"`
- Bundled together with container at build time
- No separate dev server needed
- Registers custom element `<task-card>`

**Characteristics:**
- ❌ No runtime decoupling
- ✅ Simple build process
- ✅ Zero runtime overhead
- ❌ Cannot deploy independently
- ✅ Shared codebase versioning

**When to use:**
- Internal teams working in same codebase
- Tightly coupled components that rarely change
- Simple components with no external dependencies
- Performance-critical paths (zero runtime cost)

**Code Example:**
```javascript
// mfe-tasks/src/task-card.js
class TaskCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title");
    this.innerHTML = `<div>${title}</div>`;
  }
}
customElements.define("task-card", TaskCard);

// Container usage
import "mfe-tasks";
// Later in JSX:
<task-card title="Design Header" status="in-progress"></task-card>
```

---

### 2. Build-time Integration (NPM Package) - `mfe-reports`
**Implementation:** Published/linked NPM package

**Location:** [mfe-reports/](mfe-reports/)

**How it works:**
- Built as npm package (`@acme/mfe-reports`)
- Webpack compiles JSX to distributable JS
- Container imports as regular dependency
- Version controlled via package.json

**Characteristics:**
- ❌ No runtime decoupling
- ✅ Moderate build complexity
- ✅ Strong version control (semver)
- ✅ Familiar npm workflow
- ⚠️ Update requires reinstall/rebuild

**When to use:**
- Component libraries shared across multiple apps
- Design systems
- When you need strict versioning
- Teams familiar with npm publishing workflow
- Stable APIs that don't change frequently

**Code Example:**
```javascript
// mfe-reports/src/Reports.jsx
export const Reports = () => (
  <div>📈 Reports MFE</div>
);

// mfe-reports/package.json
{
  "name": "@acme/mfe-reports",
  "main": "dist/index.js"
}

// Container usage
import { Reports } from "@acme/mfe-reports";
<Reports />
```

---

### 3. Runtime Integration (Web Component) - `mfe-profile`
**Implementation:** Vanilla JavaScript Web Component loaded at runtime

**Location:** [mfe-profile/](mfe-profile/)

**How it works:**
- Served independently via http-server
- Dynamically imported at runtime via `import()`
- Registers custom element when loaded
- Framework-agnostic

**Characteristics:**
- ✅ Full runtime decoupling
- ✅ Easy build (or no build needed)
- ✅ Independent deployment
- ✅ Technology agnostic
- ✅ Can use across any framework

**When to use:**
- Polyglot teams (different frameworks)
- Legacy system integration
- Maximum reusability across apps
- Simple components without framework needs
- When you want zero coupling

**Code Example:**
```javascript
// mfe-profile/profile.js
class ProfileCard extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name');
    this.innerHTML = `<div>👤 ${name}</div>`;
  }
}
customElements.define('profile-card', ProfileCard);

// Container usage
useEffect(() => {
  import("http://localhost:3003/profile.js");
}, []);
// Later in JSX:
<profile-card name="Santosh" title="Engineer"></profile-card>
```

---

### 4. Runtime Integration (Module Federation) - `mfe-home`, `mfe-analytics`
**Implementation:** Webpack 5 Module Federation

**Location:** [mfe-home/](mfe-home/), [mfe-analytics/](mfe-analytics/)

**How it works:**
- Each MFE runs on separate dev server
- Exposes components via `remoteEntry.js`
- Container loads components at runtime
- Shares dependencies (React, React-DOM)

**Characteristics:**
- ✅ Runtime decoupling
- ✅ Independent deployment
- ✅ Dependency sharing (performance)
- ⚠️ Medium build complexity
- ✅ TypeScript support possible
- ⚠️ Same framework requirement

**When to use:**
- Modern React/Vue/Angular apps
- Need to share large dependencies
- Want independent team deployments
- Need code splitting benefits
- TypeScript type sharing required

**Code Example:**
```javascript
// mfe-home/webpack.config.js
new ModuleFederationPlugin({
  name: "mfeHome",
  filename: "remoteEntry.js",
  exposes: {
    "./Home": "./src/Home.jsx"
  },
  shared: ["react", "react-dom"]
})

// Container webpack.config.js
new ModuleFederationPlugin({
  name: "container",
  remotes: {
    mfeHome: "mfeHome@http://localhost:3001/remoteEntry.js"
  }
})

// Container usage
const Home = React.lazy(() => import("mfeHome/Home"));
<Suspense fallback={<div>Loading...</div>}>
  <Home />
</Suspense>
```

---

## Additional Patterns Not Implemented

### 5. iframe Integration
**What it is:** Embed microfrontends using HTML iframes

**Characteristics:**
- ✅✅ Maximum isolation (separate DOM, CSS, JS context)
- ✅ Technology agnostic (any framework/language)
- ✅ Security boundary (cross-origin)
- ❌ Poor performance (separate page loads)
- ❌ Difficult communication (postMessage)
- ❌ UX challenges (scrolling, sizing, modals)
- ❌ SEO difficulties

**When to use:**
- Integrating untrusted third-party content
- Legacy applications that can't be modified
- Maximum security isolation required
- Different authentication contexts

**Example:**
```html
<iframe
  src="http://legacy-app.com/dashboard"
  sandbox="allow-scripts allow-same-origin"
></iframe>

<!-- Communication -->
<script>
// Parent to iframe
iframe.contentWindow.postMessage({ action: 'load' }, '*');

// Iframe to parent
window.parent.postMessage({ status: 'ready' }, '*');
</script>
```

**Pros & Cons:**
- ✅ Works with any technology
- ✅ Complete isolation
- ❌ Worst performance
- ❌ Poor developer experience

---

### 6. Server-Side Includes (SSI) / Edge-Side Includes (ESI)
**What it is:** Server or CDN composes HTML fragments at request time

**Characteristics:**
- ✅ No JavaScript required
- ✅ SEO-friendly (fully rendered HTML)
- ✅ Good performance (server-side composition)
- ✅ Works without JavaScript enabled
- ❌ Requires server/CDN support
- ❌ Less dynamic (harder real-time updates)
- ⚠️ Backend infrastructure dependency

**When to use:**
- E-commerce sites (SEO critical)
- Content-heavy applications
- Progressive enhancement strategy
- CDN-based architectures (Akamai, Cloudflare)

**Example (ESI):**
```html
<!-- Varnish/Akamai ESI syntax -->
<esi:include src="http://mfe-header/fragment" />

<div class="main-content">
  <esi:include
    src="http://mfe-products/list?category=electronics"
    alt="http://fallback.com/products"
    onerror="continue"
  />
</div>

<esi:include src="http://mfe-footer/fragment" />
```

**Example (SSI - Nginx):**
```nginx
# nginx.conf
location / {
  ssi on;
  # ...
}

# HTML
<!--#include virtual="/fragments/header.html" -->
<main>Content</main>
<!--#include virtual="/fragments/footer.html" -->
```

**Pros & Cons:**
- ✅ Best for SEO
- ✅ No client-side JavaScript needed
- ❌ Requires server configuration
- ⚠️ Less dynamic than client-side

---

### 7. Single-SPA Framework
**What it is:** JavaScript meta-framework for orchestrating multiple SPAs

**Characteristics:**
- ✅ Framework agnostic (React + Vue + Angular)
- ✅ Lifecycle management (mount/unmount)
- ✅ Route-based loading
- ✅ Large ecosystem & community
- ✅ Battle-tested (used by major companies)
- ⚠️ Additional abstraction layer
- ⚠️ Learning curve

**When to use:**
- Migrating monolith to microfrontends
- Multi-framework teams
- Need routing-based loading
- Want established patterns/tooling

**Example:**
```javascript
// root-config.js
import { registerApplication, start } from 'single-spa';

registerApplication({
  name: '@org/navbar',
  app: () => System.import('@org/navbar'),
  activeWhen: ['/']
});

registerApplication({
  name: '@org/dashboard',
  app: () => System.import('@org/dashboard'),
  activeWhen: ['/dashboard']
});

registerApplication({
  name: '@org/settings',
  app: () => System.import('@org/settings'),
  activeWhen: ['/settings']
});

start();

// navbar (React)
export const Navbar = () => <nav>Nav</nav>;
export const bootstrap = [bootstrapFn];
export const mount = [mountFn];
export const unmount = [unmountFn];

// dashboard (Vue)
export default {
  bootstrap: [bootstrapFn],
  mount: [mountFn],
  unmount: [unmountFn]
};
```

**Pros & Cons:**
- ✅ Mature ecosystem
- ✅ Mix frameworks freely
- ⚠️ Extra abstraction
- ⚠️ Less control vs custom solution

---

### 8. Import Maps (Native ES Modules)
**What it is:** Browser-native module resolution without bundlers

**Characteristics:**
- ✅ Native browser feature (standardized)
- ✅ No bundler required
- ✅ Simple configuration
- ✅ Future-proof (web standard)
- ❌ Limited older browser support
- ❌ No build-time optimization
- ⚠️ CORS configuration needed

**When to use:**
- Modern browser-only applications
- Simple projects without complex builds
- Want to avoid bundler complexity
- Future-forward architecture

**Example:**
```html
<!DOCTYPE html>
<html>
<head>
  <script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@18",
      "react-dom": "https://esm.sh/react-dom@18",
      "mfe-home": "http://localhost:3001/home.js",
      "mfe-profile": "http://localhost:3003/profile.js"
    }
  }
  </script>
</head>
<body>
  <div id="root"></div>

  <script type="module">
    import React from 'react';
    import ReactDOM from 'react-dom';
    import Home from 'mfe-home';
    import Profile from 'mfe-profile';

    ReactDOM.render(<Home />, document.getElementById('root'));
  </script>
</body>
</html>
```

**Pros & Cons:**
- ✅ Web standard (future-proof)
- ✅ No build tools needed
- ❌ Newer browsers only
- ❌ No bundling optimizations

---

### 9. Module Federation with Shared State
**What it is:** Module Federation + shared state management (Redux, Zustand, etc.)

**Characteristics:**
- ✅ Shared application state across MFEs
- ✅ Coordinated behavior
- ✅ All Module Federation benefits
- ❌ Increased coupling (shared state)
- ⚠️ Version management complexity
- ⚠️ Testing becomes harder

**When to use:**
- Shopping cart across MFEs
- Shared user authentication state
- Coordinated UI updates needed
- All MFEs same framework

**Example:**
```javascript
// container/webpack.config.js
new ModuleFederationPlugin({
  name: 'container',
  exposes: {
    './store': './src/store'
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    zustand: { singleton: true }
  }
})

// container/src/store.js
import { create } from 'zustand';
export const useStore = create((set) => ({
  user: null,
  cart: [],
  addToCart: (item) => set((state) => ({
    cart: [...state.cart, item]
  }))
}));

// mfe-products/src/ProductList.jsx
import { useStore } from 'container/store';

function ProductList() {
  const addToCart = useStore(state => state.addToCart);
  return <button onClick={() => addToCart(product)}>Add</button>;
}

// mfe-cart/src/Cart.jsx
import { useStore } from 'container/store';

function Cart() {
  const cart = useStore(state => state.cart);
  return <div>Items: {cart.length}</div>;
}
```

**Pros & Cons:**
- ✅ True cross-MFE coordination
- ✅ Shared user experience
- ❌ High coupling
- ⚠️ Testing complexity

---

### 10. Application Shell Pattern
**What it is:** Persistent shell (layout) with dynamic content areas

**Characteristics:**
- ✅ Consistent UX across MFEs
- ✅ Shared navigation/layout
- ✅ Progressive enhancement
- ⚠️ Shell becomes critical dependency
- ⚠️ Shell updates affect all MFEs

**When to use:**
- Dashboards with consistent navigation
- Admin panels
- Apps with shared header/footer/sidebar

**Example:**
```javascript
// Shell (container)
function AppShell() {
  return (
    <div className="app-shell">
      <Header />
      <Sidebar />
      <main className="content-area">
        <Outlet /> {/* MFEs render here */}
      </main>
      <Footer />
    </div>
  );
}

// Routes
<Route path="/dashboard" element={<Dashboard />} /> {/* MFE 1 */}
<Route path="/analytics" element={<Analytics />} /> {/* MFE 2 */}
<Route path="/settings" element={<Settings />} />  {/* MFE 3 */}
```

**Pros & Cons:**
- ✅ Consistent UX
- ✅ Shared layout code
- ⚠️ Shell is single point of failure
- ⚠️ Coupling to shell API

---

### 11. Backend for Frontend (BFF) Pattern
**What it is:** Each MFE has its own backend API

**Characteristics:**
- ✅ Full stack autonomy per team
- ✅ Optimized APIs per frontend
- ✅ Independent deployment (full stack)
- ❌ More infrastructure
- ⚠️ Potential duplication

**When to use:**
- Large organizations with autonomous teams
- Different data requirements per MFE
- Want full stack ownership

**Example:**
```
Architecture:

┌─────────────────┐
│   Container     │
└────────┬────────┘
         │
    ┌────┴─────┬─────────┬─────────┐
    │          │         │         │
┌───▼────┐ ┌──▼────┐ ┌──▼────┐ ┌──▼────┐
│MFE-Home│ │MFE-Cart│ │MFE-Pay│ │MFE-Usr│
└───┬────┘ └──┬────┘ └──┬────┘ └──┬────┘
    │         │         │         │
┌───▼────┐ ┌──▼────┐ ┌──▼────┐ ┌──▼────┐
│BFF-Home│ │BFF-Cart│ │BFF-Pay│ │BFF-Usr│
└───┬────┘ └──┬────┘ └──┬────┘ └──┬────┘
    │         │         │         │
    └─────────┴─────────┴─────────┘
              │
        ┌─────▼─────┐
        │  Services │
        │  (APIs)   │
        └───────────┘

Each MFE team owns:
- Frontend (React/Vue/etc)
- BFF API (Node/Python/Go)
- Deployment pipeline
```

**Pros & Cons:**
- ✅ Team autonomy
- ✅ Tailored APIs
- ❌ More servers to manage
- ⚠️ Potential code duplication

---

## Comparison Matrix

### Feature Comparison

| Pattern | Runtime Decoupling | Reusability | Maintenance | Deployment | Coupling | Performance | SEO |
|---------|-------------------|-------------|-------------|------------|----------|-------------|-----|
| **Build-time (import)** | ❌ None | ⚠️ Medium | ✅ Easy | ❌ Coupled | ❌ High | ✅✅ Excellent | ✅ Good |
| **Build-time (NPM)** | ❌ None | ✅ High | ✅ Easy | ⚠️ Versioned | ⚠️ Medium | ✅✅ Excellent | ✅ Good |
| **Runtime (Web Comp)** | ✅ High | ✅✅ Maximum | ✅ Easy | ✅ Independent | ✅✅ Minimal | ✅ Good | ✅ Good |
| **Runtime (Mod Fed)** | ✅ High | ✅ High | ⚠️ Medium | ✅ Independent | ✅ Low | ✅ Good | ⚠️ Client-side |
| **iframe** | ✅✅ Complete | ⚠️ Medium | ⚠️ Hard | ✅ Independent | ✅✅ None | ❌ Poor | ❌ Poor |
| **SSI/ESI** | ✅ High | ✅ High | ⚠️ Medium | ✅ Independent | ✅ Low | ✅✅ Excellent | ✅✅ Excellent |
| **Single-SPA** | ✅ High | ✅ High | ⚠️ Medium | ✅ Independent | ⚠️ Medium | ✅ Good | ⚠️ Client-side |
| **Import Maps** | ✅ High | ✅ High | ✅ Easy | ✅ Independent | ✅ Low | ⚠️ Medium | ⚠️ Client-side |
| **Shared State MF** | ✅ High | ⚠️ Medium | ❌ Hard | ✅ Independent | ❌ High | ✅ Good | ⚠️ Client-side |
| **App Shell** | ⚠️ Medium | ⚠️ Medium | ⚠️ Medium | ⚠️ Coordinated | ⚠️ Medium | ✅ Good | ⚠️ Depends |
| **BFF** | ✅ High | ⚠️ Medium | ⚠️ Medium | ✅✅ Full Stack | ✅ Low | ✅ Good | ✅ Good |

---

## Recommendations

### For Maximum Reusability, Easy Maintenance, Easy Deployment, Less Coupling

#### 🥇 Winner: Web Components (Runtime)

**Why:**
1. **Maximum Reusability**
   - Works with React, Vue, Angular, Svelte, vanilla JS
   - Browser native (no framework lock-in)
   - Can be published to CDN once, used everywhere
   - Future-proof (web standard)

2. **Easy Maintenance**
   - Simple JavaScript (no complex tooling)
   - Small learning curve
   - Standard browser APIs
   - Easy to debug

3. **Easy Deployment**
   - Static files to CDN
   - No build coordination
   - Version with filename
   - Zero downtime deployments

4. **Less Coupling**
   - No framework dependencies
   - Communication via attributes/events
   - Truly independent

**Best for:**
- Component libraries
- Cross-framework organizations
- Long-term reusability
- Simple to medium complexity widgets

---

#### 🥈 Runner-up: Module Federation

**When to choose instead:**
- All MFEs use same framework (React/Vue)
- Need dependency sharing (reduce bundle size)
- TypeScript type sharing required
- Complex state management needs
- Team comfortable with webpack

**Best for:**
- Modern React/Vue ecosystems
- Large applications with code splitting needs
- Independent team deployments

---

#### 🥉 Third Place: NPM Packages

**When to choose:**
- Building design system
- Need strict versioning (semver)
- Controlled update cycle acceptable
- Internal component library

**Best for:**
- Stable, versioned components
- Design systems
- Shared utilities

---

### Decision Framework

```
START
  │
  ├─ Need SEO? ──YES──> SSI/ESI
  │      │
  │      NO
  │      │
  ├─ Legacy/Third-party? ──YES──> iframe
  │      │
  │      NO
  │      │
  ├─ Same Framework? ──YES──┬─ Need shared dependencies? ──YES──> Module Federation
  │      │                  │           │
  │      │                  │           NO
  │      │                  │           │
  │      │                  └─────────> Web Components or Single-SPA
  │      │
  │      NO (Multi-framework)
  │      │
  └────> Web Components (Browser native, max compatibility)
```

---

### Hybrid Approach (Recommended)

**Don't pick just one!** Combine patterns based on use case:

```javascript
// Example Architecture
Container (React)
├─ Design System (NPM Package) ────── For buttons, inputs, etc.
├─ Header/Footer (Build-time) ────── Rarely changes, ship with container
├─ Dashboard (Module Federation) ──── Complex React app, needs code splitting
├─ Chat Widget (Web Component) ────── Used across all apps (even non-React)
├─ Analytics (Web Component) ──────── Third-party, framework agnostic
└─ Legacy Admin (iframe) ───────────── Can't modify, security boundary
```

---

## Best Practices

### 1. Communication Patterns

**Event-based (Recommended for loose coupling):**
```javascript
// MFE dispatches
const event = new CustomEvent('user-logged-in', {
  detail: { userId: 123 }
});
window.dispatchEvent(event);

// Container listens
window.addEventListener('user-logged-in', (e) => {
  console.log('User ID:', e.detail.userId);
});
```

**Props/Callbacks (For tight coupling):**
```javascript
<MFE onUserLogin={(userId) => handleLogin(userId)} />
```

**Shared Event Bus (Module Federation):**
```javascript
// event-bus.js
import { EventEmitter } from 'events';
export const bus = new EventEmitter();

// Publish
bus.emit('cart-updated', { items: 5 });

// Subscribe
bus.on('cart-updated', ({ items }) => {
  console.log(`Cart has ${items} items`);
});
```

---

### 2. Versioning Strategy

**Semantic Versioning for NPM Packages:**
```json
{
  "dependencies": {
    "@company/design-system": "^2.3.1"  // Minor updates allowed
  }
}
```

**URL Versioning for Runtime MFEs:**
```javascript
// Production
remotes: {
  mfeHome: "mfeHome@https://cdn.com/mfe-home/v1.2.3/remoteEntry.js"
}

// Development
remotes: {
  mfeHome: "mfeHome@http://localhost:3001/remoteEntry.js"
}
```

---

### 3. Error Handling

**Graceful Degradation:**
```javascript
// Container
function MFEWrapper() {
  return (
    <ErrorBoundary fallback={<div>Feature unavailable</div>}>
      <Suspense fallback={<Spinner />}>
        <RemoteMFE />
      </Suspense>
    </ErrorBoundary>
  );
}
```

**Retry Logic:**
```javascript
async function loadMFE(url, retries = 3) {
  try {
    return await import(url);
  } catch (error) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1000));
      return loadMFE(url, retries - 1);
    }
    throw error;
  }
}
```

---

### 4. Performance Optimization

**Lazy Loading:**
```javascript
const Dashboard = React.lazy(() => import('mfeDashboard/App'));
```

**Preloading:**
```javascript
// Preload on hover
<Link
  to="/dashboard"
  onMouseEnter={() => import('mfeDashboard/App')}
>
  Dashboard
</Link>
```

**Shared Dependencies:**
```javascript
// webpack.config.js
shared: {
  react: {
    singleton: true,
    requiredVersion: '^18.0.0'
  }
}
```

---

### 5. Testing Strategy

**Unit Tests (per MFE):**
```javascript
// Test in isolation
test('Home component renders', () => {
  render(<Home />);
  expect(screen.getByText('Welcome')).toBeInTheDocument();
});
```

**Integration Tests (container + MFEs):**
```javascript
// Test MFE integration
test('Container loads Home MFE', async () => {
  render(<Container />);
  await waitFor(() => {
    expect(screen.getByText('Home MFE loaded')).toBeInTheDocument();
  });
});
```

**E2E Tests (full app):**
```javascript
// Cypress/Playwright
test('User can navigate between MFEs', async () => {
  await page.goto('http://localhost:3000');
  await page.click('a[href="/home"]');
  await expect(page.locator('.home-mfe')).toBeVisible();
});
```

---

### 6. Deployment Strategies

**Blue-Green Deployment:**
```
Production:  v1.0.0 (blue)  ──┐
                              ├─> Switch traffic
Staging:     v1.1.0 (green) ─┘
```

**Canary Releases:**
```javascript
// 10% of traffic to new version
const version = Math.random() < 0.1 ? 'v2.0.0' : 'v1.0.0';
const mfeUrl = `https://cdn.com/mfe/${version}/remoteEntry.js`;
```

---

### 7. Monitoring & Observability

**Track MFE Loading:**
```javascript
const startTime = performance.now();
await import('mfeHome/App');
const loadTime = performance.now() - startTime;

// Send to analytics
analytics.track('mfe-load', {
  name: 'mfe-home',
  duration: loadTime
});
```

**Error Tracking:**
```javascript
window.addEventListener('error', (event) => {
  if (event.filename.includes('remoteEntry.js')) {
    errorTracker.log('MFE load failed', {
      mfe: extractMFEName(event.filename),
      error: event.message
    });
  }
});
```

---

## Summary

### Current Demo Coverage
✅ Build-time (Direct Import) - mfe-tasks
✅ Build-time (NPM Package) - mfe-reports
✅ Runtime (Web Component) - mfe-profile
✅ Runtime (Module Federation) - mfe-home, mfe-analytics

### Patterns Worth Adding
⚠️ iframe - For legacy integration demos
⚠️ SSI/ESI - For SEO-critical use cases
⚠️ Import Maps - Future-forward pattern
⚠️ Single-SPA - Enterprise migration pattern

### Top Recommendation
For **maximum reusability, easy maintenance, easy deployment, and less coupling**:

**🥇 Web Components** are the clear winner.

Use Module Federation when you need React-specific features and dependency sharing.

Use a **hybrid approach** combining multiple patterns based on specific requirements of each microfrontend.

---

## References & Resources

- [Webpack Module Federation Documentation](https://webpack.js.org/concepts/module-federation/)
- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Martin Fowler - Micro Frontends](https://martinfowler.com/articles/micro-frontends.html)
- [Single-SPA Documentation](https://single-spa.js.org/)
- [Import Maps Specification](https://github.com/WICG/import-maps)
- [Micro Frontends in Action (Book)](https://www.manning.com/books/micro-frontends-in-action)

---

**Last Updated:** 2025-10-30
**Demo Version:** 1.0.0
