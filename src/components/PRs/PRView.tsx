import React, { useState, useEffect } from 'react';
import { PullRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, GitPullRequest } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface PRViewProps {
  selectedRepo?: string;
}

const PRView: React.FC<PRViewProps> = ({ selectedRepo }) => {
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPullRequests = async () => {
      if (!selectedRepo) {
        setPullRequests([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/repositories/${selectedRepo}/pulls`, {
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to fetch pull requests');
        }

        const data = await response.json();
        setPullRequests(data);
      } catch (error) {
        console.error('Error fetching pull requests:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch pull requests');
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch pull requests. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPullRequests();
  }, [selectedRepo, toast]);

  const handlePRClick = (prId: string) => {
    window.location.hash = `/prs/${prId}`;
  };

  if (!selectedRepo) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Select a repository to view pull requests</p>
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
          <GitPullRequest className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Pull Requests</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Pull Requests</h2>
        <Button size="sm" className="gap-1">
          <Plus size={14} />
          <span>New Pull Request</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        {pullRequests.length === 0 ? (
          <div className="text-center py-8">
            <GitPullRequest className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No pull requests found</h3>
            <p className="text-muted-foreground">Create a new pull request to get started</p>
          </div>
        ) : (
          pullRequests.map((pr) => (
            <Card 
              key={pr.id} 
              className="hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => handlePRClick(pr.id)}
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
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

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

export default PRView;
