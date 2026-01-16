import { Octokit } from "@octokit/rest";

export function createGitHubClient(accessToken: string): Octokit {
  return new Octokit({
    auth: accessToken,
  });
}

export async function getUserRepositories(octokit: Octokit) {
  const { data } = await octokit.repos.listForAuthenticatedUser({
    sort: "updated",
    direction: "desc",
    per_page: 100,
  });
  
  return data.map((repo) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    owner: repo.owner.login,
    description: repo.description,
    private: repo.private,
    defaultBranch: repo.default_branch,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    updatedAt: repo.updated_at,
  }));
}

export async function getRepository(octokit: Octokit, owner: string, repo: string) {
  const { data } = await octokit.repos.get({
    owner,
    repo,
  });
  
  return {
    id: data.id,
    name: data.name,
    fullName: data.full_name,
    owner: data.owner.login,
    description: data.description,
    private: data.private,
    defaultBranch: data.default_branch,
    language: data.language,
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    updatedAt: data.updated_at,
  };
}

export async function getPullRequests(octokit: Octokit, owner: string, repo: string, state: "open" | "closed" | "all" = "open") {
  const { data } = await octokit.pulls.list({
    owner,
    repo,
    state,
    sort: "updated",
    direction: "desc",
    per_page: 50,
  });
  
  return data.map((pr) => ({
    number: pr.number,
    title: pr.title,
    state: pr.state,
    author: pr.user?.login || "unknown",
    baseBranch: pr.base.ref,
    headBranch: pr.head.ref,
    body: pr.body,
    additions: 0,
    deletions: 0,
    changedFiles: 0,
    createdAt: new Date(pr.created_at).getTime(),
    updatedAt: new Date(pr.updated_at).getTime(),
    mergedAt: pr.merged_at ? new Date(pr.merged_at).getTime() : null,
    closedAt: pr.closed_at ? new Date(pr.closed_at).getTime() : null,
    draft: pr.draft || false,
    htmlUrl: pr.html_url,
  }));
}

export async function getPullRequestFiles(octokit: Octokit, owner: string, repo: string, prNumber: number) {
  const { data } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber,
    per_page: 300,
  });
  
  return data.map((file) => ({
    filename: file.filename,
    status: file.status,
    additions: file.additions,
    deletions: file.deletions,
    changes: file.changes,
    patch: file.patch,
    previousFilename: file.previous_filename,
  }));
}

export async function getPullRequest(octokit: Octokit, owner: string, repo: string, prNumber: number) {
  const { data } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });
  
  return {
    number: data.number,
    title: data.title,
    state: data.state,
    author: data.user?.login || "unknown",
    baseBranch: data.base.ref,
    headBranch: data.head.ref,
    body: data.body,
    additions: (data as any).additions || 0,
    deletions: (data as any).deletions || 0,
    changedFiles: (data as any).changed_files || 0,
    createdAt: new Date(data.created_at).getTime(),
    updatedAt: new Date(data.updated_at).getTime(),
    mergedAt: data.merged_at ? new Date(data.merged_at).getTime() : null,
    closedAt: data.closed_at ? new Date(data.closed_at).getTime() : null,
    draft: data.draft || false,
    htmlUrl: data.html_url,
  };
}

export async function createRepositoryWebhook(
  octokit: Octokit,
  owner: string,
  repo: string,
  webhookUrl: string,
  secret: string
) {
  const { data } = await octokit.repos.createWebhook({
    owner,
    repo,
    config: {
      url: webhookUrl,
      content_type: "json",
      secret,
      insecure_ssl: "0",
    },
    events: ["pull_request"],
    active: true,
  });
  
  return data.id;
}

export async function deleteRepositoryWebhook(
  octokit: Octokit,
  owner: string,
  repo: string,
  webhookId: number
) {
  await octokit.repos.deleteWebhook({
    owner,
    repo,
    hook_id: webhookId,
  });
}

export async function postComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number,
  body: string
) {
  const { data } = await octokit.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body,
  });
  
  return data.id;
}

export async function createPullRequestReview(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number,
  body: string,
  event: "APPROVE" | "REQUEST_CHANGES" | "COMMENT"
) {
  const { data } = await octokit.pulls.createReview({
    owner,
    repo,
    pull_number: prNumber,
    body,
    event,
  });
  
  return data.id;
}

export async function getFileContent(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  ref: string
): Promise<string> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });
    
    if ("content" in data && typeof data.content === "string") {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    return "";
  } catch {
    return "";
  }
}

export async function getRepoTree(
  octokit: Octokit,
  owner: string,
  repo: string,
  branch: string
): Promise<Array<{ path: string; type: "file" | "dir" }>> {
  try {
    const { data } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: "true",
    });
    
    return data.tree
      .filter((item) => item.type === "blob" && isSourceFile(item.path || ""))
      .map((item) => ({
        path: item.path || "",
        type: "file" as const,
      }));
  } catch {
    return [];
  }
}

function isSourceFile(path: string): boolean {
  const sourceExtensions = [
    ".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".rs", ".java",
    ".cpp", ".c", ".h", ".cs", ".rb", ".php", ".swift", ".kt",
  ];
  const skipPatterns = [
    "node_modules", ".git", "dist", "build", ".next", "coverage",
    "package-lock.json", "yarn.lock", "Cargo.lock", "go.sum",
  ];
  
  const ext = path.substring(path.lastIndexOf("."));
  const hasValidExt = sourceExtensions.includes(ext);
  const skipPath = skipPatterns.some((pattern) => path.includes(pattern));
  
  return hasValidExt && !skipPath;
}

export function findRelatedFiles(
  changedFiles: string[],
  allFiles: Array<{ path: string; type: "file" | "dir" }>
): string[] {
  const changedSet = new Set(changedFiles);
  const result: string[] = [];
  const added = new Set<string>();
  
  for (const changedFile of changedFiles) {
    const parts = changedFile.split("/");
    for (let i = parts.length - 1; i > 0; i--) {
      const dir = parts.slice(0, i).join("/");
      if (added.has(dir)) continue;
      
      const related = allFiles
        .filter((f) => f.path.startsWith(dir + "/") && !changedSet.has(f.path))
        .slice(0, 5);
      
      for (const r of related) {
        if (!added.has(r.path)) {
          result.push(r.path);
          added.add(r.path);
        }
      }
    }
  }
  
  return result.slice(0, 20);
}

export async function getRelatedCode(
  octokit: Octokit,
  owner: string,
  repo: string,
  changedFiles: string[],
  branch: string
): Promise<Array<{ path: string; content: string }>> {
  const tree = await getRepoTree(octokit, owner, repo, branch);
  const relatedPaths = findRelatedFiles(changedFiles, tree);
  
  const contents = await Promise.all(
    relatedPaths.map(async (path) => ({
      path,
      content: await getFileContent(octokit, owner, repo, path, branch),
    }))
  );
  
  return contents.filter((c) => c.content.length > 0);
}

export async function postInlineComments(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number,
  commitId: string,
  comments: Array<{
    path: string;
    line: number;
    body: string;
    side?: "LEFT" | "RIGHT";
  }>
): Promise<number[]> {
  if (comments.length === 0) return [];
  
  try {
    const reviewComments = comments.map((c: { path: string; line: number; body: string; side?: string }) => ({
      path: c.path,
      line: c.line,
      body: c.body,
      side: c.side,
    }));
    
    await octokit.pulls.createReview({
      owner,
      repo,
      pull_number: prNumber,
      commit_id: commitId,
      comments: reviewComments,
      event: "COMMENT",
    });
    
    return comments.map((_, i) => i + 1);
  } catch (error) {
    console.error("Failed to post inline comments:", error);
    return [];
  }
}
