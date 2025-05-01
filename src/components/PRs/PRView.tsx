
import React, { useState, useEffect } from 'react';
import { pullRequests } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Plus, Search, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PRCard from './PRCard';
import PRDetail from './PRDetail';

interface PRViewProps {
  isTransitioning?: boolean;
}

const PRView: React.FC<PRViewProps> = ({ isTransitioning = false }) => {
  const [selectedPR, setSelectedPR] = useState<string | null>(null);
  const [fromTicket, setFromTicket] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
    
    // Simulate loading for smooth transition
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      clearTimeout(timer);
    };
  }, []);
  
  const handlePRClick = (prId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.hash = `#/prs/${prId}`;
      setSelectedPR(prId);
      setFromTicket(false);
      setTicketId(null);
      setIsLoading(false);
    }, 50);
  };
  
  const handleBack = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (fromTicket && ticketId) {
        window.location.hash = `/tickets/${ticketId}`;
        setSelectedPR(null);
      } else {
        window.location.hash = '/prs';
        setSelectedPR(null);
      }
      setIsLoading(false);
    }, 50);
  };
  
  // Find the selected pull request
  const selectedPullRequest = pullRequests.find(pr => pr.id === selectedPR);
  
  // If still loading, show a subtle loading state
  if (isLoading || isTransitioning) {
    return (
      <div className="h-full p-4 overflow-auto animate-fade-in">
        {selectedPullRequest ? (
          <div className="opacity-50">
            <PRDetail 
              pullRequest={selectedPullRequest}
              onClose={handleBack}
              fromTicket={fromTicket}
              ticketId={ticketId}
            />
          </div>
        ) : (
          <div className="opacity-50">
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
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  if (selectedPR && selectedPullRequest) {
    return (
      <div className="animate-fade-in">
        <PRDetail 
          pullRequest={selectedPullRequest} 
          onClose={handleBack}
          fromTicket={fromTicket}
          ticketId={ticketId} 
        />
      </div>
    );
  }
  
  return (
    <div className="h-full p-4 overflow-auto animate-fade-in">
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
