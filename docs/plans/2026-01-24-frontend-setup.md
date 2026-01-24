# Frontend Infrastructure Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Initialize the Go Analyzer Frontend project with React, TypeScript, Vite, and basic infrastructure directly in the current directory.

**Architecture:**
- **Build Tool:** Vite
- **Framework:** React 18 + TypeScript
- **UI Library:** Ant Design
- **State Management:** Zustand
- **Routing:** React Router v6
- **HTTP Client:** Axios with Interceptors
- **Style:** CSS Modules / Global CSS

---

### Task 1: Project Initialization & Configuration

**Files:**
- Create: `package.json` (via init)
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `.eslintrc.cjs`
- Create: `.prettierrc`

**Step 1: Initialize Vite Project**
Run: `npm create vite@latest . -- --template react-ts`
*Note: Since the directory is not empty (has md files), we might need to ignore the warning or use a specific flag, but usually '.' works if it doesn't conflict.*

**Step 2: Install Dependencies**
Run: `npm install`
Run: `npm install antd @ant-design/icons zustand axios react-router-dom dayjs clsx`
Run: `npm install -D less @types/node`

**Step 3: Configure Vite (Path Aliases)**
Modify: `vite.config.ts` to support `@/` alias mapping to `src/`.

**Step 4: Configure TypeScript**
Modify: `tsconfig.json` to add `"baseUrl": "."` and `"paths": { "@/*": ["src/*"] }`.

**Step 5: Configure Linter & Formatter**
Create: `.prettierrc` with spec config.
Modify: `.eslintrc.cjs` to match spec rules.

**Step 6: Commit**
`git add .`
`git commit -m "chore: init project with vite, ts, antd and basic config"`

---

### Task 2: Directory Structure & Basic Layout

**Files:**
- Create: `src/components/Layout/MainLayout.tsx`
- Create: `src/components/Layout/Header.tsx`
- Create: `src/components/Layout/Footer.tsx`
- Create: `src/pages/Home.tsx`
- Create: `src/router.tsx`

**Step 1: Create Directory Structure**
Run: `mkdir -p src/components/{Layout,Auth,Workspace,Community,Common} src/pages src/services src/store src/hooks src/types src/utils src/styles src/assets`

**Step 2: Create Layout Components**
Implement `Header.tsx` with logo and placeholder nav.
Implement `Footer.tsx`.
Implement `MainLayout.tsx` using Ant Design `Layout`.

**Step 3: Create Router Configuration**
Implement `src/router.tsx`.
Add root route `/`.

**Step 4: Update Entry Point**
Modify: `src/main.tsx` to use `RouterProvider`.

**Step 5: Verify**
Run: `npm run build` to check for type errors.

**Step 6: Commit**
`git add .`
`git commit -m "feat: add project structure and basic layout"`

---

### Task 3: State Management & API Infrastructure

**Files:**
- Create: `src/services/api.ts`
- Create: `src/store/authStore.ts`
- Create: `src/types/index.ts`
- Create: `src/types/api.ts`

**Step 1: Define Types**
Implement `src/types/index.ts` and `api.ts`.

**Step 2: Implement Axios Instance**
Implement `src/services/api.ts` (Base URL, Interceptors).

**Step 3: Implement Auth Store**
Implement `src/store/authStore.ts` (Zustand).

**Step 4: Verify**
Create temporary test file.

**Step 5: Commit**
`git add .`
`git commit -m "feat: setup axios client and auth store"`

---

### Task 4: Local Component Integration (struct_element)

**Files:**
- Copy from: `/Users/albert/Desktop/fromGithub/code_visualizer`
- To: `src/components/Workspace/Editor/`

**Step 1: Analyze Local Source**
List files in source directory.

**Step 2: Copy & Adapt**
Copy relevant files to `src/components/Workspace/Editor`.

**Step 3: Install Missing Dependencies**
Install packages required by `struct_element`.

**Step 4: Verify Build**
Run `npm run build`.

**Step 5: Commit**
`git add .`
`git commit -m "feat: integrate struct_element core components"`
