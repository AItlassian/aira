
import React from 'react';
import { tickets } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import TicketCard from './TicketCard';

const TicketsView: React.FC = () => {
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
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};

export default TicketsView;
