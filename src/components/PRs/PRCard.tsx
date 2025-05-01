
import React from 'react';
import { PullRequest } from '@/data/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitPullRequest, GitCommit } from 'lucide-react';

interface PRCardProps {
  pullRequest: PullRequest;
  onClick: () => void;
}

const PRCard: React.FC<PRCardProps> = ({ pullRequest, onClick }) => {
  const getStatusColor = () => {
    switch(pullRequest.status) {
      case 'open': return 'bg-green-500/20 text-green-500';
      case 'closed': return 'bg-red-500/20 text-red-500';
      case 'merged': return 'bg-purple-500/20 text-purple-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  return (
    <Card 
      className="transition-all hover:shadow-md cursor-pointer hover:bg-accent/10" 
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <GitPullRequest size={18} className="text-primary" />
          <CardTitle className="text-base flex-1">{pullRequest.title}</CardTitle>
          <Badge className={getStatusColor()}>
            {pullRequest.status}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(pullRequest.createdAt).toLocaleDateString()} • {pullRequest.author}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm mb-4">
          {pullRequest.description}
        </p>
        
        {pullRequest.aiSummary && (
          <div className="mb-4 p-3 bg-primary/5 rounded-md border border-primary/20">
            <Badge variant="outline" className="mb-2 bg-primary/10">AI Summary</Badge>
            <p className="text-sm">{pullRequest.aiSummary}</p>
          </div>
        )}
        
        <div className="pt-2 border-t border-border">
          <div className="text-xs font-medium mb-2">Commits</div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-secondary/80">
              <GitCommit size={12} className="mr-1" />
              {pullRequest.commits.length}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PRCard;
