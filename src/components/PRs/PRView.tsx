
import React from 'react';
import { pullRequests } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PRCard from './PRCard';

const PRView: React.FC = () => {
  return (
    <div className="h-full p-4 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Pull Requests</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search PRs..." 
              className="pl-8 h-9" 
            />
          </div>
          <Button size="sm" className="gap-1">
            <Plus size={14} />
            <span>New PR</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {pullRequests.map((pr) => (
          <PRCard key={pr.id} pullRequest={pr} />
        ))}
      </div>
    </div>
  );
};

export default PRView;
