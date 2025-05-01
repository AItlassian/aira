
import React, { useState, useEffect } from 'react';
import { tickets } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import TicketCard from './TicketCard';
import TicketDetail from './TicketDetail';

interface TicketsViewProps {
  isTransitioning?: boolean;
}

const TicketsView: React.FC<TicketsViewProps> = ({ isTransitioning = false }) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedCommitId, setSelectedCommitId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if there's a ticket ID in the URL hash
    const hashPath = window.location.hash;
    if (hashPath.startsWith('#/tickets/')) {
      const ticketId = hashPath.replace('#/tickets/', '');
      if (tickets.some(t => t.id === ticketId)) {
        setSelectedTicketId(ticketId);
      }
    }
    
    // Add hash change listener to handle navigation
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/tickets/')) {
        const ticketId = hash.replace('#/tickets/', '');
        if (tickets.some(t => t.id === ticketId)) {
          setSelectedTicketId(ticketId);
        }
      } else if (hash === '#/tickets') {
        setSelectedTicketId(null);
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
  
  const handleTicketClick = (ticketId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedTicketId(ticketId);
      window.location.hash = `/tickets/${ticketId}`;
      setIsLoading(false);
    }, 50);
  };
  
  const handleViewCommit = (commitId: string) => {
    setSelectedCommitId(commitId);
  };
  
  const handleBack = () => {
    if (selectedCommitId) {
      setSelectedCommitId(null);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setSelectedTicketId(null);
        window.location.hash = '/tickets';
        setIsLoading(false);
      }, 50);
    }
  };
  
  // Find the selected ticket
  const selectedTicket = tickets.find(t => t.id === selectedTicketId);
  
  // If still loading, show a subtle loading state
  if (isLoading || isTransitioning) {
    return (
      <div className="h-full p-4 overflow-auto animate-fade-in">
        {selectedTicket ? (
          <div className="opacity-50">
            <TicketDetail 
              ticket={selectedTicket}
              onClose={handleBack}
              onViewCommit={handleViewCommit}
            />
          </div>
        ) : (
          <div className="opacity-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Tickets</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter size={14} />
                  <span>Filter</span>
                </Button>
                <Button size="sm" className="gap-1">
                  <Plus size={14} />
                  <span>New Ticket</span>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tickets.map((ticket) => (
                <TicketCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // If a ticket is selected, show the ticket detail view
  if (selectedTicket) {
    return (
      <div className="animate-fade-in">
        <TicketDetail 
          ticket={selectedTicket} 
          onClose={handleBack}
          onViewCommit={handleViewCommit}
        />
      </div>
    );
  }
  
  // Show the ticket list view
  return (
    <div className="h-full p-4 overflow-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Tickets</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter size={14} />
            <span>Filter</span>
          </Button>
          <Button size="sm" className="gap-1">
            <Plus size={14} />
            <span>New Ticket</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tickets.map((ticket) => (
          <TicketCard 
            key={ticket.id} 
            ticket={ticket} 
            onClick={() => handleTicketClick(ticket.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TicketsView;
