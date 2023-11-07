import './App.css';
import { ErrorBoundary } from 'shared/components/ErrorBoundary';
import { LogsPage } from 'modules/LogsPage';

const App = () => {
  return (
    <ErrorBoundary>
      <LogsPage />
    </ErrorBoundary>
  );
};

export default App;
