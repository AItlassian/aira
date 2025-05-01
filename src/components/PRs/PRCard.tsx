import React from 'react';
import { PullRequest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitPullRequest, GitCommit } from 'lucide-react';

interface PRCardProps {
  pr: PullRequest;
  onClick: () => void;
}

const PRCard: React.FC<PRCardProps> = ({ pr, onClick }) => {
  const getStatusColor = (status: PullRequest['status']) => {
    switch (status) {
      case 'open':
        return 'bg-green-500/10 text-green-500';
      case 'closed':
        return 'bg-red-500/10 text-red-500';
      case 'merged':
        return 'bg-purple-500/10 text-purple-500';
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
          <CardTitle className="text-base">{pr.title}</CardTitle>
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(pr.status)}`}>
            {pr.status}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>By {pr.author}</span>
          <span>Created {new Date(pr.createdAt).toLocaleDateString()}</span>
          <span>{pr.changedFiles.length} files changed</span>
        </div>
        
        <div className="pt-2 border-t border-border">
          <div className="text-xs font-medium mb-2">Commits</div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-secondary/80">
              <GitCommit size={12} className="mr-1" />
              {pr.commits.length}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PRCard;
