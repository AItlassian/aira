
import React, { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import CodeEditor from '@/components/CodeEditor/CodeEditor';
import TicketsView from '@/components/Tickets/TicketsView';
import PRView from '@/components/PRs/PRView';
import DocumentationView from '@/components/Documentation/DocumentationView';

const Index = () => {
  const [activeTab, setActiveTab] = useState('code');
  
  const renderContent = () => {
    switch (activeTab) {
      case 'code':
        return <CodeEditor />;
      case 'prs':
        return <PRView />;
      case 'tickets':
        return <TicketsView />;
      case 'docs':
        return <DocumentationView />;
      default:
        return <CodeEditor />;
    }
  };
  
  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="h-[calc(100vh-6.5rem)]">
        {renderContent()}
      </div>
    </AppLayout>
  );
};

export default Index;
