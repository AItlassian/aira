
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, GitCommit, GitPullRequest } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";

const CommitPanel: React.FC = () => {
  const [message, setMessage] = useState('');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [isCommitting, setIsCommitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([
    'src/components/Login.tsx'
  ]);
  
  const { toast } = useToast();
  
  const handleCommit = () => {
    setIsCommitting(true);
    // Simulate commit process
    setTimeout(() => {
      setIsCommitting(false);
      setMessage('');
      toast({
        title: "Changes committed",
        description: aiEnabled ? "AI has enhanced your commit message and added documentation" : "Commit successful",
      });
    }, 1500);
  };
  
  const handleCreatePR = () => {
    toast({
      title: "Pull request created",
      description: "AI has generated a PR summary based on your changes",
    });
  };
  
  return (
    <Card className="w-80 border-0 rounded-none">
      <CardHeader className="border-b border-border p-3">
        <CardTitle className="text-sm font-medium">Commit Changes</CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex flex-col h-[calc(100%-3rem)] overflow-auto">
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Changed Files</h3>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                <span className="text-xs truncate">{file}</span>
                <Check size={14} className="text-green-500" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="commit-message" className="text-sm font-medium">Commit Message</Label>
          <Textarea
            id="commit-message"
            placeholder="Add a commit message..."
            className="mt-1 resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <Switch 
            id="ai-assist" 
            checked={aiEnabled} 
            onCheckedChange={setAiEnabled} 
          />
          <Label htmlFor="ai-assist" className="text-sm">AI Documentation & Commit Message</Label>
        </div>
        
        {aiEnabled && (
          <div className="mb-4 p-2 bg-secondary/50 rounded-md">
            <Badge variant="outline" className="mb-1 bg-primary/10">AI Assisted</Badge>
            <p className="text-xs text-muted-foreground">
              AI will enhance your commit message and generate documentation automatically.
            </p>
          </div>
        )}
        
        <div className="mt-auto space-y-2">
          <Button 
            className="w-full flex items-center gap-2" 
            onClick={handleCommit}
            disabled={isCommitting || !message}
          >
            <GitCommit size={14} />
            <span>{isCommitting ? 'Committing...' : 'Commit Changes'}</span>
          </Button>
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2"
            onClick={handleCreatePR}
          >
            <GitPullRequest size={14} />
            <span>Create Pull Request</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommitPanel;
