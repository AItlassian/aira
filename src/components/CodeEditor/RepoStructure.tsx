
import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Sample repository structure
const repoStructure = {
  'src': {
    type: 'folder',
    children: {
      'components': {
        type: 'folder',
        children: {
          'AppLayout.tsx': { type: 'file' },
          'Button.tsx': { type: 'file' },
          'Login.tsx': { type: 'file' },
          'util.ts': { type: 'file' },
        },
      },
      'pages': {
        type: 'folder',
        children: {
          'Home.tsx': { type: 'file' },
          'Profile.tsx': { type: 'file' },
          'Settings.tsx': { type: 'file' },
        },
      },
      'hooks': {
        type: 'folder',
        children: {
          'useAuth.ts': { type: 'file' },
          'useFetch.ts': { type: 'file' },
        },
      },
      'App.tsx': { type: 'file' },
      'index.tsx': { type: 'file' },
    },
  },
  'public': {
    type: 'folder',
    children: {
      'index.html': { type: 'file' },
      'favicon.ico': { type: 'file' },
    },
  },
  'package.json': { type: 'file' },
  'README.md': { type: 'file' },
  'tsconfig.json': { type: 'file' },
};

interface FileSystemItem {
  type: 'file' | 'folder';
  children?: Record<string, FileSystemItem>;
}

interface FileTreeProps {
  structure: Record<string, FileSystemItem>;
  level?: number;
}

const FileTree: React.FC<FileTreeProps> = ({ structure, level = 0 }) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'src': true,
    'src/components': true,
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const renderItems = (items: Record<string, FileSystemItem>, currentPath = '') => {
    return Object.entries(items).map(([name, item]) => {
      const path = currentPath ? `${currentPath}/${name}` : name;
      const isExpanded = expandedFolders[path] || false;
      
      if (item.type === 'folder') {
        return (
          <div key={path}>
            <div 
              className="flex items-center py-1 px-2 hover:bg-muted cursor-pointer"
              style={{ paddingLeft: `${(level + 1) * 8}px` }}
              onClick={() => toggleFolder(path)}
            >
              {isExpanded ? (
                <ChevronDown size={16} className="mr-1 text-muted-foreground" />
              ) : (
                <ChevronRight size={16} className="mr-1 text-muted-foreground" />
              )}
              <Folder size={16} className="mr-1 text-blue-500" />
              <span className="text-sm">{name}</span>
            </div>
            {isExpanded && item.children && (
              <div className="ml-4">
                <FileTree 
                  structure={item.children} 
                  level={level + 1} 
                />
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div 
            key={path}
            className="flex items-center py-1 px-2 hover:bg-muted cursor-pointer"
            style={{ paddingLeft: `${(level + 1) * 16}px` }}
          >
            <File size={16} className="mr-1 text-muted-foreground" />
            <span className="text-sm">{name}</span>
          </div>
        );
      }
    });
  };

  return <>{renderItems(structure)}</>;
};

const RepoStructure: React.FC = () => {
  return (
    <div className="w-64 border-r border-border bg-card">
      <div className="p-2 border-b border-border">
        <h3 className="text-sm font-medium">Repository Files</h3>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="p-2">
          <FileTree structure={repoStructure} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default RepoStructure;
