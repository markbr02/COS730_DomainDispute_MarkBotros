'use client'
// src/pages/Dashboard.tsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AdjudicatorsStats from '../components/Stats/AdjudicatorsStats';
import './Dashboard.css'; // Ensure the CSS is imported if not globally available
import CasePerTypeStats from '../components/Stats/CasePerTypeStats';
import CasePerYearStats from '../components/Stats/CasePerYearStats';
import CasesPerTypePerYear from '../components/Stats/CasesPerTypePerYear';

const Dashboard = () => {
  const [selectedStatistic, setSelectedStatistic] = useState('adjudicators');

  const handleSelectStatistic = (statistic: React.SetStateAction<string>) => {
    setSelectedStatistic(statistic);
  };

  const renderContent = () => {
    switch (selectedStatistic) {
      case 'adjudicators':
        return <AdjudicatorsStats />;
      case 'casesPerYear':
        return <CasePerYearStats />;
      case 'casesPerType':
          return <CasePerTypeStats />;
      case 'casesPerTypePerYear':
          return <CasesPerTypePerYear />;
      default:
        return <div>Select a statistic from the menu</div>;
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <Sidebar onSelectStatistic={handleSelectStatistic} selectedStatistic={selectedStatistic} />

      </div>
      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
