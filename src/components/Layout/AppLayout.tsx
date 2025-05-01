
import React, { ReactNode } from 'react';
import Navbar from '../Navigation/Navbar';
import TabNavigation from '../Navigation/TabNavigation';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <TabNavigation />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};

export default AppLayout;
