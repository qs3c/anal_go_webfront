# Regression Tests Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add regression tests for create analysis modal flows, workspace list states, and community detail + 404 routing.

**Architecture:** Add focused RTL tests around existing components and pages with mocked hooks/services and MemoryRouter navigation assertions. Favor behavior-focused assertions (labels, navigation paths, empty states) and keep each test scoped to one behavior. Use mocked useAnalysis/communityService where necessary.

**Tech Stack:** React, React Router, Ant Design, Vitest, @testing-library/react

### Task 1: Create analysis modal (AI tab) validation and success navigation

**Files:**
- Create: `src/components/Workspace/__tests__/CreateModal.test.tsx`
- Modify: `src/components/Workspace/CreateModal.tsx` (only if needed)

**Step 1: Write the failing test**

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import CreateModal from '../CreateModal'

const mockCreate = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../../../hooks/useAnalysis', () => ({
  useAnalysis: () => ({ createAnalysis: mockCreate }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('CreateModal AI', () => {
  it('validates required fields and navigates to progress on success', async () => {
    mockCreate.mockResolvedValue({ analysis_id: 12 })

    render(
      <MemoryRouter>
        <CreateModal open onClose={vi.fn()} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /开始分析/ }))

    expect(await screen.findByText(/请输入 GitHub 仓库地址/)).toBeInTheDocument()
    expect(await screen.findByText(/请输入起始结构体名称/)).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('https://github.com/gin-gonic/gin'), {
      target: { value: 'https://github.com/gin-gonic/gin' },
    })
    fireEvent.change(screen.getByPlaceholderText('Engine'), { target: { value: 'Engine' } })

    fireEvent.click(screen.getByRole('button', { name: /开始分析/ }))

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/analysis/12/progress')
    })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Workspace/__tests__/CreateModal.test.tsx`
Expected: FAIL with missing validation message or navigation assertion.

**Step 3: Write minimal implementation**

```tsx
// Only if the test fails because modal buttons not found or form validation not triggered.
// Adjust component to ensure submit button triggers form validation and errors surface.
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Workspace/__tests__/CreateModal.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Workspace/__tests__/CreateModal.test.tsx src/components/Workspace/CreateModal.tsx
git commit -m "test: add create analysis modal regression coverage"
```

### Task 2: Create analysis modal (manual tab) validation and success navigation

**Files:**
- Modify: `src/components/Workspace/__tests__/CreateModal.test.tsx`

**Step 1: Write the failing test**

```tsx
it('validates manual title and navigates to detail on success', async () => {
  mockCreate.mockResolvedValue({ analysis_id: 24 })

  render(
    <MemoryRouter>
      <CreateModal open onClose={vi.fn()} />
    </MemoryRouter>
  )

  fireEvent.click(screen.getByRole('tab', { name: /手动创建/ }))
  fireEvent.click(screen.getByRole('button', { name: /创建/ }))

  expect(await screen.findByText(/请输入项目名称/)).toBeInTheDocument()

  fireEvent.change(screen.getByPlaceholderText('我的分析项目'), { target: { value: 'My Project' } })
  fireEvent.click(screen.getByRole('button', { name: /创建/ }))

  await waitFor(() => {
    expect(mockCreate).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/analysis/24')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Workspace/__tests__/CreateModal.test.tsx`
Expected: FAIL with missing validation message or navigation assertion.

**Step 3: Write minimal implementation**

```tsx
// Only if test fails due to manual tab submit behavior. Ensure button label switches and validation triggers.
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Workspace/__tests__/CreateModal.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Workspace/__tests__/CreateModal.test.tsx src/components/Workspace/CreateModal.tsx
git commit -m "test: cover manual create analysis flow"
```

### Task 3: Workspace list states (loading, empty, populated)

**Files:**
- Create: `src/components/Workspace/__tests__/AnalysisList.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AnalysisList from '../AnalysisList'

const mockFetch = vi.fn()

vi.mock('../../../hooks/useAnalysis', () => ({
  useAnalysis: () => ({ analyses: [], loading: true, fetchAnalyses: mockFetch }),
}))

describe('AnalysisList', () => {
  it('shows loading when empty and loading', () => {
    render(<AnalysisList />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Workspace/__tests__/AnalysisList.test.tsx`
Expected: FAIL if role or spinner not found.

**Step 3: Write minimal implementation**

```tsx
// Only if role/aria mismatch: consider adding aria-label to Spin for testability.
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Workspace/__tests__/AnalysisList.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Workspace/__tests__/AnalysisList.test.tsx src/components/Workspace/AnalysisList.tsx
git commit -m "test: cover workspace list loading state"
```

### Task 4: Workspace list empty and populated cases

**Files:**
- Modify: `src/components/Workspace/__tests__/AnalysisList.test.tsx`

**Step 1: Write the failing test**

```tsx
it('shows empty state when no analyses', () => {
  vi.mocked(mockFetch).mockClear()
  render(<AnalysisList />)
  expect(screen.getByText(/暂无分析项目/)).toBeInTheDocument()
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Workspace/__tests__/AnalysisList.test.tsx`
Expected: FAIL if empty state not matched.

**Step 3: Write minimal implementation**

```tsx
// Only if empty description differs; adjust assertion to match actual text.
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Workspace/__tests__/AnalysisList.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Workspace/__tests__/AnalysisList.test.tsx

git commit -m "test: cover workspace list empty state"
```

**Step 6: Write the failing test (populated)**

```tsx
vi.mock('../../../hooks/useAnalysis', () => ({
  useAnalysis: () => ({
    analyses: [{ analysis_id: 1, title: 'A1' }],
    loading: false,
    fetchAnalyses: mockFetch,
  }),
}))

it('renders analysis cards when data exists', () => {
  render(<AnalysisList />)
  expect(screen.getByText(/A1/)).toBeInTheDocument()
})
```

**Step 7: Run test to verify it fails**

Run: `npx vitest run src/components/Workspace/__tests__/AnalysisList.test.tsx`
Expected: FAIL if AnalysisCard not rendering text directly.

**Step 8: Write minimal implementation**

```tsx
// If AnalysisCard doesn't render title, update assertion to a stable label or mock AnalysisCard.
```

**Step 9: Run test to verify it passes**

Run: `npx vitest run src/components/Workspace/__tests__/AnalysisList.test.tsx`
Expected: PASS

**Step 10: Commit**

```bash
git add src/components/Workspace/__tests__/AnalysisList.test.tsx

git commit -m "test: cover workspace list populated state"
```

### Task 5: Community detail rendering and back navigation

**Files:**
- Create: `src/pages/__tests__/CommunityDetail.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AnalysisDetail from '../AnalysisDetail'

const mockDetail = vi.fn()
const mockComments = vi.fn()

vi.mock('../../services/communityService', () => ({
  communityService: { detail: mockDetail },
}))

vi.mock('../../services/commentService', () => ({
  commentService: { list: mockComments, create: vi.fn() },
}))

vi.mock('../../store/authStore', () => ({
  useAuthStore: (selector: any) => selector({ is_authenticated: true }),
}))

describe('Community detail', () => {
  it('renders detail and back button', async () => {
    mockDetail.mockResolvedValue({
      code: 0,
      data: { share_title: 'T1', share_description: 'D1', author: { username: 'U1' } },
    })
    mockComments.mockResolvedValue({ code: 0, data: [] })

    render(
      <MemoryRouter initialEntries={["/analysis/99"]}>
        <Routes>
          <Route path="/analysis/:id" element={<AnalysisDetail />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByText('T1')).toBeInTheDocument()
    expect(screen.getByText(/返回广场/)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/__tests__/CommunityDetail.test.tsx`
Expected: FAIL if detail not rendered or route mismatch.

**Step 3: Write minimal implementation**

```tsx
// Only if detail rendering logic does not update state; adjust to render title safely.
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/__tests__/CommunityDetail.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pages/__tests__/CommunityDetail.test.tsx src/pages/AnalysisDetail.tsx

git commit -m "test: cover community detail rendering"
```

### Task 6: 404 route coverage via router

**Files:**
- Create: `src/__tests__/router-404.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RouterProvider } from 'react-router-dom'
import { router } from '../router'

describe('Router 404', () => {
  it('renders 404 for unknown routes', async () => {
    window.history.pushState({}, '', '/unknown-route')
    render(<RouterProvider router={router} />)
    expect(await screen.findByText(/404/)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/router-404.test.tsx`
Expected: FAIL if router not configured for 404.

**Step 3: Write minimal implementation**

```tsx
// If missing 404 route, update router config to include NotFound fallback.
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/router-404.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/__tests__/router-404.test.tsx src/router.tsx

git commit -m "test: add router 404 regression"
```
