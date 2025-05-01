import React, { useState } from 'react';
import { PullRequest } from '@/data/mockData';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GitPullRequest, GitCommitHorizontal, FileCode, FileText, X, ChevronLeft } from 'lucide-react';

interface PRDetailProps {
  pullRequest: PullRequest;
  onClose: () => void;
  fromTicket?: boolean;
  ticketId?: string | null;
}

// Mock code diff data
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

const PRDetail: React.FC<PRDetailProps> = ({ pullRequest, onClose, fromTicket = false, ticketId = null }) => {
  const getStatusColor = () => {
    switch(pullRequest.status) {
      case 'open': return 'bg-green-500/20 text-green-500';
      case 'closed': return 'bg-red-500/20 text-red-500';
      case 'merged': return 'bg-purple-500/20 text-purple-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  // State to track which commit is selected for viewing
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  
  // Handle back to PR list navigation
  const handleBackToPRs = () => {
    if (fromTicket && ticketId) {
      // Go back to the specific ticket detail page
      window.location.hash = `/tickets/${ticketId}`;
      onClose(); // Also call onClose to properly reset UI state
    } else {
      // For normal PR list navigation
      window.location.hash = '/prs';
      onClose();
    }
  };
  
  // Handle close button click for proper navigation
  const handleClose = () => {
    if (fromTicket && ticketId) {
      window.location.hash = `/tickets/${ticketId}`; // Change URL hash to specific ticket
      onClose(); // Then call onClose to reset UI state
    } else {
      onClose();
    }
  };
  
  // Mock file changes data
  const fileChanges = [
    { path: 'src/components/Auth/Login.tsx', additions: 42, deletions: 12 },
    { path: 'src/services/auth.ts', additions: 78, deletions: 15 },
    { path: 'src/hooks/useAuth.ts', additions: 31, deletions: 5 },
    { path: 'src/components/Navigation.tsx', additions: 8, deletions: 3 }
  ];

  const renderFileDiff = () => {
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
  
  // If viewing a specific commit or file
  if (selectedCommit) {
    return (
      <div className="h-full overflow-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedCommit(null)}>
              <ChevronLeft size={16} />
            </Button>
            <h2 className="text-xl font-bold">Commit: {selectedCommit}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X size={16} />
          </Button>
        </div>
        
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Changes in commit {selectedCommit}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderFileDiff()}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (selectedFile) {
    return (
      <div className="h-full overflow-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
              <ChevronLeft size={16} />
            </Button>
            <h2 className="text-xl font-bold">File: {selectedFile}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X size={16} />
          </Button>
        </div>
        
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Changes in {selectedFile}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderFileDiff()}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full overflow-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 border-b">
        <div className="flex items-center gap-2">
          {/* Show the back button for all PR views */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToPRs} 
            className="gap-1"
          >
            <ChevronLeft size={16} />
            <span>{fromTicket ? "Back to Ticket" : "All Pull Requests"}</span>
          </Button>
          <div className="ml-4">
            <h2 className="text-xl font-bold">Pull Request #{pullRequest.id.replace('pr', '')}</h2>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleClose}>
          <X size={16} />
        </Button>
      </div>
      
      <div className="p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{pullRequest.title}</CardTitle>
              <Badge className={getStatusColor()}>
                {pullRequest.status}
              </Badge>
            </div>
            <CardDescription>
              Created by {pullRequest.author} on {new Date(pullRequest.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">{pullRequest.description}</p>
            
            {pullRequest.aiSummary && (
              <div className="mb-6 p-4 bg-primary/5 rounded-md border border-primary/20">
                <Badge variant="outline" className="mb-2 bg-primary/10">AI Summary</Badge>
                <p className="text-sm">{pullRequest.aiSummary}</p>
              </div>
            )}
            
            <Accordion type="multiple" className="border rounded-md">
              <AccordionItem value="commits">
                <AccordionTrigger className="px-4">
                  <span className="flex items-center gap-2">
                    <GitCommitHorizontal size={16} />
                    <span>Commits ({pullRequest.commits.length})</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {pullRequest.commits.map((commitId) => (
                      <Card key={commitId} className="p-2 hover:bg-accent/20 cursor-pointer" onClick={() => setSelectedCommit(commitId)}>
                        <div className="flex items-center gap-2">
                          <GitCommitHorizontal size={14} className="text-primary" />
                          <span className="text-sm font-medium">{commitId}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="files">
                <AccordionTrigger className="px-4">
                  <span className="flex items-center gap-2">
                    <FileCode size={16} />
                    <span>Changed Files ({fileChanges.length})</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {fileChanges.map((file, index) => (
                      <Card 
                        key={index} 
                        className="p-2 hover:bg-accent/20 cursor-pointer" 
                        onClick={() => setSelectedFile(file.path)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText size={14} className="text-primary" />
                            <span className="text-sm">{file.path}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-green-500">+{file.additions}</span>
                            <span className="mx-1">/</span>
                            <span className="text-red-500">-{file.deletions}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PRDetail;
