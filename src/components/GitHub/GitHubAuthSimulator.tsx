
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { toast } from 'sonner';

const GitHubAuthSimulator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading of GitHub OAuth screen
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleAuthorize = () => {
    setLoading(true);
    toast.info("Authorizing with GitHub...");
    
    // Simulate authorization process
    setTimeout(() => {
      navigate('/?showRepoSelector=true');
      toast.success("GitHub connected successfully! Select a repository to continue.");
    }, 1000);
  };
  
  const handleCancel = () => {
    navigate('/');
    toast.error("GitHub connection cancelled.");
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] bg-muted/30">
      <div className="w-full max-w-md p-6 space-y-6 bg-card border rounded-lg shadow-lg">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Github size={48} className="text-black dark:text-white" />
          <h1 className="text-2xl font-bold">Authorize AI Code Commander</h1>
          
          {loading ? (
            <div className="space-y-4">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
              <p>Connecting to GitHub...</p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground">
                AI Code Commander is requesting permission to access your GitHub repositories.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-md w-full text-left">
                <p className="font-medium">This application will be able to:</p>
                <ul className="mt-2 space-y-2 text-sm list-disc list-inside">
                  <li>Read your repositories and organization memberships</li>
                  <li>Read and write code, commits, and pull requests</li>
                  <li>Create and manage repository webhooks</li>
                </ul>
              </div>
              
              <div className="flex flex-col gap-2 w-full">
                <Button 
                  onClick={handleAuthorize}
                  className="w-full flex items-center gap-2"
                >
                  <Github size={16} />
                  Authorize AI Code Commander
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubAuthSimulator;
