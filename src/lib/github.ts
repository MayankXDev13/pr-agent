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
