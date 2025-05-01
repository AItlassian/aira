
import React, { ReactNode, useState } from 'react';
import Navbar from '../Navigation/Navbar';
import TabNavigation from '../Navigation/TabNavigation';

interface AppLayoutProps {
  children: ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  activeTab = 'code',
  onTabChange,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <TabNavigation defaultValue={activeTab} onChange={onTabChange} />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};

export default AppLayout;
