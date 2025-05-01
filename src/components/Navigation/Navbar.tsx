
import React from 'react';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleGitHubConnect = () => {
    // In a real app, this would redirect to GitHub OAuth flow
    toast.info("Connecting to GitHub...");
    
    // Simulate authentication process
    setTimeout(() => {
      // Show repository selection dialog after "authentication"
      navigate('/?showRepoSelector=true');
      toast.success("GitHub connected successfully! Select a repository to continue.");
    }, 1000);
  };

  return (
    <header className="border-b border-border bg-card px-4 py-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            AI Code Commander
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleGitHubConnect}
          >
            <Github size={16} />
            <span>Connect GitHub</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
