import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PageComponent from './page'; // Import your page component
import Dashboard from './stats/page';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={PageComponent} />
        <Route path="/pages" component={Dashboard} />
        {/* Add other routes here */}
      </Switch>
    </Router>
  );
}

export default App;
