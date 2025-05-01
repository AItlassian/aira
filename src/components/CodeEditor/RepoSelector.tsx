
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { repositories } from '@/data/mockData';
import { GitBranch, Github } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const RepoSelector: React.FC = () => {
  const [selectedRepo, setSelectedRepo] = useState(repositories[0]);
  const [showRepoModal, setShowRepoModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we should show the repo selector modal based on URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('showRepoSelector') === 'true') {
      setShowRepoModal(true);
      // Clean up the URL after we've processed the parameter
      navigate('/', { replace: true });
    }
  }, [location, navigate]);
  
  const handleRepoSelect = (repo: typeof repositories[0]) => {
    setSelectedRepo(repo);
    setShowRepoModal(false);
    toast.success(`Repository ${repo.name} selected successfully!`);
  };
  
  const handleConnectNew = () => {
    toast.info("Connecting to another GitHub repository...");
    setTimeout(() => setShowRepoModal(true), 500);
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <GitBranch size={14} className="text-primary" />
            <span>{selectedRepo.name}</span>
            <span className="text-muted-foreground">/main</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Repositories</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {repositories.map((repo) => (
              <DropdownMenuItem 
                key={repo.id} 
                onClick={() => setSelectedRepo(repo)}
                className="cursor-pointer"
              >
                <span className="flex items-center">
                  {repo.name}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleConnectNew} className="cursor-pointer">
            <span className="flex items-center text-primary">
              Connect new repository
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Repository selection modal that appears after GitHub authentication */}
      <Dialog open={showRepoModal} onOpenChange={setShowRepoModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Github size={18} /> Select GitHub Repository
            </DialogTitle>
            <DialogDescription>
              Choose a repository to work with in the code editor.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {repositories.map((repo) => (
              <Button
                key={repo.id}
                variant={selectedRepo.id === repo.id ? "default" : "outline"}
                className="justify-start"
                onClick={() => handleRepoSelect(repo)}
              >
                <span className="flex items-center gap-2">
                  <GitBranch size={14} />
                  {repo.name}
                  <span className="text-xs text-muted-foreground ml-2">
                    Last updated {new Date(repo.updatedAt).toLocaleDateString()}
                  </span>
                </span>
              </Button>
            ))}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowRepoModal(false)} variant="outline">Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RepoSelector;
