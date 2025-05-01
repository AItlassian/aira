import React from 'react';
import { Documentation } from '@/types';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft } from 'lucide-react';

interface DocumentationDetailProps {
  documentation: Documentation;
  onClose: () => void;
}

const DocumentationDetail: React.FC<DocumentationDetailProps> = ({ 
  documentation, 
  onClose 
}) => {
  const handleBackToDocs = () => {
    window.location.hash = '/docs';
    onClose();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 border-b">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToDocs} 
            className="gap-1"
          >
            <ChevronLeft size={16} />
            <span>All Documentation</span>
          </Button>
          <div className="ml-4">
            <h2 className="text-xl font-bold">{documentation.title}</h2>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Card>
          <CardHeader>
            <CardDescription>
              Last updated {new Date(documentation.updatedAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {documentation.content}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentationDetail;
