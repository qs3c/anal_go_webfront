# Phase 3: Workspace & Analysis Features Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the core workspace features: project analysis management, creation flow, real-time progress tracking, and editor integration.

**Architecture:**
- **Pages:** Workspace, AnalysisEditor, AnalysisProgress
- **Components:** AnalysisList, AnalysisCard, CreateModal, Progress
- **State:** useAnalysisStore
- **API:** analysisService, wsService

---

### Task 1: Analysis Services & Store

**Files:**
- Create: `src/services/analysisService.ts`
- Create: `src/services/wsService.ts`
- Create: `src/store/analysisStore.ts`
- Create: `src/hooks/useWebSocket.ts`

**Step 1: Implement analysisService**
CRUD operations for analyses, share/unshare, and job status check.

**Step 2: Implement wsService**
WebSocket class with reconnection logic and typed message handling.

**Step 3: Implement analysisStore**
Zustand store for managing the list of analyses and current analysis state.

**Step 4: Implement useWebSocket Hook**
React hook to connect/disconnect and handle progress messages.

**Step 5: Commit**
`git add .`
`git commit -m "feat(analysis): add services, store and websocket hook"`

---

### Task 2: Workspace & Analysis List

**Files:**
- Create: `src/components/Workspace/AnalysisCard.tsx`
- Create: `src/components/Workspace/AnalysisList.tsx`
- Modify: `src/pages/Workspace.tsx` (Implement real content)

**Step 1: Implement AnalysisCard**
Display analysis details (title, status, meta info) and actions (Edit, Delete).

**Step 2: Implement AnalysisList**
Fetch data using `analysisService`, handle loading/empty states, render grid of cards.

**Step 3: Implement Workspace Page**
Layout with "Create" button, quota info (mock or real), and `AnalysisList`.

**Step 4: Commit**
`git add .`
`git commit -m "feat(workspace): implement analysis list and workspace page"`

---

### Task 3: Create Analysis Flow

**Files:**
- Create: `src/components/Workspace/CreateModal.tsx`
- Create: `src/components/Workspace/ConfigForm.tsx`

**Step 1: Implement ConfigForm**
Form for AI analysis configuration (Repo URL, Depth, Model).

**Step 2: Implement CreateModal**
Tabs for "AI Analysis" vs "Manual Create". Handle submission via `analysisService`.

**Step 3: Integrate into Workspace**
Add "New Analysis" button to open modal.

**Step 4: Commit**
`git add .`
`git commit -m "feat(workspace): implement create analysis modal"`

---

### Task 4: Real-time Progress Page

**Files:**
- Create: `src/pages/AnalysisProgress.tsx`
- Create: `src/components/Workspace/Progress.tsx`

**Step 1: Implement Progress Component**
Visual progress bar and step logs.

**Step 2: Implement AnalysisProgress Page**
Use `useWebSocket` to listen for updates. Handle completion (redirect to editor) and failure.

**Step 3: Update Router**
Add route `/analysis/:id/progress`.

**Step 4: Commit**
`git add .`
`git commit -m "feat(analysis): implement real-time progress page"`

---

### Task 5: Editor Integration & Auto-Save

**Files:**
- Create: `src/pages/AnalysisEditor.tsx`
- Create: `src/hooks/useAutoSave.ts`
- Create: `src/utils/ossLoader.ts`

**Step 1: Implement ossLoader**
Utility to fetch and unzip diagram data (using `pako`).

**Step 2: Implement useAutoSave**
Hook to periodic save diagram data.

**Step 3: Implement AnalysisEditor Page**
Load data, render `Editor` component, handle save/share actions.

**Step 4: Update Router**
Add route `/analysis/:id`.

**Step 5: Commit**
`git add .`
`git commit -m "feat(editor): implement editor page with auto-save"`
