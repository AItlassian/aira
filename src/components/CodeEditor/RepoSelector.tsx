import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Repository {
  name: string;
  full_name: string;
  clone_url: string;
  default_branch: string;
}

interface RepoSelectorProps {
  onRepoSelect: (repo: Repository, branch: string) => void;
}

const RepoSelector: React.FC<RepoSelectorProps> = ({ onRepoSelect }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRepositories = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/repositories', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      toast.error('Failed to fetch repositories');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async (repoName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/repositories/${encodeURIComponent(repoName)}/branches`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch branches');
      }
      const data = await response.json();
      setBranches(data.map((branch: any) => branch.name));
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast.error('Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshBranches = async () => {
    if (!selectedRepo) return;
    setRefreshing(true);
    try {
      await fetchBranches(selectedRepo);
      toast.success('Branches refreshed');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  const handleRepoChange = (value: string) => {
    setSelectedRepo(value);
    setSelectedBranch('');
    setBranches([]);
    if (value) {
      fetchBranches(value);
    }
  };

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    if (value && selectedRepo) {
      const repo = repositories.find(r => r.full_name === selectedRepo);
      if (repo) {
        onRepoSelect(repo, value);
      }
    }
  };

  const handleConnectNew = () => {
    window.location.href = 'http://localhost:8000/login';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Repository</h2>
        <Button variant="outline" size="sm" onClick={handleConnectNew}>
          Connect GitHub
        </Button>
      </div>
      
      <Select value={selectedRepo} onValueChange={handleRepoChange} disabled={loading}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a repository" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {repositories.map((repo) => (
            <SelectItem key={repo.full_name} value={repo.full_name}>
              {repo.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedRepo && (
        <div className="flex gap-2">
          <div className="flex-1">
            <Select value={selectedBranch} onValueChange={handleBranchChange} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a branch" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefreshBranches}
            disabled={!selectedRepo || refreshing}
            className={refreshing ? 'animate-spin' : ''}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default RepoSelector;
