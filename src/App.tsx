import { TimelineContainer } from './components/TimelineContainer';
import { Controls } from './components/Controls';
import { TimelineSettings } from './components/ControlsSection/TimelineSettings';
import { DataExportImport } from './components/ControlsSection/DataExportImport';
import { AppTitle } from './components/AppTitle';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-[90%] mx-auto">
        <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <AppTitle />
          <div className="flex gap-4 items-end">
            <TimelineSettings />
            <DataExportImport />
          </div>
        </header>

        <Controls />

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <TimelineContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
