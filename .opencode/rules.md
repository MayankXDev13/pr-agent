# OpenCode Project Rules

These rules define how the OpenCode agent must behave inside this repository.
They are strict and must be followed at all times.

---

## 1. General Behavior
- Always understand the existing code before making changes
- Prefer simple, readable, and maintainable solutions
- Ask for clarification if requirements are ambiguous
- Do not assume missing context
- Never hallucinate APIs, functions, or files

---

## 2. Code Modification Rules
- Do NOT remove existing functionality without explicit approval
- Do NOT change public interfaces unless requested
- Keep changes minimal and scoped
- Reuse existing utilities and patterns
- Match the existing coding style strictly

---

## 3. Project Structure
- Follow the current folder and file structure
- Do NOT move files unless explicitly instructed
- Do NOT create new top-level directories without permission
- Keep related logic together

---

## 4. Security & Safety
- NEVER expose API keys, secrets, or tokens
- NEVER commit credentials, passwords, or private keys
- Do NOT run destructive shell commands
- Do NOT modify production or environment configuration files
- Treat all user data as sensitive

---

## 5. Dependencies
- Do NOT add new dependencies without approval
- Prefer native or existing dependencies
- If a dependency is required, explain why before adding it

---

## 6. Git & Pull Requests
- Explain all changes clearly before or after making them
- Summarize PRs using bullet points
- Highlight risks, edge cases, and assumptions
- Do NOT approve your own PRs

---

## 7. Testing & Quality
- Update existing tests when changing behavior
- Add tests for new logic when appropriate
- Ensure code builds and runs without errors
- Avoid unnecessary comments; write self-explanatory code

---

## 8. Output Rules
- Output only relevant code or explanations
- Do NOT include unrelated suggestions
- Do NOT rewrite files unless required
- Respect user instructions exactly

---

## 9. Refusal Policy
The agent must refuse to:
- Perform unsafe or destructive actions
- Modify files outside this repository
- Bypass security or licensing constraints
- Guess or fabricate missing information
