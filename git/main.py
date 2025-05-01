from fastapi import FastAPI, HTTPException, Depends, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from git_manager import GitManager
from auth import oauth, get_current_user, get_github_token
import secrets
import base64

# Load environment variables
load_dotenv()

app = FastAPI(title="Git Commit Manager")

# Add session middleware
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY", secrets.token_hex(32))
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Initialize GitManager
git_manager = GitManager()

# Models
class CommitRequest(BaseModel):
    repo_url: str
    branch: str
    commit_message: str
    files: List[str]

class CommitResponse(BaseModel):
    commit_id: str
    summary: str
    grouped_commits: List[str]

class RepositoryInfo(BaseModel):
    name: str
    full_name: str
    clone_url: str
    default_branch: str

class BranchInfo(BaseModel):
    name: str
    commit: dict

class CloneRequest(BaseModel):
    branch: str

class SaveFileRequest(BaseModel):
    content: str
    branch: str
    message: str

@app.get("/")
async def root():
    return {"message": "Git Commit Manager API"}

@app.get("/login")
async def login(request: Request):
    """Redirect to GitHub OAuth login."""
    redirect_uri = request.url_for('auth')
    return await oauth.github.authorize_redirect(request, redirect_uri)

@app.get("/auth")
async def auth(request: Request):
    """Handle GitHub OAuth callback."""
    token = await oauth.github.authorize_access_token(request)
    # Get user info using the access token
    response = await oauth.github.get('user', token=token)
    user_info = response.json()
    
    request.session['user'] = {
        'access_token': token['access_token'],
        'user_info': user_info
    }
    # Redirect back to the frontend with the showRepoSelector flag
    return RedirectResponse(url='http://localhost:8080/?showRepoSelector=true')

@app.get("/repositories", response_model=List[RepositoryInfo])
async def list_repositories(request: Request):
    """List user's GitHub repositories."""
    try:
        token = await get_github_token(request)
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")
            
        # Fetch user's personal repositories
        user_response = await oauth.github.get('user/repos', token={'access_token': token})
        if user_response.status_code != 200:
            raise HTTPException(
                status_code=user_response.status_code,
                detail="Failed to fetch personal repositories from GitHub"
            )
            
        # Fetch user's organizations
        orgs_response = await oauth.github.get('user/orgs', token={'access_token': token})
        if orgs_response.status_code != 200:
            raise HTTPException(
                status_code=orgs_response.status_code,
                detail="Failed to fetch organizations from GitHub"
            )
            
        orgs = orgs_response.json()
        all_repos = user_response.json()
        
        # Fetch repositories for each organization
        for org in orgs:
            org_repos_response = await oauth.github.get(f'orgs/{org["login"]}/repos', token={'access_token': token})
            if org_repos_response.status_code == 200:
                all_repos.extend(org_repos_response.json())
        
        # Remove duplicates and sort repositories by name
        unique_repos = {repo['full_name']: repo for repo in all_repos}.values()
        sorted_repos = sorted(unique_repos, key=lambda x: x['name'].lower())
        
        return [
            RepositoryInfo(
                name=repo['name'],
                full_name=repo['full_name'],
                clone_url=repo['clone_url'],
                default_branch=repo['default_branch']
            )
            for repo in sorted_repos
        ]
    except Exception as e:
        print(f"Error in list_repositories: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/repositories/{repo_name:path}/branches", response_model=List[BranchInfo])
async def list_branches(repo_name: str, request: Request):
    """List branches for a specific repository."""
    try:
        token = await get_github_token(request)
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")
            
        # First verify the user has access to the repository
        repo_response = await oauth.github.get(f'repos/{repo_name}', token={'access_token': token})
        if repo_response.status_code != 200:
            raise HTTPException(
                status_code=repo_response.status_code,
                detail="Repository not found or access denied"
            )
            
        # Then fetch the branches
        response = await oauth.github.get(f'repos/{repo_name}/branches', token={'access_token': token})
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail="Failed to fetch repository branches"
            )
            
        branches = response.json()
        # Sort branches by name
        branches.sort(key=lambda x: x['name'].lower())
        return branches
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/commit", response_model=CommitResponse)
async def create_commit(
    commit_request: CommitRequest,
    request: Request
):
    """Create a commit in the specified repository."""
    try:
        # Verify user has access to the repository
        token = await get_github_token(request)
        repo_name = commit_request.repo_url.split('/')[-1].replace('.git', '')
        
        async with oauth.github.client as client:
            response = await client.get(
                f'repos/{repo_name}',
                headers={'Authorization': f'token {token}'}
            )
            if response.status_code != 200:
                raise HTTPException(
                    status_code=403,
                    detail="You don't have access to this repository"
                )
        
        # Clone the repository
        repo_path = git_manager.clone_repo(commit_request.repo_url, commit_request.branch)
        
        try:
            # Create initial commit
            commit_id = git_manager.create_commit(
                repo_path,
                commit_request.commit_message,
                commit_request.files
            )
            
            # Get commit history
            repo = git_manager.Repo(repo_path)
            commits = [
                {
                    "message": commit.message,
                    "author": commit.author.name,
                    "date": commit.committed_datetime.isoformat()
                }
                for commit in repo.iter_commits()
            ]
            
            # Analyze and group commits
            grouped_commits = git_manager.analyze_commits(commits)
            
            # Push changes
            git_manager.push_changes(repo_path, commit_request.branch)
            
            return {
                "commit_id": commit_id,
                "summary": commit_request.commit_message,
                "grouped_commits": [str(group) for group in grouped_commits]
            }
            
        finally:
            # Clean up temporary repository
            git_manager.cleanup(repo_path)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/repositories/{repo_name:path}/contents")
async def get_repository_contents(
    repo_name: str,
    ref: str,
    path: str = "",
    request: Request = None
):
    """Get contents of a repository directory."""
    try:
        token = await get_github_token(request)
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")
            
        # First verify the user has access to the repository
        repo_response = await oauth.github.get(f'repos/{repo_name}', token={'access_token': token})
        if repo_response.status_code != 200:
            print(f"Repository access error: {repo_response.status_code} - {repo_response.text}")
            raise HTTPException(
                status_code=repo_response.status_code,
                detail=f"Repository not found or access denied: {repo_response.text}"
            )
            
        # Then fetch the contents
        url = f'repos/{repo_name}/contents/{path}' if path else f'repos/{repo_name}/contents'
        print(f"Fetching contents from: {url}")
        
        response = await oauth.github.get(
            url,
            params={'ref': ref},
            token={'access_token': token}
        )
        
        if response.status_code != 200:
            print(f"Contents fetch error: {response.status_code} - {response.text}")
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Failed to fetch repository contents: {response.text}"
            )
            
        contents = response.json()
        
        # If it's a single file, return it directly
        if isinstance(contents, dict):
            return [{
                'name': contents['name'],
                'path': contents['path'],
                'type': contents['type'],
                'size': contents['size']
            }]
            
        # If it's a directory, sort and format the contents
        formatted_contents = []
        for item in contents:
            formatted_contents.append({
                'name': item['name'],
                'path': item['path'],
                'type': item['type'],
                'size': item.get('size', 0)
            })
            
        # Sort directories first, then files, both alphabetically
        formatted_contents.sort(key=lambda x: (x['type'] != 'dir', x['name'].lower()))
        return formatted_contents
    except Exception as e:
        print(f"Error in get_repository_contents: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/repositories/{repo_name:path}/contents/{file_path:path}")
async def get_file_content(
    repo_name: str,
    file_path: str,
    ref: str,
    request: Request = None
):
    """Get content of a specific file."""
    try:
        token = await get_github_token(request)
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")
            
        # First verify the user has access to the repository
        repo_response = await oauth.github.get(f'repos/{repo_name}', token={'access_token': token})
        if repo_response.status_code != 200:
            print(f"Repository access error: {repo_response.status_code} - {repo_response.text}")
            raise HTTPException(
                status_code=repo_response.status_code,
                detail=f"Repository not found or access denied: {repo_response.text}"
            )
            
        # Then fetch the file content
        url = f'repos/{repo_name}/contents/{file_path}'
        print(f"Fetching file content from: {url}")
        
        response = await oauth.github.get(
            url,
            params={'ref': ref},
            token={'access_token': token}
        )
        
        if response.status_code != 200:
            print(f"File content fetch error: {response.status_code} - {response.text}")
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Failed to fetch file content: {response.text}"
            )
            
        content = response.json()
        if content['type'] != 'file':
            raise HTTPException(
                status_code=400,
                detail="Requested path is not a file"
            )
            
        # Decode the content from base64
        try:
            content['content'] = base64.b64decode(content['content']).decode('utf-8')
        except Exception as e:
            print(f"Base64 decode error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to decode file content: {str(e)}"
            )
            
        return content
    except Exception as e:
        print(f"Error in get_file_content: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/repositories/{repo_name:path}/clone")
async def clone_repository(
    repo_name: str,
    request: Request,
    clone_request: CloneRequest
):
    """Clone a repository and return its contents."""
    try:
        token = await get_github_token(request)
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")
            
        # First verify the user has access to the repository
        repo_response = await oauth.github.get(f'repos/{repo_name}', token={'access_token': token})
        if repo_response.status_code != 200:
            print(f"Repository access error: {repo_response.status_code} - {repo_response.text}")
            raise HTTPException(
                status_code=repo_response.status_code,
                detail=f"Repository not found or access denied: {repo_response.text}"
            )
            
        repo_data = repo_response.json()
        clone_url = repo_data['clone_url']
        
        # Clone the repository
        try:
            repo_path = git_manager.clone_repo(clone_url, clone_request.branch)
            
            # Get repository contents
            contents = []
            # Files and directories to ignore
            ignore_patterns = {
                '.git', '.github', '.gitignore', '.gitattributes',
                'node_modules', '__pycache__', '.pytest_cache',
                '.DS_Store', 'Thumbs.db', '.env', '.env.local',
                '*.pyc', '*.pyo', '*.pyd', '*.so', '*.dylib',
                '*.dll', '*.exe', '*.bin', '*.o', '*.a',
                '*.lib', '*.d', '*.obj', '*.class', '*.jar',
                '*.war', '*.ear', '*.zip', '*.tar.gz', '*.tgz',
                '*.rar', '*.7z', '*.iso', '*.img', '*.vmdk',
                '*.vhd', '*.vhdx', '*.vdi', '*.qcow2', '*.raw',
                '*.swp', '*.swo', '*~', '*.bak', '*.tmp',
                '*.temp', '*.log', '*.pid', '*.lock'
            }
            
            for root, dirs, files in os.walk(repo_path):
                # Filter out ignored directories
                dirs[:] = [d for d in dirs if d not in ignore_patterns and not any(d.endswith(ext) for ext in ignore_patterns if '*' in ext)]
                
                for name in dirs:
                    full_path = os.path.join(root, name)
                    rel_path = os.path.relpath(full_path, repo_path)
                    contents.append({
                        'name': name,
                        'path': rel_path,
                        'type': 'dir',
                        'size': 0
                    })
                
                for name in files:
                    # Skip ignored files
                    if name in ignore_patterns or any(name.endswith(ext[1:]) for ext in ignore_patterns if '*' in ext):
                        continue
                        
                    full_path = os.path.join(root, name)
                    rel_path = os.path.relpath(full_path, repo_path)
                    contents.append({
                        'name': name,
                        'path': rel_path,
                        'type': 'file',
                        'size': os.path.getsize(full_path)
                    })
            
            # Sort directories first, then files, both alphabetically
            contents.sort(key=lambda x: (x['type'] != 'dir', x['name'].lower()))
            return contents
            
        finally:
            # Clean up temporary repository
            if 'repo_path' in locals():
                git_manager.cleanup(repo_path)
            
    except Exception as e:
        print(f"Error in clone_repository: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/repositories/{repo_name:path}/contents/{file_path:path}")
async def update_file(
    repo_name: str,
    file_path: str,
    request: Request,
    save_request: SaveFileRequest
):
    """Update a file in the repository."""
    try:
        token = await get_github_token(request)
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")
            
        # First verify the user has access to the repository
        repo_response = await oauth.github.get(f'repos/{repo_name}', token={'access_token': token})
        if repo_response.status_code != 200:
            print(f"Repository access error: {repo_response.status_code} - {repo_response.text}")
            raise HTTPException(
                status_code=repo_response.status_code,
                detail=f"Repository not found or access denied: {repo_response.text}"
            )
            
        # Get the current file to get its SHA
        file_response = await oauth.github.get(
            f'repos/{repo_name}/contents/{file_path}',
            params={'ref': save_request.branch},
            token={'access_token': token}
        )
        
        if file_response.status_code != 200:
            print(f"File fetch error: {file_response.status_code} - {file_response.text}")
            raise HTTPException(
                status_code=file_response.status_code,
                detail=f"Failed to fetch file: {file_response.text}"
            )
            
        current_file = file_response.json()
        
        # Prepare the update request
        update_data = {
            "message": save_request.message,
            "content": base64.b64encode(save_request.content.encode('utf-8')).decode('utf-8'),
            "sha": current_file['sha'],
            "branch": save_request.branch
        }
        
        # Update the file
        update_response = await oauth.github.put(
            f'repos/{repo_name}/contents/{file_path}',
            json=update_data,
            token={'access_token': token}
        )
        
        if update_response.status_code not in (200, 201):
            print(f"File update error: {update_response.status_code} - {update_response.text}")
            raise HTTPException(
                status_code=update_response.status_code,
                detail=f"Failed to update file: {update_response.text}"
            )
            
        return update_response.json()
    except Exception as e:
        print(f"Error in update_file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 