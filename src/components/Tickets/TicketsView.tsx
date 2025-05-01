
import React, { useState } from 'react';
import { tickets } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import TicketCard from './TicketCard';
import TicketDetail from './TicketDetail';

const TicketsView: React.FC = () => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedCommitId, setSelectedCommitId] = useState<string | null>(null);
  
  const handleTicketClick = (ticketId: string) => {
    setSelectedTicketId(ticketId);
  };
  
  const handleViewCommit = (commitId: string) => {
    setSelectedCommitId(commitId);
  };
  
  const handleBack = () => {
    if (selectedCommitId) {
      setSelectedCommitId(null);
    } else {
      setSelectedTicketId(null);
    }
  };
  
  // Find the selected ticket
  const selectedTicket = tickets.find(t => t.id === selectedTicketId);
  
  // If a ticket is selected, show the ticket detail view
  if (selectedTicket) {
    return (
      <TicketDetail 
        ticket={selectedTicket} 
        onClose={handleBack}
        onViewCommit={handleViewCommit}
      />
    );
  }
  
  // Show the ticket list view
  return (
    <div className="h-full p-4 overflow-auto">
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
