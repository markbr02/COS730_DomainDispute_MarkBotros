// Sidebar component with updated styles
'use client';
import React from 'react';
import './Sidebar.css';

const Sidebar = ({ onSelectStatistic, selectedStatistic }) => {
  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-header">Domain Dispute ZA Stats</div>
        <button
          className={`sidebar-btn ${selectedStatistic === 'adjudicators' ? 'active' : ''}`}
          onClick={() => onSelectStatistic('adjudicators')}
        >
          Number of Adjudicators
        </button>
        <button
          className={`sidebar-btn ${selectedStatistic === 'casesPerYear' ? 'active' : ''}`}
          onClick={() => onSelectStatistic('casesPerYear')}
        >
          Number of Cases per Year
        </button>
        <button
          className={`sidebar-btn ${selectedStatistic === 'casesPerType' ? 'active' : ''}`}
          onClick={() => onSelectStatistic('casesPerType')}
        >
          Cases per Type
        </button>
        <button
          className={`sidebar-btn ${selectedStatistic === 'casesPerTypePerYear' ? 'active' : ''}`}
          onClick={() => onSelectStatistic('casesPerTypePerYear')}
        >
          Cases per Type per Year
        </button>
        {/* More buttons can be added here */}
      </div>
      <button
        className="home-btn"
        onClick={() => onSelectStatistic('../../page.tsx')} // Replace 'home' with the actual route or function to navigate home
      >
        Home
      </button>
    </div>
  );
};

export default Sidebar;
