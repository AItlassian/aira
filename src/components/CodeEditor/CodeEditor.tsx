import React, { useState, useEffect } from 'react';
import RepoSelector from './RepoSelector';
import FileExplorer from './FileExplorer';
import { Editor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

interface Repository {
  name: string;
  full_name: string;
  clone_url: string;
  default_branch: string;
}

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
}

const CodeEditor: React.FC = () => {
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [fileStructure, setFileStructure] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isCloned, setIsCloned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleRepoSelect = async (repo: Repository, branch: string) => {
    setSelectedRepo(repo);
    setSelectedBranch(branch);
    setSelectedFile(null);
    setFileContent('');
    setFileStructure([]);
    setIsCloned(false);
  };

  const handleClone = async () => {
    if (!selectedRepo || !selectedBranch) {
      setError('Please select a repository and branch');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const repoFullName = selectedRepo.full_name;
      console.log('Cloning repository:', repoFullName, 'branch:', selectedBranch);
      const response = await fetch(
        `http://localhost:8000/repositories/${encodeURIComponent(repoFullName)}/clone`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ branch: selectedBranch })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to clone repository');
      }

      const data = await response.json();
      console.log('Repository contents:', data);
      setFileStructure(data);
      setIsCloned(true);
      toast.success('Repository cloned successfully');
    } catch (error) {
      console.error('Error cloning repository:', error);
      setError(error instanceof Error ? error.message : 'Failed to clone repository');
      toast.error(error instanceof Error ? error.message : 'Failed to clone repository');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (filePath: string) => {
    if (!selectedRepo || !selectedBranch) return;

    setLoading(true);
    try {
      const repoFullName = selectedRepo.full_name;
      console.log(`Fetching file content for ${filePath} in ${repoFullName} on branch ${selectedBranch}`);
      
      const response = await fetch(
        `http://localhost:8000/repositories/${encodeURIComponent(repoFullName)}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(selectedBranch)}`,
        {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('File content fetch error:', error);
        throw new Error(error.detail || 'Failed to fetch file content');
      }

      const data = await response.json();
      console.log('File content received');
      setSelectedFile(filePath);
      setFileContent(data.content);
    } catch (error) {
      console.error('Error fetching file content:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch file content');
      setSelectedFile(null);
      setFileContent('');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedRepo || !selectedBranch || !selectedFile) return;

    setIsSaving(true);
    try {
      const repoFullName = selectedRepo.full_name;
      const response = await fetch(
        `http://localhost:8000/repositories/${encodeURIComponent(repoFullName)}/contents/${encodeURIComponent(selectedFile)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            content: fileContent,
            branch: selectedBranch,
            message: `Update ${selectedFile}`
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to save file');
      }

      toast.success('File saved successfully');
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save file');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="flex h-full">
      <div className="w-64 border-r border-border">
        <div className="p-4 border-b border-border">
          <RepoSelector onRepoSelect={handleRepoSelect} />
          {selectedRepo && !isCloned && (
            <button 
              onClick={handleClone}
              className="mt-4 w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              disabled={loading}
            >
              {loading ? 'Cloning...' : 'Clone Repository'}
            </button>
          )}
        </div>
        <FileExplorer
          fileStructure={fileStructure}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          loading={loading}
        />
      </div>
      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : selectedFile ? (
          <>
            <div className="flex items-center justify-between p-2 border-b border-border">
              <span className="text-sm text-muted-foreground">{selectedFile}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="typescript"
                value={fileContent}
                onChange={(value) => setFileContent(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  renderWhitespace: 'selection',
                  tabSize: 2,
                }}
              />
        </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            {selectedRepo && !isCloned ? (
              'Click "Clone Repository" to view files'
            ) : (
              'Select a file to view its contents'
            )}
                        </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
