# GitHub Webhooks Setup

This document explains how to set up GitHub webhooks for the PR Agent.

## Webhook URL

Your webhook endpoint is:

```
https://your-domain.com/api/webhooks/github
```

## Setting Up Webhooks

### Option 1: GitHub App (Recommended)

1. Create a GitHub App at https://github.com/settings/apps/new
2. Set the webhook URL to: `https://your-domain.com/api/webhooks/github`
3. Generate a webhook secret and add it to `.env.local`:
   ```
   GITHUB_WEBHOOK_SECRET=your-webhook-secret
   ```
4. Subscribe to these events:
   - `push` - Trigger re-indexing when code is pushed
   - `pull_request` - Trigger reviews when PRs are opened/updated
   - `installation` - Handle app installation/uninstallation

5. Set required permissions:
   - `contents: read` - Access repository contents
   - `pull_requests: read & write` - Read PRs and post comments
   - `issues: read & write` - Post review comments as issues

### Option 2: Repository Webhooks

1. Go to your repository Settings → Webhooks → Add webhook
2. Set the webhook URL: `https://your-domain.com/api/webhooks/github`
3. Set content type: `application/json`
4. Generate and set a webhook secret
5. Select events to subscribe to:
   - [x] Push
   - [x] Pull requests

## Environment Variables

Add these to your `.env.local`:

```env
# Required for webhook signature verification
GITHUB_WEBHOOK_SECRET=your-webhook-secret

# Required for GitHub API calls
GITHUB_APP_ID=your-github-app-id
GITHUB_PRIVATE_KEY=your-github-private-key
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
```

## Webhook Events

The endpoint handles these GitHub webhook events:

| Event | Action | Description |
|-------|--------|-------------|
| `ping` | - | Webhook configuration test |
| `pull_request` | opened, synchronize | Trigger PR review |
| `push` | - | Trigger code re-indexing |
| `installation` | created, deleted | Handle app installation |

## Testing Webhooks

### Using GitHub CLI

```bash
gh api repos/{owner}/{repo}/hooks -X POST \
  --field name='web' \
  --field events='["push","pull_request"]' \
  --field config='{"url":"https://your-domain.com/api/webhooks/github","content_type":"json"}'
```

### Local Testing with ngrok

1. Install ngrok: `brew install ngrok` (or download from ngrok.com)
2. Start tunnel: `ngrok http 3000`
3. Use the ngrok URL for webhook setup
4. Test with: `curl -X POST https://your-ngrok-url.ngrok-free.app/api/webhooks/github`

## Security

- All webhook requests are verified using HMAC SHA-256 signature
- Invalid signatures are rejected with 401 Unauthorized
- The webhook secret must match between GitHub and your server

## Troubleshooting

### "Invalid signature" error
- Check that `GITHUB_WEBHOOK_SECRET` matches the secret in GitHub webhook settings
- Ensure the secret is exactly the same (no extra spaces)

### Events not triggering
- Verify the repository has the webhook configured
- Check that correct events are subscribed in GitHub settings
- Review server logs for webhook processing errors

### Local development
- Use ngrok or similar tool to expose localhost
- Webhooks won't work with `localhost` - need public URL
