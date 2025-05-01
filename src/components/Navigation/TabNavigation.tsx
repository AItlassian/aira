
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, GitPullRequest, BookText, MessageSquare } from 'lucide-react';

const tabs = [
  { id: 'code', label: 'Code', icon: Code },
  { id: 'prs', label: 'Pull Requests', icon: GitPullRequest },
  { id: 'tickets', label: 'Tickets', icon: MessageSquare },
  { id: 'docs', label: 'Documentation', icon: BookText },
];

interface TabNavigationProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  defaultValue = 'code',
  onChange 
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onChange) {
      onChange(value);
    }
  };
  
  return (
    <div className="border-b border-border bg-card px-4 py-1">
      <Tabs 
        defaultValue={activeTab} 
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid grid-cols-4 max-w-md">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex items-center gap-2"
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TabNavigation;
