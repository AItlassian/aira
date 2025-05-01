
import React from 'react';
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
import { GitPullRequest, GitCommitHorizontal, FileCode, FileText, X } from 'lucide-react';

interface PRDetailProps {
  pullRequest: PullRequest;
  onClose: () => void;
}

const PRDetail: React.FC<PRDetailProps> = ({ pullRequest, onClose }) => {
  const getStatusColor = () => {
    switch(pullRequest.status) {
      case 'open': return 'bg-green-500/20 text-green-500';
      case 'closed': return 'bg-red-500/20 text-red-500';
      case 'merged': return 'bg-purple-500/20 text-purple-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  // Mock file changes data
  const fileChanges = [
    { path: 'src/components/Auth/Login.tsx', additions: 42, deletions: 12 },
    { path: 'src/services/auth.ts', additions: 78, deletions: 15 },
    { path: 'src/hooks/useAuth.ts', additions: 31, deletions: 5 },
    { path: 'src/components/Navigation.tsx', additions: 8, deletions: 3 }
  ];
  
  return (
    <div className="h-full overflow-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 border-b">
        <div className="flex items-center gap-2">
          <GitPullRequest size={20} className="text-primary" />
          <h2 className="text-xl font-bold">Pull Request #{pullRequest.id.replace('pr', '')}</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
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
            
            <Accordion type="single" collapsible className="border rounded-md">
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
                      <Card key={commitId} className="p-2">
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
                      <Card key={index} className="p-2">
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
