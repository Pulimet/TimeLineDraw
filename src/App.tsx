import { TimelineContainer } from './components/TimelineContainer';
import { Controls } from './components/Controls';
import { TimelineSettings } from './components/ControlsSection/TimelineSettings';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-[90%] mx-auto">
        <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Timeline Diagram Generator</h1>
            <p className="text-gray-500 text-sm mt-1">
              Create, manage, and rearrange horizontal progress flows.
            </p>
          </div>
          <TimelineSettings />
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
