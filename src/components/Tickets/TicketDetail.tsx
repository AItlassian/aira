import React, { useState } from 'react';
import { Ticket, commits } from '@/data/mockData';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TicketIcon,
  ListTodo,
  GitCommitHorizontal,
  GitPullRequest,
  X,
  Check,
  ChevronLeft
} from 'lucide-react';

interface TicketDetailProps {
  ticket: Ticket;
  onClose: () => void;
  onViewCommit: (commitId: string) => void;
}

// Mock code diff data to show when a commit is viewed
const mockDiff = `
@@ -12,7 +12,7 @@ const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
- const [isLoading, setIsLoading] = useState(true);
+ const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
@@ -24,6 +24,9 @@ const Login = () => {
      // Handle successful login
      console.log('Logged in successfully');
      navigate('/dashboard');
+   } catch (error) {
+     console.error('Login failed:', error);
+     setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
`;

const TicketDetail: React.FC<TicketDetailProps> = ({ ticket, onClose, onViewCommit }) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
  
  // State to track if user is viewing a PR
  const [viewingPR, setViewingPR] = useState<string | null>(null);
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'todo': return 'bg-muted text-muted-foreground';
      case 'in-progress': return 'bg-blue-500/20 text-blue-500';
      case 'review': return 'bg-amber-500/20 text-amber-500';
      case 'done': return 'bg-green-500/20 text-green-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'low': return 'bg-secondary text-secondary-foreground';
      case 'medium': return 'bg-amber-500/20 text-amber-500';
      case 'high': return 'bg-red-500/20 text-red-500';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };
  
  const handleTaskDoubleClick = (task: Ticket['subtasks'][0]) => {
    // Only allow editing for tasks that are not done
    if (task.status !== 'done') {
      setEditingTaskId(task.id);
      setEditingTaskTitle(task.title);
    }
  };
  
  const saveTaskEdit = (taskId: string) => {
    // In a real app, this would update the task via API
    setEditingTaskId(null);
  };
  
  const cancelTaskEdit = () => {
    setEditingTaskId(null);
  };
  
  const handleStatusChange = (taskId: string, status: string) => {
    // In a real app, this would update the task status via API
    console.log(`Changing status of task ${taskId} to ${status}`);
  };
  
  const handleViewPR = (prId: string) => {
    // Update URL hash to navigate to the PR view with fromTicket parameter
    window.location.hash = `/prs/${prId}?fromTicket=true`;
  };
  
  const renderFileDiff = () => {
    const commitData = commits.find(c => c.id === selectedCommit);
    
    return (
      <div className="bg-muted p-4 rounded-md overflow-auto text-sm font-mono whitespace-pre">
        <div className="flex flex-col">
          {mockDiff.split('\n').map((line, index) => {
            let lineClass = '';
            if (line.startsWith('+')) lineClass = 'bg-green-500/10';
            else if (line.startsWith('-')) lineClass = 'bg-red-500/10';
            else if (line.startsWith('@')) lineClass = 'bg-blue-500/10';
            
            return (
              <div key={index} className={`px-2 ${lineClass}`}>
                {line}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // If user is viewing a PR, navigate to PR view
  if (viewingPR) {
    // In a real app with routing, we would navigate to PR view
    // For now, we'll redirect to PR tab in parent component
    window.location.href = `/#/prs/${viewingPR}?fromTicket=true`;
    return null;
  }
  
  // If a commit is selected, show the commit detail view
  if (selectedCommit) {
    const commitData = commits.find(c => c.id === selectedCommit);
    
    return (
      <div className="h-full overflow-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedCommit(null)}>
              <ChevronLeft size={16} />
            </Button>
            <h2 className="text-xl font-bold">Commit: {commitData?.message || selectedCommit}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
        
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {commitData?.message || `Changes in commit ${selectedCommit}`}
              </CardTitle>
              <CardDescription>
                By {commitData?.author || 'Unknown'} on {commitData ? new Date(commitData.date).toLocaleDateString() : 'Unknown date'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderFileDiff()}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Main ticket detail view
  return (
    <div className="h-full overflow-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 border-b">
        <div className="flex items-center gap-2">
          <TicketIcon size={20} className="text-primary" />
          <h2 className="text-xl font-bold">Ticket #{ticket.id.replace('t', '')}</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>
      
      <div className="p-4">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{ticket.title}</CardTitle>
              <Badge className={getStatusColor(ticket.status)}>
                {ticket.status.replace('-', ' ')}
              </Badge>
            </div>
            <CardDescription>
              Created on {new Date(ticket.createdAt).toLocaleDateString()} • Last updated {new Date(ticket.updatedAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <div className="text-sm font-medium mb-1">Description</div>
              <p className="text-muted-foreground">{ticket.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-sm font-medium mb-1">Assignee</div>
                <div>{ticket.assignee || 'Unassigned'}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Priority</div>
                <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </div>
            </div>
            
            {ticket.relatedPRs.length > 0 && (
              <div className="mb-6">
                <div className="text-sm font-medium mb-2">Related Pull Requests</div>
                <div className="flex gap-2">
                  {ticket.relatedPRs.map(prId => (
                    <Badge 
                      key={prId} 
                      variant="outline" 
                      className="bg-primary/10 text-primary flex items-center gap-1 cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => handleViewPR(prId)}
                    >
                      <GitPullRequest size={12} />
                      PR #{prId.replace('pr', '')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subtasks</CardTitle>
            <CardDescription>
              {ticket.subtasks.filter(task => task.status === 'done').length} of {ticket.subtasks.length} tasks completed
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%]">Task</TableHead>
                  <TableHead className="w-[20%]">Status</TableHead>
                  <TableHead className="w-[20%]">Commit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ticket.subtasks.map(task => (
                  <TableRow key={task.id} className="group">
                    <TableCell>
                      {editingTaskId === task.id ? (
                        <Input 
                          value={editingTaskTitle} 
                          onChange={(e) => setEditingTaskTitle(e.target.value)} 
                          className="w-full"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveTaskEdit(task.id);
                            if (e.key === 'Escape') cancelTaskEdit();
                          }}
                        />
                      ) : (
                        <div 
                          className={`${task.status === 'done' ? 'line-through text-muted-foreground' : ''} ${task.status !== 'done' ? 'cursor-text' : ''}`}
                          onDoubleClick={() => handleTaskDoubleClick(task)}
                        >
                          {task.title}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={task.status}
                        onValueChange={(value) => handleStatusChange(task.id, value)}
                      >
                        <SelectTrigger className="h-8 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="review">In Review</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {task.commitId && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0"
                                onClick={() => setSelectedCommit(task.commitId)}
                              >
                                <GitCommitHorizontal size={16} className="text-primary" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View commit</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          
          <CardFooter className="flex justify-end pt-0">
            <Button variant="outline" size="sm" className="gap-1">
              <ListTodo size={14} />
              <span>Add Subtask</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TicketDetail;
