import React from 'react';
import Sidebar from './Sidebar';
import { DrawerProvider } from '../UI/Drawer/DrawerProvider';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <DrawerProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </DrawerProvider>
  );
};

export default Layout;