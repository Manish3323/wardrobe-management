import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from 'react-hot-toast';
import { PiCoatHangerBold } from 'react-icons/pi';
import Wardrobe from './components/Wardrobe';
import OutfitPlanner from './components/OutfitPlanner';

function App() {
  const [activeTab, setActiveTab] = React.useState('wardrobe');

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <PiCoatHangerBold className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                <span className="ml-2 text-lg sm:text-xl font-bold">Personal Wardrobe</span>
              </div>
              <div className="flex space-x-2 sm:space-x-4">
                <button
                  onClick={() => setActiveTab('wardrobe')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg ${
                    activeTab === 'wardrobe'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Wardrobe
                </button>
                <button
                  onClick={() => setActiveTab('planner')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg ${
                    activeTab === 'planner'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Planner
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          {activeTab === 'wardrobe' ? <Wardrobe /> : <OutfitPlanner />}
        </main>
      </div>
      <Toaster position="bottom-right" />
    </DndProvider>
  );
}

export default App;