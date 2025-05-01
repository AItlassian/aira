
import React from 'react';
import { documentations } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DocumentationView: React.FC = () => {
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
          <Card key={doc.id} className="transition-all hover:shadow-md">
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
                <Button variant="ghost" size="sm">View Full</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentationView;
