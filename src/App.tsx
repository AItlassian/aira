import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Repository } from '@/types';
import CodeView from '@/components/Code/CodeView';
import PRsView from '@/components/PRs/PRsView';
import TicketsView from '@/components/Tickets/TicketsView';
import DocumentationView from '@/components/Documentation/DocumentationView';
import { Code2, GitPullRequest, Ticket, FileText } from 'lucide-react';

function App() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch('http://localhost:8000/repositories', {
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to fetch repositories');
        }

        const data = await response.json();
        setRepositories(data);
        if (data.length > 0) {
          setSelectedRepo(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching repositories:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch repositories. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [toast]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const selectedRepository = repositories.find(repo => repo.id === selectedRepo);

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <h1 className="text-2xl font-bold">AIRA</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Repository:</span>
              <Select 
                value={selectedRepo} 
                onValueChange={(value) => {
                  console.log('Selected repo:', value);
                  setSelectedRepo(value);
                }}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue>
                    {selectedRepository ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{selectedRepository.name}</span>
                        <span className="text-muted-foreground text-sm">
                          {selectedRepository.owner}
                        </span>
                      </div>
                    ) : (
                      "Select a repository"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {repositories.map((repo) => (
                    <SelectItem 
                      key={repo.id} 
                      value={repo.id}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{repo.name}</span>
                        <span className="text-muted-foreground text-sm">
                          {repo.owner}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="code" className="h-full">
          <div className="border-b">
            <div className="max-w-7xl mx-auto px-4">
              <TabsList className="h-12">
                <TabsTrigger value="code" className="gap-2">
                  <Code2 size={16} />
                  <span>Code</span>
                </TabsTrigger>
                <TabsTrigger value="prs" className="gap-2">
                  <GitPullRequest size={16} />
                  <span>Pull Requests</span>
                </TabsTrigger>
                <TabsTrigger value="tickets" className="gap-2">
                  <Ticket size={16} />
                  <span>Tickets</span>
                </TabsTrigger>
                <TabsTrigger value="docs" className="gap-2">
                  <FileText size={16} />
                  <span>Documentation</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="h-[calc(100%-48px)]">
            <TabsContent value="code" className="h-full m-0">
              <CodeView selectedRepo={selectedRepo} />
            </TabsContent>
            <TabsContent value="prs" className="h-full m-0">
              <PRsView selectedRepo={selectedRepo} />
            </TabsContent>
            <TabsContent value="tickets" className="h-full m-0">
              <TicketsView selectedRepo={selectedRepo} />
            </TabsContent>
            <TabsContent value="docs" className="h-full m-0">
              <DocumentationView selectedRepo={selectedRepo} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
