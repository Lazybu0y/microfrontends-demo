import React, { Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "mfe-tasks";
import { Reports } from "@acme/mfe-reports";

const Home = React.lazy(() => import("mfeHome/Home"));
const Analytics = React.lazy(() => import("mfeAnalytics/Analytics"));

function App() {
  useEffect(() => {
    import("http://localhost:3003/profile.js");
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h1>🚀 Container (Uber App)</h1>

      <Suspense fallback={<div>Loading Home...</div>}>
        <Home />
      </Suspense>

      <Reports />

      <task-card title="Design Header" status="in-progress"></task-card>

      <profile-card name="Santosh" title="Frontend Engineer"></profile-card>

      <Suspense fallback={<div>Loading Analytics...</div>}>
        <Analytics />
      </Suspense>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
