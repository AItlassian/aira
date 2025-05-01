
import React, { useState } from 'react';
import { sampleCode } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import CommitPanel from './CommitPanel';
import RepoSelector from './RepoSelector';
import RepoStructure from './RepoStructure';

const CodeEditor: React.FC = () => {
  const [codeLines] = useState<string[]>(sampleCode.split('\n'));
  const [activeLine, setActiveLine] = useState<number>(5);
  const [showRepoStructure, setShowRepoStructure] = useState<boolean>(true);
  
  return (
    <div className="flex h-full">
      {showRepoStructure && (
        <>
          <RepoStructure />
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
          <div className="text-sm text-muted-foreground">src/components/Login.tsx</div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          <Card className="flex-1 overflow-hidden border-0 rounded-none">
            <CardContent className="p-0 h-full overflow-hidden flex">
              <div className="flex flex-col w-full h-full">
                <div className="flex-1 overflow-auto">
                  <pre className="code-editor w-full h-full p-0 m-0">
                    <code>
                      {codeLines.map((line, index) => (
                        <div 
                          key={index}
                          className={`flex ${index === activeLine ? 'code-editor-active-line' : 'code-editor-line'}`}
                          onClick={() => setActiveLine(index)}
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
