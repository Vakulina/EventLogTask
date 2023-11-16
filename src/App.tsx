import './App.scss';
import { PrimeReactProvider } from 'primereact/api';
import { ErrorBoundary } from 'shared/components/ErrorBoundary';
import { LogsPage } from 'modules/LogsPage';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import "primeicons/primeicons.css";

const App = () => {
  return (
    <ErrorBoundary>
      <PrimeReactProvider>
        <LogsPage />
      </PrimeReactProvider>
    </ErrorBoundary>
  );
};

export default App;
