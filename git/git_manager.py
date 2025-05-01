from git import Repo
from langchain.chat_models import AzureChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import StrOutputParser
from langgraph.graph import StateGraph, END
from typing import List, Dict, Any
import os
import tempfile
import shutil

class GitManager:
    def __init__(self):
        self.llm = AzureChatOpenAI(
            azure_deployment=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
            openai_api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            api_key=os.getenv("AZURE_OPENAI_API_KEY")
        )
        self.temp_dir = os.path.join(os.getcwd(), 'temp_repos')
        os.makedirs(self.temp_dir, exist_ok=True)

    def clone_repo(self, repo_url: str, branch: str) -> str:
        """Clone a repository to a temporary directory."""
        try:
            # Create a temporary directory
            temp_dir = tempfile.mkdtemp(dir=self.temp_dir)
            
            # Clone the repository
            print(f"Cloning {repo_url} to {temp_dir}")
            repo = Repo.clone_from(repo_url, temp_dir)
            
            # Checkout the specified branch
            if branch:
                print(f"Checking out branch {branch}")
                repo.git.checkout(branch)
            
            return temp_dir
        except Exception as e:
            # Clean up on error
            shutil.rmtree(temp_dir, ignore_errors=True)
            raise e

    def analyze_commits(self, commits: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Analyze commits using LangGraph to group related commits."""
        
        # Define the state type
        class CommitState:
            def __init__(self):
                self.commits = commits
                self.groups = []
                self.current_group = []
                self.current_summary = ""

        # Define the nodes
        def analyze_commit(state: CommitState) -> CommitState:
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are an expert at analyzing git commits and determining if they are related."),
                ("user", "Analyze these commits and determine if they are related: {commits}")
            ])
            
            chain = prompt | self.llm | StrOutputParser()
            result = chain.invoke({"commits": state.current_group})
            
            if "related" in result.lower():
                state.groups.append(state.current_group)
                state.current_group = []
            
            return state

        def summarize_group(state: CommitState) -> CommitState:
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are an expert at summarizing git commits."),
                ("user", "Summarize these related commits into a single commit message: {commits}")
            ])
            
            chain = prompt | self.llm | StrOutputParser()
            summary = chain.invoke({"commits": state.current_group})
            state.current_summary = summary
            
            return state

        # Create the graph
        workflow = StateGraph(CommitState)
        
        # Add nodes
        workflow.add_node("analyze", analyze_commit)
        workflow.add_node("summarize", summarize_group)
        
        # Add edges
        workflow.add_edge("analyze", "summarize")
        workflow.add_edge("summarize", END)
        
        # Compile the graph
        app = workflow.compile()
        
        # Run the graph
        result = app.invoke(CommitState())
        return result.groups

    def create_commit(self, repo_path: str, message: str, files: List[str]) -> str:
        """Create a commit in the repository."""
        repo = Repo(repo_path)
        
        # Add files to staging
        for file in files:
            repo.index.add([file])
        
        # Create commit
        commit = repo.index.commit(message)
        return commit.hexsha

    def push_changes(self, repo_path: str, branch: str) -> None:
        """Push changes to the remote repository."""
        repo = Repo(repo_path)
        origin = repo.remote(name='origin')
        origin.push(branch)

    def cleanup(self, repo_path: str) -> None:
        """Clean up temporary repository."""
        try:
            shutil.rmtree(repo_path)
        except Exception as e:
            print(f"Error cleaning up repository: {str(e)}") 