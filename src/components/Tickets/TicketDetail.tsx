import React from 'react';
import { Ticket } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft } from 'lucide-react';

interface TicketDetailProps {
  ticket: Ticket;
  onClose: () => void;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticket, onClose }) => {
  const handleBackToTickets = () => {
    window.location.hash = '/tickets';
    onClose();
  };

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

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 border-b">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToTickets} 
            className="gap-1"
          >
            <ChevronLeft size={16} />
            <span>All Tickets</span>
          </Button>
          <div className="ml-4">
            <h2 className="text-xl font-bold">{ticket.title}</h2>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {ticket.description}
              </div>
            </CardContent>
          </Card>

          {ticket.subtasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Subtasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ticket.subtasks.map((subtask) => (
                    <div 
                      key={subtask.id}
                      className="flex items-center justify-between p-2 rounded-md bg-secondary/50"
                    >
                      <span>{subtask.title}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(subtask.status)}`}>
                        {subtask.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                </div>
                {ticket.assignee && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assigned to</span>
                    <span>{ticket.assignee}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
