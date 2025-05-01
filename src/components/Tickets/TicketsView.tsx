import React, { useState, useEffect } from 'react';
import { Ticket } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Ticket as TicketIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface TicketsViewProps {
  selectedRepo?: string;
}

const TicketsView: React.FC<TicketsViewProps> = ({ selectedRepo }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTickets = async () => {
      if (!selectedRepo) {
        setTickets([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/repositories/${selectedRepo}/tickets`, {
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to fetch tickets');
        }

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch tickets');
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch tickets. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [selectedRepo, toast]);

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-500';
      case 'review':
        return 'bg-purple-500/10 text-purple-500';
      case 'done':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'low':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (!selectedRepo) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Select a repository to view tickets</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <TicketIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Tickets</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Tickets</h2>
        <Button size="sm" className="gap-1">
          <Plus size={14} />
          <span>New Ticket</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="text-center py-8">
            <TicketIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No tickets found</h3>
            <p className="text-muted-foreground">Create a new ticket to get started</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <Card 
              key={ticket.id} 
              className="hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => window.location.hash = `/tickets/${ticket.id}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{ticket.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  {ticket.assignee && (
                    <span>Assigned to {ticket.assignee}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketsView;
