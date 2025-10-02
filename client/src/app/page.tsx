"use client";

import { useState } from "react";
import Dashboard from "../components/Dashboard";
import AdvancedDashboard from "../components/AdvancedDashboard";

export default function Home() {
  const [useAdvancedDashboard, setUseAdvancedDashboard] = useState(true);

  return (
    <div>
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        zIndex: 1000,
        background: 'white',
        padding: '8px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={useAdvancedDashboard}
            onChange={(e) => setUseAdvancedDashboard(e.target.checked)}
          />
          Dashboard Avanzado
        </label>
      </div>
      
      {useAdvancedDashboard ? <AdvancedDashboard /> : <Dashboard />}
    </div>
  );
}
