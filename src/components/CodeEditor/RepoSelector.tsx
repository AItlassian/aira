
import React, { useState } from 'react';
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
import { repositories } from '@/data/mockData';
import { GitBranch } from 'lucide-react';

const RepoSelector: React.FC = () => {
  const [selectedRepo, setSelectedRepo] = useState(repositories[0]);
  
  return (
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
        <DropdownMenuItem className="cursor-pointer">
          <span className="flex items-center text-primary">
            Connect new repository
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RepoSelector;
