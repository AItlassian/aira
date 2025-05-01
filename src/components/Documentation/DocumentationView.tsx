
import React, { useState } from 'react';
import { documentations } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Plus, FileText, GitPullRequest } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DocumentationDetail from './DocumentationDetail';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DocumentationView: React.FC = () => {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  
  // Check if there's a documentation ID in the URL hash
  React.useEffect(() => {
    const hashPath = window.location.hash;
    if (hashPath.startsWith('#/docs/')) {
      const docId = hashPath.replace('#/docs/', '');
      if (documentations.some(d => d.id === docId)) {
        setSelectedDocId(docId);
      }
    }
    
    // Add hash change listener to handle navigation
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/docs/')) {
        const docId = hash.replace('#/docs/', '');
        if (documentations.some(d => d.id === docId)) {
          setSelectedDocId(docId);
        }
      } else if (hash === '#/docs') {
        setSelectedDocId(null);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  const handleDocClick = (docId: string) => {
    setSelectedDocId(docId);
    window.location.hash = `/docs/${docId}`;
  };
  
  const handleCloseDetail = () => {
    setSelectedDocId(null);
    window.location.hash = '/docs';
  };
  
  const handleViewPR = (prId: string) => {
    // Navigate to PR detail view with a reference back to this doc
    window.location.hash = `/prs/${prId}?fromDoc=${selectedDocId}`;
  };
  
  // If a documentation is selected, show its detail view
  if (selectedDocId) {
    return (
      <DocumentationDetail 
        docId={selectedDocId}
        onClose={handleCloseDetail}
        onViewPR={handleViewPR}
      />
    );
  }
  
  // Otherwise, show the documentation list
  return (
    <div className="h-full p-4 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Documentation</h2>
        <div className="flex gap-2">
          <Button size="sm" className="gap-1">
            <Plus size={14} />
            <span>Generate Documentation</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentations.map((doc) => (
          <Card 
            key={doc.id} 
            className="transition-all hover:shadow-md cursor-pointer"
            onClick={() => handleDocClick(doc.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                <CardTitle className="text-base">{doc.title}</CardTitle>
              </div>
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date(doc.updatedAt).toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm mb-3 max-h-40 overflow-hidden">
                <pre className="whitespace-pre-wrap font-mono text-xs bg-secondary p-3 rounded-md overflow-auto">
                  {doc.content.substring(0, 250)}
                  {doc.content.length > 250 && '...'}
                </pre>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {doc.relatedPRs.length} PR{doc.relatedPRs.length > 1 ? 's' : ''}
                </Badge>
                <TooltipProvider>
                  <div className="flex gap-1">
                    {doc.relatedPRs.map(prId => (
                      <Tooltip key={prId}>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="bg-primary/10 hover:bg-primary/20"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              handleViewPR(prId);
                            }}
                          >
                            <GitPullRequest size={16} className="text-primary" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View PR {prId.replace('pr', '')}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentationView;
