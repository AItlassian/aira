import React, { useState } from 'react';
import { sampleCode } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import CommitPanel from './CommitPanel';
import RepoSelector from './RepoSelector';
import RepoStructure from './RepoStructure';

interface FileTab {
  path: string;
  content: string[];
}

const CodeEditor: React.FC = () => {
  // Sample content for files - in a real app, this would come from an API
  const fileContents: Record<string, string[]> = {
    'src/components/Login.tsx': sampleCode.split('\n'),
    'src/App.tsx': ['import React from "react";', '', 'const App = () => {', '  return <div>App Component</div>;', '};', '', 'export default App;'],
    'src/components/Button.tsx': ['import React from "react";', '', 'const Button = ({ children }) => {', '  return <button className="px-4 py-2 bg-blue-500 text-white rounded">{children}</button>;', '};', '', 'export default Button;'],
    'src/index.tsx': ['import React from "react";', 'import ReactDOM from "react-dom";', 'import App from "./App";', '', 'ReactDOM.render(<App />, document.getElementById("root"));'],
  };

  const [openTabs, setOpenTabs] = useState<FileTab[]>([
    { path: 'src/components/Login.tsx', content: fileContents['src/components/Login.tsx'] }
  ]);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [showRepoStructure, setShowRepoStructure] = useState<boolean>(true);
  
  const handleFileSelect = (filePath: string) => {
    // Check if the file is already open in a tab
    const existingTabIndex = openTabs.findIndex(tab => tab.path === filePath);
    
    if (existingTabIndex >= 0) {
      // If the file is already open, just switch to that tab
      setActiveTabIndex(existingTabIndex);
    } else {
      // Otherwise, open a new tab with this file
      const newTab: FileTab = {
        path: filePath,
        content: fileContents[filePath] || ['// File content not available']
      };
      setOpenTabs([...openTabs, newTab]);
      setActiveTabIndex(openTabs.length);
    }
  };

  const handleTabClose = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering tab selection
    
    // Remove the tab
    const newTabs = [...openTabs];
    newTabs.splice(index, 1);
    
    // Update the active tab index
    if (activeTabIndex >= index && activeTabIndex > 0) {
      setActiveTabIndex(activeTabIndex - 1);
    } else if (newTabs.length === 0) {
      // If all tabs are closed, open a default file
      setOpenTabs([{ path: 'src/components/Login.tsx', content: fileContents['src/components/Login.tsx'] }]);
      setActiveTabIndex(0);
    }
    
    if (newTabs.length > 0) {
      setOpenTabs(newTabs);
    }
  };
  
  const activeTab = openTabs[activeTabIndex] || openTabs[0];
  const activeLine = 5; // Example default active line
  
  return (
    <div className="flex h-full">
      {showRepoStructure && (
        <>
          <RepoStructure onFileSelect={handleFileSelect} activeFilePath={activeTab?.path} />
          <Separator orientation="vertical" />
        </>
      )}
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between p-2 border-b border-border">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowRepoStructure(!showRepoStructure)}
              className="text-muted-foreground hover:text-foreground text-xs px-2 py-1 rounded border border-border"
            >
              {showRepoStructure ? 'Hide Files' : 'Show Files'}
            </button>
            <RepoSelector />
          </div>
        </div>
        
        <div className="flex overflow-x-auto border-b border-border">
          {openTabs.map((tab, index) => (
            <div 
              key={tab.path} 
              className={`flex items-center px-3 py-2 cursor-pointer border-r border-border ${
                index === activeTabIndex ? 'bg-background text-foreground' : 'bg-muted text-muted-foreground'
              }`}
              onClick={() => setActiveTabIndex(index)}
            >
              <span className="text-sm truncate max-w-[150px]">{tab.path.split('/').pop()}</span>
              <button
                className="ml-2 p-1 rounded-full hover:bg-muted-foreground/20"
                onClick={(e) => handleTabClose(index, e)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          <Card className="flex-1 overflow-hidden border-0 rounded-none">
            <CardContent className="p-0 h-full overflow-hidden flex">
              <div className="flex flex-col w-full h-full">
                <div className="flex-1 overflow-auto">
                  <pre className="code-editor w-full h-full p-0 m-0">
                    <code>
                      {activeTab.content.map((line, index) => (
                        <div 
                          key={index}
                          className={`flex ${index === activeLine ? 'code-editor-active-line' : 'code-editor-line'}`}
                        >
                          <span className="code-editor-line-number">{index + 1}</span>
                          <span className="px-2">{line}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
          <Separator orientation="vertical" />
          <CommitPanel />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
