
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import CodeEditor from '@/components/CodeEditor/CodeEditor';
import TicketsView from '@/components/Tickets/TicketsView';
import PRView from '@/components/PRs/PRView';
import DocumentationView from '@/components/Documentation/DocumentationView';

const Index = () => {
  const [activeTab, setActiveTab] = useState('code');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    // Handle hash-based navigation for PR links
    const handleHashChange = () => {
      const hash = window.location.hash;
      setIsTransitioning(true);
      
      // If we're going to a PR detail page from a ticket, switch to PR tab
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
      
      // Reset transition state after a short delay
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
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
        return <PRView key={window.location.hash} isTransitioning={isTransitioning} />;
      case 'tickets':
        return <TicketsView key={window.location.hash} isTransitioning={isTransitioning} />;
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
