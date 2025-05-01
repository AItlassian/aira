
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
      
      // If we're going to a PR detail page from a ticket or doc, switch to PR tab
      if (hash.startsWith('#/prs/')) {
        setActiveTab('prs');
      }
      // For regular PR list navigation
      else if (hash === '#/prs') {
        setActiveTab('prs');
      }
      // For ticket navigation (both list and detail)
      else if (hash === '#/tickets' || hash.startsWith('#/tickets/')) {
        setActiveTab('tickets');
      }
      // For documentation navigation (both list and detail)
      else if (hash === '#/docs' || hash.startsWith('#/docs/')) {
        setActiveTab('docs');
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
        return <PRView key={window.location.hash} />;
      case 'tickets':
        return <TicketsView key={window.location.hash} />;
      case 'docs':
        return <DocumentationView key={window.location.hash} />;
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
