
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import CodeEditor from '@/components/CodeEditor/CodeEditor';
import TicketsView from '@/components/Tickets/TicketsView';
import PRView from '@/components/PRs/PRView';
import DocumentationView from '@/components/Documentation/DocumentationView';

const Index = () => {
  const [activeTab, setActiveTab] = useState('code');
  
  useEffect(() => {
    // Handle hash-based navigation for PR links
    const handleHashChange = () => {
      const hash = window.location.hash;
      // If we're going to a PR detail page from a ticket, don't change the active tab
      // This allows viewing PR details while keeping the active tab as "tickets"
      if (hash.startsWith('#/prs/') && hash.includes('fromTicket=true')) {
        // Don't change the active tab, let PRView component handle this navigation
      }
      // Regular PR tab navigation (not from ticket)
      else if (hash.startsWith('#/prs') && !hash.includes('fromTicket=true')) {
        setActiveTab('prs');
      }
    };
    
    // Check on initial load
    handleHashChange();
    
    // Set up listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
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
