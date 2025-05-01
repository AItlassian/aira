import React from 'react';
import { Ticket } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  const completedTasks = ticket.subtasks.filter(task => task.status === 'done').length;
  const progress = (completedTasks / ticket.subtasks.length) * 100;
  
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
    <Card 
      className="hover:bg-accent/50 cursor-pointer transition-colors"
      onClick={onClick}
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
  );
};

export default TicketCard;
