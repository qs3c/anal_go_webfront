# Full Frontend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the full frontend described in frontend-complete-guide.md and integration-specification.md with Ant Design UI, mock API + localStorage persistence, and demo login.

**Architecture:** React 18 + Vite + TypeScript app with React Router routes, Ant Design UI, Zustand stores, and a mock service layer that persists snake_case data to localStorage. A mock WebSocket simulator emits progress events for analysis jobs. Editor page embeds Excalidraw for a functional visualizer with auto-save.

**Tech Stack:** React 18, Vite, TypeScript, React Router, Ant Design, Axios, Zustand, dayjs, Excalidraw, Vitest + React Testing Library.

---

### Task 1: Add test tooling and baseline utilities

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/utils/storage.ts`
- Create: `src/utils/__tests__/storage.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { storage } from '../storage'

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('writes and reads JSON values', () => {
    storage.set('demo', { a: 1 })
    expect(storage.get('demo')).toEqual({ a: 1 })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand`
Expected: FAIL with "npm ERR! Missing script: test" or module not found.

**Step 3: Write minimal implementation**

```ts
export const storage = {
  get<T>(key: string, fallback: T | null = null): T | null {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    try {
      return JSON.parse(raw) as T
    } catch {
      return fallback
    }
  },
  set(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove(key: string) {
    localStorage.removeItem(key)
  },
}
```

Also add Vitest tooling:
- `package.json` scripts: `"test": "vitest"`
- `vitest.config.ts` with jsdom environment
- `src/test/setup.ts` importing `@testing-library/jest-dom`

**Step 4: Run test to verify it passes**

Run: `npm test -- --runInBand`
Expected: PASS for storage test

**Step 5: Commit**

```bash
git add package.json vitest.config.ts src/test/setup.ts src/utils/storage.ts src/utils/__tests__/storage.test.ts
 git commit -m "test: add vitest and storage utility"
```

---

### Task 2: Define constants and format helpers

**Files:**
- Create: `src/utils/constants.ts`
- Create: `src/utils/format.ts`
- Create: `src/utils/__tests__/format.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { formatDate } from '../format'

describe('formatDate', () => {
  it('formats RFC3339 date to readable string', () => {
    expect(formatDate('2025-01-20T10:30:00Z')).toBe('2025-01-20 10:30')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand`
Expected: FAIL with "Cannot find module '../format'".

**Step 3: Write minimal implementation**

```ts
import dayjs from 'dayjs'

export function formatDate(value: string) {
  if (!value) return ''
  return dayjs(value).format('YYYY-MM-DD HH:mm')
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --runInBand`
Expected: PASS for format test

**Step 5: Commit**

```bash
git add src/utils/constants.ts src/utils/format.ts src/utils/__tests__/format.test.ts
 git commit -m "feat: add constants and format helpers"
```

---

### Task 3: Build mock database and API services (snake_case)

**Files:**
- Create: `src/services/mockDb.ts`
- Create: `src/services/api.ts`
- Create: `src/services/authService.ts`
- Create: `src/services/userService.ts`
- Create: `src/services/analysisService.ts`
- Create: `src/services/communityService.ts`
- Create: `src/services/commentService.ts`
- Create: `src/services/__tests__/analysisService.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { analysisService } from '../analysisService'
import { storage } from '../../utils/storage'

describe('analysisService', () => {
  beforeEach(() => storage.remove('mock_db'))

  it('creates and lists analyses', async () => {
    await analysisService.create({ name: 'Demo', description: '', repo_url: '' })
    const res = await analysisService.list({ page: 1, page_size: 10 })
    expect(res.data.items.length).toBe(1)
    expect(res.data.items[0].name).toBe('Demo')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand`
Expected: FAIL with "Cannot find module '../analysisService'".

**Step 3: Write minimal implementation**

- `mockDb.ts` implements a localStorage-backed store keyed as `mock_db`.
- Each service returns `{ code, message, data }` and uses snake_case fields.
- `api.ts` provides a thin wrapper to simulate latency and centralized error handling.

**Step 4: Run test to verify it passes**

Run: `npm test -- --runInBand`
Expected: PASS for analysis service test

**Step 5: Commit**

```bash
git add src/services src/services/__tests__/analysisService.test.ts
 git commit -m "feat: add mock db and api services"
```

---

### Task 4: Implement Zustand stores and hooks

**Files:**
- Create: `src/store/authStore.ts`
- Create: `src/store/analysisStore.ts`
- Create: `src/store/communityStore.ts`
- Create: `src/store/uiStore.ts`
- Create: `src/hooks/useAuth.ts`
- Create: `src/hooks/useAnalysis.ts`
- Create: `src/hooks/useWebSocket.ts`
- Create: `src/store/__tests__/authStore.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { useAuthStore } from '../authStore'

describe('authStore', () => {
  it('starts logged out', () => {
    const state = useAuthStore.getState()
    expect(state.is_authenticated).toBe(false)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand`
Expected: FAIL with "Cannot find module '../authStore'".

**Step 3: Write minimal implementation**

- `authStore` handles login/logout + demo login.
- `analysisStore` handles list/create/update/progress.
- `communityStore` loads grid and detail.
- `uiStore` handles global loading and modal state.

**Step 4: Run test to verify it passes**

Run: `npm test -- --runInBand`
Expected: PASS for authStore test

**Step 5: Commit**

```bash
git add src/store src/hooks src/store/__tests__/authStore.test.ts
 git commit -m "feat: add zustand stores and hooks"
```

---

### Task 5: Layout, navigation, and routing shell

**Files:**
- Create: `src/components/Layout/MainLayout.tsx`
- Create: `src/components/Layout/Header.tsx`
- Create: `src/components/Layout/Footer.tsx`
- Create: `src/components/ProtectedRoute.tsx`
- Modify: `src/router.tsx`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from '../Layout/Header'

describe('Header', () => {
  it('renders brand name', () => {
    render(<Header />)
    expect(screen.getByText('Go Analyzer')).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand`
Expected: FAIL with "Cannot find module '../Layout/Header'".

**Step 3: Write minimal implementation**

- Header with nav links (Home/Community/Workspace/Profile/Login).
- MainLayout with AntD Layout + Outlet.
- ProtectedRoute uses authStore; redirects to /login.
- App uses RouterProvider.

**Step 4: Run test to verify it passes**

Run: `npm test -- --runInBand`
Expected: PASS for Header test

**Step 5: Commit**

```bash
git add src/components/Layout src/components/ProtectedRoute.tsx src/router.tsx src/App.tsx src/main.tsx
 git commit -m "feat: add layout and routing shell"
```

---

### Task 6: Auth pages and demo login

**Files:**
- Create: `src/pages/Login.tsx`
- Create: `src/pages/Register.tsx`
- Create: `src/pages/OAuthCallback.tsx`
- Create: `src/components/Auth/LoginForm.tsx`
- Create: `src/components/Auth/RegisterForm.tsx`
- Create: `src/components/Auth/OAuthButtons.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Login from '../Login'

describe('Login page', () => {
  it('shows demo login button', () => {
    render(<Login />)
    expect(screen.getByRole('button', { name: /demo/i })).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand`
Expected: FAIL with "Cannot find module '../Login'".

**Step 3: Write minimal implementation**

- Login/Register forms with AntD Form.
- Demo login button uses authStore demo action.
- OAuth buttons are UI-only (mock).
- OAuthCallback shows success + redirect.

**Step 4: Run test to verify it passes**

Run: `npm test -- --runInBand`
Expected: PASS for Login page test

**Step 5: Commit**

```bash
git add src/pages src/components/Auth
 git commit -m "feat: add auth pages and demo login"
```

---

### Task 7: Workspace pages and analysis creation flow

**Files:**
- Create: `src/pages/Workspace.tsx`
- Create: `src/components/Workspace/AnalysisList.tsx`
- Create: `src/components/Workspace/AnalysisCard.tsx`
- Create: `src/components/Workspace/CreateModal.tsx`
- Create: `src/components/Workspace/ConfigForm.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Workspace from '../Workspace'

describe('Workspace page', () => {
  it('renders create analysis button', () => {
    render(<Workspace />)
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand`
Expected: FAIL with "Cannot find module '../Workspace'".

**Step 3: Write minimal implementation**

- Analysis list loads from analysisStore.
- Create modal collects name/repo/description + AI config.
- Submitting creates analysis and navigates to progress page.

**Step 4: Run test to verify it passes**

Run: `npm test -- --runInBand`
Expected: PASS for Workspace test

**Step 5: Commit**

```bash
git add src/pages/Workspace.tsx src/components/Workspace
 git commit -m "feat: add workspace and analysis creation"
```

---

### Task 8: Analysis progress page and mock WebSocket

**Files:**
- Create: `src/pages/AnalysisProgress.tsx`
- Modify: `src/hooks/useWebSocket.ts`
- Create: `src/components/Workspace/Progress.tsx`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { createMockProgressStream } from '../useWebSocket'

describe('mock progress', () => {
  it('emits progress events', async () => {
    const events = await createMockProgressStream()
    expect(events.length).toBeGreaterThan(0)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand`
Expected: FAIL with "createMockProgressStream is not a function".

**Step 3: Write minimal implementation**

- Hook emits progress updates on interval.
- Progress component renders status, percent, log list.

**Step 4: Run test to verify it passes**

Run: `npm test -- --runInBand`
Expected: PASS for mock progress test

**Step 5: Commit**

```bash
git add src/pages/AnalysisProgress.tsx src/hooks/useWebSocket.ts src/components/Workspace/Progress.tsx
 git commit -m "feat: add analysis progress with mock websocket"
```

---

### Task 9: Analysis editor with Excalidraw and auto-save

**Files:**
- Create: `src/pages/AnalysisEditor.tsx`
- Create: `src/components/Workspace/Editor.tsx`
- Create: `src/hooks/useAutoSave.ts`
- Create: `src/components/Common/Loading.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AnalysisEditor from '../AnalysisEditor'

describe('AnalysisEditor', () => {
  it('renders editor toolbar', () => {
    render(<AnalysisEditor />)
    expect(screen.getByText(/editor/i)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand`
Expected: FAIL with "Cannot find module '../AnalysisEditor'".

**Step 3: Write minimal implementation**

- Use Excalidraw component for canvas.
- Load analysis visualizer data from localStorage.
- Auto-save on debounced changes.

**Step 4: Run test to verify it passes**

Run: `npm test -- --runInBand`
Expected: PASS for AnalysisEditor test

**Step 5: Commit**

```bash
git add src/pages/AnalysisEditor.tsx src/components/Workspace/Editor.tsx src/hooks/useAutoSave.ts src/components/Common/Loading.tsx
 git commit -m "feat: add analysis editor with autosave"
```

---

### Task 10: Community pages, detail view, and comments

**Files:**
- Create: `src/pages/Community.tsx`
- Create: `src/pages/AnalysisDetail.tsx`
- Create: `src/components/Community/AnalysisGrid.tsx`
- Create: `src/components/Community/CommunityCard.tsx`
- Create: `src/components/Community/FilterBar.tsx`
- Create: `src/components/Community/TagList.tsx`
- Create: `src/components/Comment/CommentList.tsx`
- Create: `src/components/Comment/CommentItem.tsx`
- Create: `src/components/Comment/CommentInput.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Community from '../Community'

describe('Community', () => {
  it('renders filter bar', () => {
    render(<Community />)
    expect(screen.getByText(/filter/i)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand`
Expected: FAIL with "Cannot find module '../Community'".

**Step 3: Write minimal implementation**

- Grid loads from communityStore.
- Detail view shows analysis + comment list.
- Comment input posts to mock commentService.

**Step 4: Run test to verify it passes**

Run: `npm test -- --runInBand`
Expected: PASS for Community test

**Step 5: Commit**

```bash
git add src/pages/Community.tsx src/pages/AnalysisDetail.tsx src/components/Community src/components/Comment
 git commit -m "feat: add community pages and comments"
```

---

### Task 11: Profile page and 404

**Files:**
- Create: `src/pages/Profile.tsx`
- Create: `src/pages/NotFound.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import NotFound from '../NotFound'

describe('NotFound', () => {
  it('renders 404 message', () => {
    render(<NotFound />)
    expect(screen.getByText(/404/)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand`
Expected: FAIL with "Cannot find module '../NotFound'".

**Step 3: Write minimal implementation**

- Profile shows user info and subscription mock data.
- 404 page shows navigation back to home.

**Step 4: Run test to verify it passes**

Run: `npm test -- --runInBand`
Expected: PASS for NotFound test

**Step 5: Commit**

```bash
git add src/pages/Profile.tsx src/pages/NotFound.tsx
 git commit -m "feat: add profile and not found pages"
```

---

### Task 12: Wire routes, theme, and global styles

**Files:**
- Modify: `src/router.tsx`
- Modify: `src/index.css`
- Create: `src/styles/variables.css`
- Create: `src/styles/animations.css`

**Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RouterProvider } from 'react-router-dom'
import { router } from '../../router'

describe('Router', () => {
  it('renders home page', () => {
    render(<RouterProvider router={router} />)
    expect(screen.getByText(/community|home/i)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand`
Expected: FAIL with route mismatch or missing page component.

**Step 3: Write minimal implementation**

- Add routes for Workspace, Progress, Editor, Community, Detail, Profile.
- Load global CSS and AntD theme in main.
- Add CSS variables/animations for subtle polish.

**Step 4: Run test to verify it passes**

Run: `npm test -- --runInBand`
Expected: PASS for router test

**Step 5: Commit**

```bash
git add src/router.tsx src/index.css src/styles/variables.css src/styles/animations.css
 git commit -m "feat: finalize routing and styles"
```

---

### Task 13: Build verification

**Files:**
- None (verification only)

**Step 1: Run build**

Run: `npm run build`
Expected: PASS with Vite build output

**Step 2: Commit**

```bash
git status --short
```
Expected: clean working tree

