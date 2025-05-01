import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Code2, GitBranch } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CodeViewProps {
  selectedRepo?: string;
}

interface Branch {
  name: string;
  commit: string;
}

const CodeView: React.FC<CodeViewProps> = ({ selectedRepo }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchBranches = async () => {
      if (!selectedRepo) {
        setBranches([]);
        setSelectedBranch('');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/repositories/${selectedRepo}/branches`, {
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to fetch branches');
        }

        const data = await response.json();
        setBranches(data);
        if (data.length > 0) {
          setSelectedBranch(data[0].name);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch branches');
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch branches. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [selectedRepo, toast]);

  if (!selectedRepo) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Select a repository to view code</p>
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
          <Code2 className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Code</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Code</h2>
          <div className="flex items-center gap-2">
            <GitBranch size={16} className="text-muted-foreground" />
            <Select 
              value={selectedBranch} 
              onValueChange={(value) => {
                console.log('Selected branch:', value);
                setSelectedBranch(value);
              }}
            >
              <SelectTrigger className="w-[200px] h-8">
                <SelectValue>
                  {selectedBranch ? (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedBranch}</span>
                      <span className="text-muted-foreground text-sm">
                        {branches.find(b => b.name === selectedBranch)?.commit.substring(0, 7)}
                      </span>
                    </div>
                  ) : (
                    "Select branch"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem 
                    key={branch.name} 
                    value={branch.name}
                    className="pl-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{branch.name}</span>
                      <span className="text-muted-foreground text-sm">
                        {branch.commit.substring(0, 7)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button size="sm" className="gap-1">
          <Plus size={14} />
          <span>New File</span>
        </Button>
      </div>
      
      <div className="text-center py-8">
        <Code2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Code View Coming Soon</h3>
        <p className="text-muted-foreground">The code view feature is under development</p>
      </div>
    </div>
  );
};

export default CodeView; 