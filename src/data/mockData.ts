
export interface Repository {
  id: string;
  name: string;
  owner: string;
  description: string;
}

export interface Commit {
  id: string;
  message: string;
  author: string;
  date: string;
  files: string[];
  aiSummary?: string;
}

export interface PullRequest {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  status: 'open' | 'closed' | 'merged';
  commits: string[];
  aiSummary?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  relatedPRs: string[];
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface Documentation {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  relatedPRs: string[];
}

export const repositories: Repository[] = [
  {
    id: '1',
    name: 'ai-code-commander',
    owner: 'user',
    description: 'AI-powered project management tool'
  },
  {
    id: '2',
    name: 'react-component-library',
    owner: 'user',
    description: 'Reusable React components'
  },
  {
    id: '3',
    name: 'node-api-server',
    owner: 'user',
    description: 'API server built with Node.js'
  }
];

export const commits: Commit[] = [
  {
    id: 'c1',
    message: 'Add authentication service',
    author: 'user',
    date: '2025-04-30T14:32:00Z',
    files: ['src/services/auth.ts', 'src/components/Login.tsx'],
    aiSummary: 'Implemented OAuth2 authentication service with Google and GitHub providers. Added login UI components.'
  },
  {
    id: 'c2',
    message: 'Fix navigation bug',
    author: 'user',
    date: '2025-04-29T09:15:00Z',
    files: ['src/components/Navigation.tsx'],
    aiSummary: 'Fixed routing issue when navigating from profile to dashboard. Improved state management for active routes.'
  }
];

export const pullRequests: PullRequest[] = [
  {
    id: 'pr1',
    title: 'Feature: User Authentication',
    description: 'Adds authentication flow with multiple providers',
    author: 'user',
    createdAt: '2025-04-30T15:00:00Z',
    status: 'open',
    commits: ['c1'],
    aiSummary: 'This PR implements a complete authentication system using OAuth2 with Google and GitHub providers. It includes login UI components, token management, and protected routes.'
  },
  {
    id: 'pr2',
    title: 'Fix: Navigation Issues',
    description: 'Resolves bugs in the navigation system',
    author: 'user',
    createdAt: '2025-04-29T10:00:00Z',
    status: 'merged',
    commits: ['c2'],
    aiSummary: 'This PR fixes a critical navigation bug that was causing state inconsistencies when moving between routes. It improves the route management system and adds better state handling.'
  }
];

export const tickets: Ticket[] = [
  {
    id: 't1',
    title: 'Implement authentication system',
    description: 'Create authentication service and related components',
    status: 'in-progress',
    priority: 'high',
    assignee: 'user',
    createdAt: '2025-04-28T09:00:00Z',
    updatedAt: '2025-04-30T15:00:00Z',
    relatedPRs: ['pr1'],
    subtasks: [
      { id: 'st1', title: 'Set up OAuth providers', completed: true },
      { id: 'st2', title: 'Create login UI', completed: true },
      { id: 'st3', title: 'Implement token management', completed: false },
      { id: 'st4', title: 'Add protected routes', completed: false }
    ]
  },
  {
    id: 't2',
    title: 'Fix navigation bugs',
    description: 'Resolve issues with the navigation system',
    status: 'done',
    priority: 'medium',
    assignee: 'user',
    createdAt: '2025-04-29T08:00:00Z',
    updatedAt: '2025-04-29T10:00:00Z',
    relatedPRs: ['pr2'],
    subtasks: [
      { id: 'st5', title: 'Identify source of route state inconsistency', completed: true },
      { id: 'st6', title: 'Fix state management in navigation component', completed: true }
    ]
  }
];

export const documentations: Documentation[] = [
  {
    id: 'd1',
    title: 'Authentication System',
    content: `# Authentication System
    
## Overview
This module handles user authentication using OAuth2 providers.

## Components
- AuthService: Manages authentication flow
- LoginComponent: UI for user login
- ProtectedRoute: HOC for route protection

## Usage
\`\`\`typescript
import { AuthService } from './services/auth';

// Initialize authentication
const auth = new AuthService();
auth.login(provider);
\`\`\`
    `,
    createdAt: '2025-04-30T16:00:00Z',
    updatedAt: '2025-04-30T16:00:00Z',
    relatedPRs: ['pr1']
  }
];

// Sample code editor content
export const sampleCode = `import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/auth';

interface LoginProps {
  onSuccess: (user: User) => void;
  onError: (error: Error) => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      const authService = new AuthService();
      const user = await authService.login(provider);
      onSuccess(user);
    } catch (error) {
      onError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      <div className="provider-buttons">
        <button 
          onClick={() => handleLogin('google')} 
          disabled={isLoading}
        >
          Login with Google
        </button>
        <button 
          onClick={() => handleLogin('github')} 
          disabled={isLoading}
        >
          Login with GitHub
        </button>
      </div>
    </div>
  );
};`;
