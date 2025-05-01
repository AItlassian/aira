
import React from 'react';
import { Ticket } from '@/data/mockData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const completedTasks = ticket.subtasks.filter(task => task.completed).length;
  const progress = (completedTasks / ticket.subtasks.length) * 100;
  
  const getStatusColor = () => {
    switch(ticket.status) {
      case 'todo': return 'bg-muted text-muted-foreground';
      case 'in-progress': return 'bg-blue-500/20 text-blue-500';
      case 'review': return 'bg-amber-500/20 text-amber-500';
      case 'done': return 'bg-green-500/20 text-green-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  const getPriorityColor = () => {
    switch(ticket.priority) {
      case 'low': return 'bg-secondary text-secondary-foreground';
      case 'medium': return 'bg-amber-500/20 text-amber-500';
      case 'high': return 'bg-red-500/20 text-red-500';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };
  
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{ticket.title}</CardTitle>
          <Badge className={getStatusColor()}>
            {ticket.status.replace('-', ' ')}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {new Date(ticket.createdAt).toLocaleDateString()} • {ticket.assignee}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="text-sm mb-3 line-clamp-2 text-muted-foreground">
          {ticket.description}
        </div>
        
        <div className="mb-1 flex justify-between items-center">
          <div className="text-xs font-medium">Progress</div>
          <div className="text-xs text-muted-foreground">{completedTasks}/{ticket.subtasks.length}</div>
        </div>
        <Progress value={progress} className="h-1.5 mb-3" />
        
        <div className="space-y-1.5">
          {ticket.subtasks.slice(0, 3).map(task => (
            <div key={task.id} className="flex items-center space-x-2">
              <Checkbox id={task.id} checked={task.completed} />
              <Label 
                htmlFor={task.id} 
                className={`text-xs cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
              >
                {task.title}
              </Label>
            </div>
          ))}
          {ticket.subtasks.length > 3 && (
            <div className="text-xs text-muted-foreground pl-6">
              +{ticket.subtasks.length - 3} more subtasks
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="flex justify-between w-full">
          <Badge variant="outline" className={getPriorityColor()}>
            {ticket.priority}
          </Badge>
          {ticket.relatedPRs.length > 0 && (
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {ticket.relatedPRs.length} PR{ticket.relatedPRs.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TicketCard;
