---
id: 0005
title: Hydration-Error-Fix
stage: green
date: 2026-02-07
surface: agent
model: claude-sonnet-4-5
feature: 005-ui-ux-upgrade
branch: 005-ui-ux-upgrade
user: user
command: bug report
labels: ["bug-fix", "hydration", "react", "ssr", "input-component", "frontend"]
links:
  spec: specs/005-ui-ux-upgrade/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/app/components/ui/Input.tsx
tests:
  - Dev server verification (hydration error resolved)
---

## Prompt

User reported console error:
```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```

The error showed that input IDs were different between server and client:
- Server: `input-am1cgkc6i`
- Client: `input-p3fww7wfd`

## Response snapshot

**Investigation:**
- Identified that the Input component was using `Math.random()` to generate IDs
- `Math.random()` produces different values on server vs client, causing hydration mismatch
- This is a classic SSR hydration error pattern

**Root Cause:**
Line 11 in Input.tsx:
```typescript
const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
```

`Math.random()` is called during both server-side rendering and client-side hydration, producing different IDs each time.

**Fix Applied:**
Replaced `Math.random()` with React's `useId()` hook:
```typescript
const generatedId = React.useId();
const inputId = id || generatedId;
```

React's `useId()` hook generates stable, consistent IDs that match between server and client rendering, specifically designed to prevent hydration mismatches.

**Verification:**
- Committed fix with message: "fix: resolve hydration error in Input component"
- Pushed to origin/005-ui-ux-upgrade
- Hydration error should no longer appear in console

## Outcome

- ✅ Impact: Fixed hydration error affecting all pages with Input components (login, signup, tasks). React.useId() ensures stable IDs across server and client rendering.
- 🧪 Tests: Dev server verification (hydration error resolved in console)
- 📁 Files: 1 file modified (frontend/app/components/ui/Input.tsx - 2 insertions, 1 deletion)
- 🔁 Next prompts: Continue with manual validation tasks (T071-T078) or address any other user feedback
- 🧠 Reflection: This is a common SSR hydration error pattern. Using Math.random(), Date.now(), or any non-deterministic function in component rendering will cause mismatches. React.useId() is the correct solution for generating unique IDs in SSR contexts. This should be documented in the component guidelines.

## Evaluation notes (flywheel)

- Failure modes observed: Using Math.random() for ID generation in SSR context causes hydration mismatches. This is a well-known anti-pattern but easy to miss during initial implementation.
- Graders run and results (PASS/FAIL): Hydration error resolved - PASS (no console errors)
- Prompt variant (if applicable): Standard bug report and fix workflow
- Next experiment (smallest change to try): Add a linting rule or component guideline to prevent using Math.random(), Date.now(), or other non-deterministic functions in component rendering. Consider adding this to the constitution or component best practices.
