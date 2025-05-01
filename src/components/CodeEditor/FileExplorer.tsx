import React from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

interface FileExplorerProps {
  fileStructure: FileNode[];
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
  loading: boolean;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  fileStructure,
  selectedFile,
  onFileSelect,
  loading,
}) => {
  const [expandedDirs, setExpandedDirs] = React.useState<Set<string>>(new Set());

  const toggleDir = (path: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedDirs(newExpanded);
  };

  const renderNode = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedDirs.has(node.path);
    const isSelected = selectedFile === node.path;

    if (node.type === 'directory') {
      return (
        <div key={node.path}>
          <div
            className={cn(
              'flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-muted/50',
              isSelected && 'bg-muted'
            )}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
            onClick={() => toggleDir(node.path)}
          >
            {isExpanded ? (
              <ChevronDown size={14} className="text-muted-foreground" />
            ) : (
              <ChevronRight size={14} className="text-muted-foreground" />
            )}
            <Folder size={14} className="text-blue-500" />
            <span className="text-sm">{node.name}</span>
          </div>
          {isExpanded && node.children?.map((child) => renderNode(child, level + 1))}
        </div>
      );
    }

    return (
      <div
        key={node.path}
        className={cn(
          'flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-muted/50',
          isSelected && 'bg-muted'
        )}
        style={{ paddingLeft: `${level * 12 + 24}px` }}
        onClick={() => onFileSelect(node.path)}
      >
        <File size={14} className="text-muted-foreground" />
        <span className="text-sm">{node.name}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      {fileStructure.map((node) => renderNode(node))}
    </div>
  );
};

export default FileExplorer; 