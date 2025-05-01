import React, { useState, useEffect } from 'react';
import { Documentation } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DocumentationDetail from './DocumentationDetail';
import { useToast } from '@/components/ui/use-toast';

interface DocumentationViewProps {
  selectedRepo?: string;
}

const DocumentationView: React.FC<DocumentationViewProps> = ({ selectedRepo }) => {
  const [documentations, setDocumentations] = useState<Documentation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDocumentations = async () => {
      if (!selectedRepo) {
        setDocumentations([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/repositories/${selectedRepo}/docs`, {
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to fetch documentation');
        }

        const data = await response.json();
        setDocumentations(data);
      } catch (error) {
        console.error('Error fetching documentation:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch documentation');
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch documentation. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentations();
  }, [selectedRepo, toast]);

  // Check if there's a documentation ID in the URL hash
  useEffect(() => {
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
  }, [documentations]);
  
  const handleDocClick = (docId: string) => {
    setSelectedDocId(docId);
    window.location.hash = `/docs/${docId}`;
  };
  
  const handleCloseDetail = () => {
    setSelectedDocId(null);
    window.location.hash = '/docs';
  };
  
  // If a documentation is selected, show its detail view
  if (selectedDocId) {
    const selectedDoc = documentations.find(doc => doc.id === selectedDocId);
    if (!selectedDoc) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Documentation not found</h3>
            <Button onClick={handleCloseDetail} variant="outline" className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <DocumentationDetail
        documentation={selectedDoc}
        onClose={handleCloseDetail}
      />
    );
  }
  
  if (!selectedRepo) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Select a repository to view documentation</p>
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
          <FileText className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Documentation</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }
  
  // Otherwise, show the documentation list
  return (
    <div className="h-full p-4 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Documentation</h2>
        <Button size="sm" className="gap-1">
          <Plus size={14} />
          <span>New Documentation</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        {documentations.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No documentation found</h3>
            <p className="text-muted-foreground">Create new documentation to get started</p>
          </div>
        ) : (
          documentations.map((doc) => (
            <Card 
              key={doc.id} 
              className="hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => handleDocClick(doc.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{doc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Last updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentationView;
