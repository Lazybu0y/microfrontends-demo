import React, { useState } from "react";

export const Reports = ({ reportsData = {}, onUpdateState }) => {
  const [newState, setNewState] = useState(reportsData.state || '');

  const updateState = () => {
    if (onUpdateState && newState.trim()) {
      onUpdateState(newState);
      console.log('mfe-reports: Requested state update to:', newState);
    }
  };

  return (
    <div style={{ border: "1px dashed gray", padding: "10px", margin: "10px 0", backgroundColor: "#f9f9f9" }}>
      <h4>📈 Reports MFE (NPM Package Variant)</h4>
      
      <div>
        <p backgroundColor>SINCE THIS IS included as NPM module, it cannot use DATA BUS !!!!</p>
        <p><strong>User:</strong> {reportsData.name || 'Unknown'}</p>
        <p><strong>State:</strong> {reportsData.state || 'Not set'}</p>
        
        <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "white", border: "1px solid #ddd" }}>
          <h5>📊 State Reports</h5>
          <p>Generating reports for: <strong>{reportsData.state || 'No state selected'}</strong></p>
          
          <div style={{ marginTop: "10px" }}>
            <select 
              value={newState} 
              onChange={(e) => setNewState(e.target.value)}
              style={{ marginRight: "5px", padding: "5px" }}
            >
              <option value="">Select State</option>
              <option value="Minnesota">Minnesota</option>
              <option value="California">California</option>
              <option value="Texas">Texas</option>
              <option value="New York">New York</option>
              <option value="Florida">Florida</option>
              <option value="Illinois">Illinois</option>
            </select>
            <button onClick={updateState} style={{ padding: "5px 10px" }}>
              Update State
            </button>
          </div>
        </div>
        
        <small style={{ color: "#666" }}>Data access: Receives data via props from container</small>
      </div>
    </div>
  );
};