import React, { Suspense, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "../../mfe-tasks";
import { Reports } from "@acme/mfe-reports";
import DataBus from "./databus/DataBus.js";
import DataBusAPI from "./databus/DataBusAPI.js";

const Home = React.lazy(() => import("mfeHome/Home"));
const Analytics = React.lazy(() => import("mfeAnalytics/Analytics"));

function App() {
  const [dataBusReady, setDataBusReady] = useState(false);
  const [reportsData, setReportsData] = useState({});

  useEffect(() => {
    const initializeDataBus = async () => {
      try {
        // Initialize local DataBus
        await DataBus.initialize(
          {
            name: "Santosh Singh",
            DOB: "20 Oct",
            state: "Minnesota"
          },
          './rules.json'
        );
        
        // Subscribe to reports data changes for NPM package
        DataBus.subscribe('mfe-reports', (data) => {
          setReportsData(data);
        });
        
        // Get initial reports data
        setReportsData(DataBus.getReportsData());
        
        // Make API ready for Web Components
        DataBusAPI.setReady();
        
        setDataBusReady(true);
        console.log('Container: Local DataBus initialized successfully');
      } catch (error) {
        console.error('Container: Failed to initialize DataBus:', error);
        setDataBusReady(false);
      }
    };

    const loadProfileScript = () => {
      const script = document.createElement('script');
      script.src = 'http://localhost:3003/profile.js';
      script.type = 'text/javascript';
      document.head.appendChild(script);
    };

    initializeDataBus();
    loadProfileScript();
  }, []);

  const handleReportsStateUpdate = (newState) => {
    if (dataBusReady) {
      DataBus.updateReportsData({ state: newState });
      console.log('Container: Updated reports state to:', newState);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h1>🚀 Container (Uber App) with Data Sharing</h1>
      <p>DataBus Status: {dataBusReady ? "✅ Ready" : "⏳ Initializing..."}</p>

      <Suspense fallback={<div>Loading Home...</div>}>
        <Home />
      </Suspense>

      <Reports reportsData={reportsData} onUpdateState={handleReportsStateUpdate} />

      <task-card title="Design Header" status="in-progress"></task-card>

      <profile-card name="Santosh" title="Frontend Engineer"></profile-card>

      <Suspense fallback={<div>Loading Analytics...</div>}>
        <Analytics />
      </Suspense>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
