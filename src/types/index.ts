export interface Repository {
  id: string;
  name: string;
  owner: string;
  description: string;
  updatedAt: string;
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
  updatedAt: string;
  repo: string;
  branch: string;
  commits: {
    id: string;
    message: string;
    author: string;
    date: string;
  }[];
  changedFiles: {
    path: string;
    additions: number;
    deletions: number;
  }[];
  relatedTickets?: string[];
  relatedDocs?: string[];
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
    status: 'todo' | 'in-progress' | 'review' | 'done';
    commitId?: string;
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