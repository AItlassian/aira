import React, { useState, useEffect } from 'react';
import { PullRequest } from '@/types';
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
import { GitPullRequest, GitCommitHorizontal, FileCode, FileText, X, ChevronLeft, Plus, Minus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PRDetailProps {
  pullRequest: PullRequest;
  onClose: () => void;
  fromTicket?: boolean;
  ticketId?: string | null;
  fromDoc?: boolean;
  docId?: string | null;
}

const PRDetail: React.FC<PRDetailProps> = ({ 
  pullRequest, 
  onClose,
  fromTicket,
  ticketId,
  fromDoc,
  docId
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileDiff, setFileDiff] = useState<string>('');
  const [prDescription, setPrDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPrDescription = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8000/generate-pr-description', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            commits: pullRequest.commits,
            title: pullRequest.title
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to generate PR description');
        }
        
        const data = await response.json();
        setPrDescription(data.description);
      } catch (error) {
        console.error('Error generating PR description:', error);
        setError(error instanceof Error ? error.message : 'Failed to generate PR description');
        setPrDescription(pullRequest.description); // Fallback to original description
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to generate PR description. Using original description.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrDescription();
  }, [pullRequest, toast]);

  const handleFileSelect = async (filePath: string) => {
    setSelectedFile(filePath);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/repositories/${pullRequest.repo}/contents/${filePath}?ref=${pullRequest.branch}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to fetch file diff');
      }
      
      const data = await response.json();
      setFileDiff(data.diff || '');
    } catch (error) {
      console.error('Error fetching file diff:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch file diff');
      setFileDiff('');
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch file changes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderFileDiff = () => {
    if (loading) {
      return (
        <div className="animate-pulse bg-muted rounded-md h-32"></div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-4 text-red-500">
          <p>{error}</p>
        </div>
      );
    }

    if (!fileDiff) return null;

    return (
      <div className="bg-muted rounded-md overflow-auto text-sm font-mono">
        <div className="flex flex-col">
          {fileDiff.split('\n').map((line, index) => {
            let lineClass = '';
            let icon = null;
            
            if (line.startsWith('+')) {
              lineClass = 'bg-green-500/10';
              icon = <Plus size={14} className="text-green-500" />;
            } else if (line.startsWith('-')) {
              lineClass = 'bg-red-500/10';
              icon = <Minus size={14} className="text-red-500" />;
            } else if (line.startsWith('@')) {
              lineClass = 'bg-blue-500/10';
            }
            
            return (
              <div key={index} className={`flex items-start px-2 ${lineClass}`}>
                {icon && <span className="mr-2">{icon}</span>}
                <span className="whitespace-pre">{line}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleBackToPRs = () => {
    if (fromTicket && ticketId) {
      window.location.hash = `/tickets/${ticketId}`;
      onClose();
    } else if (fromDoc && docId) {
      window.location.hash = `/docs/${docId}`;
      onClose();
    } else {
      window.location.hash = '/prs';
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'open': return 'bg-green-500/20 text-green-500';
      case 'closed': return 'bg-red-500/20 text-red-500';
      case 'merged': return 'bg-purple-500/20 text-purple-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 border-b">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToPRs} 
            className="gap-1"
          >
            <ChevronLeft size={16} />
            <span>
              {fromTicket ? "Back to Ticket" : fromDoc ? "Back to Documentation" : "All Pull Requests"}
            </span>
          </Button>
          <div className="ml-4">
            <h2 className="text-xl font-bold">Pull Request #{pullRequest.id.replace('pr', '')}</h2>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{pullRequest.title}</CardTitle>
              <Badge className={getStatusColor(pullRequest.status)}>
                {pullRequest.status}
              </Badge>
            </div>
            <CardDescription>
              Created by {pullRequest.author} • {new Date(pullRequest.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Description</div>
              {loading ? (
                <div className="animate-pulse bg-muted h-20 rounded-md"></div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <p className="text-muted-foreground whitespace-pre-wrap">{prDescription}</p>
              )}
            </div>

            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Commits</div>
              <div className="space-y-2">
                {pullRequest.commits.map((commit) => (
                  <div key={commit.id} className="flex items-center gap-2 text-sm">
                    <GitCommitHorizontal size={14} className="text-primary" />
                    <span className="font-mono">{commit.id.slice(0, 7)}</span>
                    <span className="text-muted-foreground">{commit.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">File Changes</CardTitle>
            <CardDescription>
              {pullRequest.changedFiles.length} files changed
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {pullRequest.changedFiles.map((file) => (
                <Accordion key={file.path} type="single" collapsible>
                  <AccordionItem value={file.path}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <FileCode size={14} className="text-primary" />
                        <span className="font-mono text-sm">{file.path}</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="text-green-500">+{file.additions}</span>
                          <span className="text-red-500">-{file.deletions}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {selectedFile === file.path ? (
                        renderFileDiff()
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleFileSelect(file.path)}
                          className="w-full"
                        >
                          View Changes
                        </Button>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PRDetail;
