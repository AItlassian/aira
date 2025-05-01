
import React, { useState, useEffect } from 'react';
import { pullRequests } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Plus, Search, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PRCard from './PRCard';
import PRDetail from './PRDetail';

const PRView: React.FC = () => {
  const [selectedPR, setSelectedPR] = useState<string | null>(null);
  const [fromTicket, setFromTicket] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if there's a PR ID in the URL hash
    const hashPath = window.location.hash;
    if (hashPath.startsWith('#/prs/')) {
      const prId = hashPath.replace(/#\/prs\/([^?]+).*/, '$1');
      if (prId && pullRequests.some(pr => pr.id === prId)) {
        setSelectedPR(prId);
        // Check if we came from ticket view
        setFromTicket(hashPath.includes('fromTicket=true'));
        
        // Extract ticket ID if present
        const ticketIdMatch = hashPath.match(/ticketId=([^&]+)/);
        if (ticketIdMatch && ticketIdMatch[1]) {
          setTicketId(ticketIdMatch[1]);
        }
      }
    }
    
    // Add hash change listener to handle navigation
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/prs/')) {
        const prId = hash.replace(/#\/prs\/([^?]+).*/, '$1');
        if (prId && pullRequests.some(pr => pr.id === prId)) {
          setSelectedPR(prId);
          setFromTicket(hash.includes('fromTicket=true'));
          
          // Extract ticket ID if present
          const ticketIdMatch = hash.match(/ticketId=([^&]+)/);
          if (ticketIdMatch && ticketIdMatch[1]) {
            setTicketId(ticketIdMatch[1]);
          } else {
            setTicketId(null);
          }
        }
      } else if (hash === '#/prs' || hash === '' || hash.startsWith('#/tickets')) {
        // Reset to PR list view or handle ticket navigation
        setSelectedPR(null);
        setFromTicket(false);
        setTicketId(null);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  const handlePRClick = (prId: string) => {
    // Update the URL hash when selecting a PR directly
    window.location.hash = `#/prs/${prId}`;
    setSelectedPR(prId);
    setFromTicket(false);
    setTicketId(null);
  };
  
  const handleBack = () => {
    if (fromTicket && ticketId) {
      window.location.hash = `/tickets/${ticketId}`;
      setSelectedPR(null);
    } else {
      window.location.hash = '/prs';
      setSelectedPR(null);
    }
  };
  
  // Find the selected pull request
  const selectedPullRequest = pullRequests.find(pr => pr.id === selectedPR);
  
  if (selectedPR && selectedPullRequest) {
    return <PRDetail 
      pullRequest={selectedPullRequest} 
      onClose={handleBack}
      fromTicket={fromTicket}
      ticketId={ticketId} 
    />;
  }
  
  return (
    <div className="h-full p-4 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Pull Requests</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search PRs..." 
              className="pl-8 h-9" 
            />
          </div>
          <Button size="sm" className="gap-1">
            <Plus size={14} />
            <span>New PR</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {pullRequests.map((pr) => (
          <PRCard 
            key={pr.id} 
            pullRequest={pr} 
            onClick={() => handlePRClick(pr.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PRView;
