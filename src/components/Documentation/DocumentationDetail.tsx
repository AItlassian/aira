
import React, { useEffect, useState } from 'react';
import { documentations } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Ticket, GitPullRequest } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DocumentationDetailProps {
  docId: string;
  onClose: () => void;
  onViewTicket?: (ticketId: string) => void;
  onViewPR?: (prId: string) => void;
}

const DocumentationDetail: React.FC<DocumentationDetailProps> = ({ 
  docId, 
  onClose,
  onViewTicket,
  onViewPR
}) => {
  const [doc, setDoc] = useState(documentations.find(d => d.id === docId));

  useEffect(() => {
    // Update document if ID changes
    setDoc(documentations.find(d => d.id === docId));
  }, [docId]);

  if (!doc) {
    return (
      <div className="h-full p-4 flex flex-col items-center justify-center">
        <div className="text-lg text-muted-foreground">Documentation not found</div>
        <Button onClick={onClose} variant="outline" className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full p-4 overflow-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button onClick={onClose} variant="ghost" size="sm">
          <ArrowLeft size={16} />
          <span className="ml-1">Back</span>
        </Button>
        <h2 className="text-xl font-bold">{doc.title}</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-card border rounded-md p-6">
          <pre className="whitespace-pre-wrap font-mono text-sm bg-secondary p-4 rounded-md overflow-auto">
            {doc.content}
          </pre>
          
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date(doc.updatedAt).toLocaleDateString()}
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {doc.relatedPRs.length} PR{doc.relatedPRs.length > 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {doc.relatedPRs.map(prId => (
                <Button 
                  key={prId} 
                  variant="outline" 
                  size="icon"
                  onClick={() => onViewPR && onViewPR(prId)}
                  title={`View PR ${prId}`}
                >
                  <GitPullRequest size={16} />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationDetail;
