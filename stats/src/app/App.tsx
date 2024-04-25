// src/App.tsx or similar
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/page';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        // Other routes
      </Switch>
    </Router>
  );
};

export default App;
