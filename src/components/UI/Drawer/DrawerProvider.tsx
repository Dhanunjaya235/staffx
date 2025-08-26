import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DrawerItem {
  id: string;
  title: string;
  content: ReactNode;
  onClose: () => void;
}

interface DrawerContextType {
  drawers: DrawerItem[];
  openDrawer: (drawer: Omit<DrawerItem, 'id'>) => string;
  closeDrawer: (id: string) => void;
  closeAllDrawers: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};

interface DrawerProviderProps {
  children: ReactNode;
}

export const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
  const [drawers, setDrawers] = useState<DrawerItem[]>([]);

  const openDrawer = (drawer: Omit<DrawerItem, 'id'>) => {
    const id = Date.now().toString();
    const newDrawer = { ...drawer, id };
    setDrawers(prev => [...prev, newDrawer]);
    return id;
  };

  const closeDrawer = (id: string) => {
    setDrawers(prev => prev.filter(drawer => drawer.id !== id));
  };

  const closeAllDrawers = () => {
    setDrawers([]);
  };

  return (
    <DrawerContext.Provider value={{ drawers, openDrawer, closeDrawer, closeAllDrawers }}>
      {children}
      {drawers.map((drawer, index) => (
        <DrawerOverlay
          key={drawer.id}
          drawer={drawer}
          zIndex={1000 + index}
          onClose={() => closeDrawer(drawer.id)}
        />
      ))}
    </DrawerContext.Provider>
  );
};

interface DrawerOverlayProps {
  drawer: DrawerItem;
  zIndex: number;
  onClose: () => void;
}

const DrawerOverlay: React.FC<DrawerOverlayProps> = ({ drawer, zIndex, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      style={{ zIndex }}
    >
      <div 
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{drawer.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {drawer.content}
        </div>
      </div>
    </div>
  );
};