
import React from 'react';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <header className="border-b border-border bg-card px-4 py-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            AI Code Commander
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Github size={16} />
            <span>Connect GitHub</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
