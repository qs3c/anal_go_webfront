# Go 项目结构可视化分析平台 - 前端开发完整指南

> 本文档为前端开发的完整需求和技术规范

## ⚠️ 重要提醒

**在开始开发前，请务必先阅读《前后端对接规范文档》(integration-specification.md)！**

该文档定义了：
- 🔴 字段命名规范（snake_case，与后端保持一致）
- 🔴 日期时间格式（RFC3339）
- 🔴 枚举值定义（必须与后端一致）
- 🔴 错误码定义（必须与后端一致）
- 🔴 WebSocket 消息格式
- 🔴 API 接口契约

不遵守对接规范将导致前后端无法对接！

---

## 目录
- [一、项目概述](#一项目概述)
- [二、技术架构](#二技术架构)
- [三、页面设计](#三页面设计)
- [四、API 集成](#四api-集成)
- [五、核心功能实现](#五核心功能实现)
- [六、开发任务](#六开发任务)
- [七、开发规范](#七开发规范)

---

## 一、项目概述

### 1.1 项目背景

为 Go 开发者提供一个基于 AI 的项目结构分析和可视化平台的前端应用。

**核心功能：**
- 用户注册/登录（邮箱密码 + GitHub OAuth + 微信 OAuth）
- 工作区管理（我的分析项目）
- AI 自动分析配置和提交
- 实时分析进度展示
- 可视化编辑器（集成 struct_element）
- 社区广场（浏览、分享、互动）
- 评论系统

### 1.2 已有资源

**struct_element 项目：**
- GitHub: https://github.com/qs3c/struct_element
- 基于 Excalidraw 的可视化组件
- 支持三视图切换（Info/Fields/Methods）
- 支持框图绘制和编辑
- 数据格式：`visualizer_output.json`

**复用策略：**
- 直接集成 struct_element 的编辑器组件
- 使用相同的数据格式
- 添加 OSS 数据加载功能
- 添加自动保存功能

### 1.3 技术栈

**核心框架：**
- React 18 + TypeScript
- Vite (构建工具)
- React Router v6 (路由)

**UI 组件库：**
- Ant Design (主要 UI 组件)
- Ant Design Icons

**状态管理：**
- Zustand (轻量级状态管理)

**HTTP 与实时通信：**
- Axios (HTTP 客户端)
- WebSocket (原生 API)

**可视化：**
- struct_element (框图编辑器)
- Excalidraw (底层)

**工具库：**
- dayjs (日期处理)
- pako (gzip 解压)

---

## 二、技术架构

### 2.1 项目目录结构

```
go-analyzer-frontend/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── Layout/
│   │   │   ├── Header.tsx           # 顶部导航栏
│   │   │   ├── Footer.tsx           # 底部
│   │   │   └── Sidebar.tsx          # 侧边栏（可选）
│   │   ├── Auth/
│   │   │   ├── LoginForm.tsx        # 登录表单
│   │   │   ├── RegisterForm.tsx     # 注册表单
│   │   │   └── OAuthButtons.tsx     # OAuth 登录按钮
│   │   ├── Workspace/
│   │   │   ├── AnalysisList.tsx     # 分析列表
│   │   │   ├── AnalysisCard.tsx     # 分析卡片
│   │   │   ├── CreateModal.tsx      # 创建分析弹窗
│   │   │   ├── ConfigForm.tsx       # AI 分析配置表单
│   │   │   ├── Editor.tsx           # 编辑器组件（集成 struct_element）
│   │   │   ├── Progress.tsx         # 分析进度组件
│   │   │   └── ShareModal.tsx       # 分享弹窗
│   │   ├── Community/
│   │   │   ├── AnalysisGrid.tsx     # 分析网格
│   │   │   ├── CommunityCard.tsx    # 广场卡片
│   │   │   ├── DetailView.tsx       # 详情视图
│   │   │   ├── FilterBar.tsx        # 筛选栏
│   │   │   └── TagList.tsx          # 标签列表
│   │   ├── Comment/
│   │   │   ├── CommentList.tsx      # 评论列表
│   │   │   ├── CommentItem.tsx      # 评论项
│   │   │   ├── CommentInput.tsx     # 评论输入框
│   │   │   └── ReplyItem.tsx        # 回复项
│   │   └── Common/
│   │       ├── Loading.tsx          # 加载组件
│   │       ├── Empty.tsx            # 空状态
│   │       ├── ErrorBoundary.tsx    # 错误边界
│   │       └── ConfirmModal.tsx     # 确认弹窗
│   ├── pages/               # 页面组件
│   │   ├── Home.tsx                 # 首页/广场
│   │   ├── Login.tsx                # 登录页
│   │   ├── Register.tsx             # 注册页
│   │   ├── OAuthCallback.tsx        # OAuth 回调页
│   │   ├── Workspace.tsx            # 工作区
│   │   ├── AnalysisEditor.tsx       # 分析编辑器页
│   │   ├── AnalysisProgress.tsx     # 分析进度页
│   │   ├── Community.tsx            # 广场页
│   │   ├── AnalysisDetail.tsx       # 分析详情页
│   │   ├── Profile.tsx              # 个人信息页
│   │   └── NotFound.tsx             # 404 页
│   ├── services/            # API 服务
│   │   ├── api.ts                   # Axios 实例配置
│   │   ├── authService.ts           # 认证相关 API
│   │   ├── userService.ts           # 用户相关 API
│   │   ├── analysisService.ts       # 分析项目 API
│   │   ├── communityService.ts      # 广场相关 API
│   │   ├── commentService.ts        # 评论相关 API
│   │   └── wsService.ts             # WebSocket 服务
│   ├── store/               # 状态管理
│   │   ├── authStore.ts             # 认证状态
│   │   ├── analysisStore.ts         # 分析项目状态
│   │   ├── communityStore.ts        # 广场状态
│   │   └── uiStore.ts               # UI 状态
│   ├── hooks/               # 自定义 Hooks
│   │   ├── useAuth.ts               # 认证 Hook
│   │   ├── useWebSocket.ts          # WebSocket Hook
│   │   ├── useAnalysis.ts           # 分析相关 Hook
│   │   ├── useAutoSave.ts           # 自动保存 Hook
│   │   └── useDebounce.ts           # 防抖 Hook
│   ├── types/               # TypeScript 类型
│   │   ├── index.ts                 # 通用类型
│   │   ├── api.ts                   # API 类型
│   │   └── models.ts                # 数据模型
│   ├── utils/               # 工具函数
│   │   ├── constants.ts             # 常量定义
│   │   ├── helpers.ts               # 辅助函数
│   │   ├── storage.ts               # 本地存储
│   │   ├── format.ts                # 格式化函数
│   │   └── validator.ts             # 表单验证
│   ├── styles/              # 样式文件
│   │   ├── global.css               # 全局样式
│   │   ├── variables.css            # CSS 变量
│   │   └── animations.css           # 动画
│   ├── assets/              # 静态资源
│   │   ├── images/
│   │   └── icons/
│   ├── App.tsx              # 根组件
│   ├── main.tsx             # 入口文件
│   └── router.tsx           # 路由配置
├── public/
│   ├── favicon.ico
│   └── logo.png
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
├── .eslintrc.js
├── .prettierrc
└── README.md
```

### 2.2 路由配置

```typescript
// router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import OAuthCallback from './pages/OAuthCallback'
import Workspace from './pages/Workspace'
import AnalysisEditor from './pages/AnalysisEditor'
import AnalysisProgress from './pages/AnalysisProgress'
import Community from './pages/Community'
import AnalysisDetail from './pages/AnalysisDetail'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import { ProtectedRoute } from './components/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/community" replace />,
      },
      {
        path: 'community',
        element: <Community />,
      },
      {
        path: 'community/:id',
        element: <AnalysisDetail />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'auth/callback',
        element: <OAuthCallback />,
      },
      {
        path: 'workspace',
        element: (
          <ProtectedRoute>
            <Workspace />
          </ProtectedRoute>
        ),
      },
      {
        path: 'analysis/:id',
        element: (
          <ProtectedRoute>
            <AnalysisEditor />
          </ProtectedRoute>
        ),
      },
      {
        path: 'analysis/:id/progress',
        element: (
          <ProtectedRoute>
            <AnalysisProgress />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
```

### 2.3 状态管理 (Zustand)

**认证状态：**
```typescript
// store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token, user) => {
        localStorage.setItem('auth_token', token)
        set({ token, user, isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem('auth_token')
        set({ token: null, user: null, isAuthenticated: false })
      },
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
)
```

**分析项目状态：**
```typescript
// store/analysisStore.ts
import { create } from 'zustand'
import type { Analysis } from '../types'

interface AnalysisState {
  analyses: Analysis[]
  currentAnalysis: Analysis | null
  loading: boolean
  error: string | null
  setAnalyses: (analyses: Analysis[]) => void
  setCurrentAnalysis: (analysis: Analysis | null) => void
  addAnalysis: (analysis: Analysis) => void
  updateAnalysis: (id: number, updates: Partial<Analysis>) => void
  removeAnalysis: (id: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  analyses: [],
  currentAnalysis: null,
  loading: false,
  error: null,
  setAnalyses: (analyses) => set({ analyses }),
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  addAnalysis: (analysis) =>
    set((state) => ({
      analyses: [analysis, ...state.analyses],
    })),
  updateAnalysis: (id, updates) =>
    set((state) => ({
      analyses: state.analyses.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
      currentAnalysis:
        state.currentAnalysis?.id === id
          ? { ...state.currentAnalysis, ...updates }
          : state.currentAnalysis,
    })),
  removeAnalysis: (id) =>
    set((state) => ({
      analyses: state.analyses.filter((a) => a.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
```

---

## 三、页面设计

### 3.1 登录页 (Login.tsx)

**页面布局：**
```
┌─────────────────────────────────────┐
│                                      │
│          [Logo]                      │
│                                      │
│      欢迎来到 Go 结构分析平台        │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  邮箱: [_______________]     │   │
│  │  密码: [_______________]     │   │
│  │                              │   │
│  │  [登录]                      │   │
│  └──────────────────────────────┘   │
│                                      │
│  或者使用以下方式登录：              │
│  [GitHub 登录] [微信登录]            │
│                                      │
│  还没有账号？ [立即注册]             │
│                                      │
└─────────────────────────────────────┘
```

**功能点：**
- 邮箱密码登录
- GitHub OAuth 登录
- 微信 OAuth 登录（V1.1）
- 表单验证
- 登录成功跳转到工作区
- 记住登录状态

### 3.2 注册页 (Register.tsx)

**页面布局：**
```
┌─────────────────────────────────────┐
│          创建新账号                  │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  用户名: [_______________]   │   │
│  │  邮箱: [_______________]     │   │
│  │  密码: [_______________]     │   │
│  │  确认密码: [___________]     │   │
│  │                              │   │
│  │  [注册]                      │   │
│  └──────────────────────────────┘   │
│                                      │
│  已有账号？ [立即登录]               │
│                                      │
└─────────────────────────────────────┘
```

**功能点：**
- 用户名、邮箱、密码注册
- 实时验证（用户名格式、邮箱格式、密码强度）
- 注册成功提示查收验证邮件
- 邮箱验证后自动登录

### 3.3 工作区 (Workspace.tsx)

**页面布局：**
```
┌─────────────────────────────────────────────┐
│  Header: Logo | 工作区 | 广场 | [用户]      │
├─────────────────────────────────────────────┤
│                                              │
│  我的分析项目                                │
│  配额: 3/5 今日已用                          │
│                                              │
│  [+ 新建分析]  [搜索...]  [筛选▼]           │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ Gin 路由分析         [编辑] [删除]  │   │
│  │ AI分析 | 已完成 | 1小时前           │   │
│  │ 👁 100  👍 20  💬 5                 │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ Echo 中间件分析       [编辑] [删除] │   │
│  │ 手动创建 | 草稿 | 2天前             │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  [加载更多...]                               │
│                                              │
└─────────────────────────────────────────────┘
```

**功能点：**
- 显示配额使用情况
- 新建分析（弹窗）
- 搜索分析项目
- 筛选（按状态、类型）
- 编辑/删除分析
- 分页加载

### 3.4 创建分析弹窗 (CreateModal)

**AI 分析模式：**
```
┌─────────────────────────────────┐
│  创建分析                        │
├─────────────────────────────────┤
│  创建方式: ● AI分析 ○ 手动创建  │
│                                  │
│  项目名称: [_______________]     │
│  仓库地址: [_______________]     │
│  (仅支持公开仓库)                │
│                                  │
│  起始结构体: [___________]       │
│  分析深度: ━━━●━━━━ (3)         │
│            1  3  5  7  10        │
│                                  │
│  选择模型: [GPT-3.5 Turbo ▼]    │
│  ⚠️ 免费用户仅可使用基础模型     │
│                                  │
│  [取消]  [开始分析]              │
└─────────────────────────────────┘
```

**手动创建模式：**
```
┌─────────────────────────────────┐
│  创建分析                        │
├─────────────────────────────────┤
│  创建方式: ○ AI分析 ● 手动创建  │
│                                  │
│  项目名称: [_______________]     │
│  描述(可选): [___________]       │
│                                  │
│  [取消]  [创建]                  │
└─────────────────────────────────┘
```

**验证规则：**
- 项目名称：必填，1-200字符
- 仓库地址：必填，有效的 GitHub URL
- 起始结构体：必填
- 分析深度：1-10，受订阅级别限制
- 模型：必须在允许范围内

### 3.5 分析进度页 (AnalysisProgress.tsx)

**页面布局：**
```
┌─────────────────────────────────────┐
│  < 返回工作区                        │
├─────────────────────────────────────┤
│                                      │
│         分析中...                    │
│                                      │
│  [=========>          ] 60%         │
│                                      │
│  当前步骤:                           │
│  正在分析依赖关系                    │
│                                      │
│  已耗时: 1分45秒                     │
│                                      │
│  [取消分析]                          │
│                                      │
└─────────────────────────────────────┘
```

**功能点：**
- 实时显示当前步骤
- 显示已耗时间（实时更新）
- 支持取消分析
- 分析完成自动跳转到编辑器
- 分析失败显示错误信息

### 3.6 分析编辑器页 (AnalysisEditor.tsx)

**页面布局：**
```
┌────────────────────────────────────────────┐
│  < 返回 | Gin路由分析 | [保存] [分享]      │
├────────────────────────────────────────────┤
│                                             │
│         [Excalidraw Canvas]                │
│                                             │
│    (集成 struct_element 组件)               │
│                                             │
│                                             │
└────────────────────────────────────────────┘
```

**功能点：**
- 复用 struct_element 编辑器
- 从 OSS 加载框图数据
- 支持缩放、拖拽
- 支持编辑（添加/删除/修改元素）
- 自动保存（30秒间隔）
- 手动保存按钮
- 分享到广场

### 3.7 广场页 (Community.tsx)

**页面布局：**
```
┌──────────────────────────────────────────────┐
│  Header: Logo | 工作区 | 广场 | [用户]       │
├──────────────────────────────────────────────┤
│                                               │
│  Go 项目结构分析社区                          │
│                                               │
│  Tab: [最新] [最热]                           │
│  标签: [全部] [Web框架] [微服务] [数据库]    │
│                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌────┐   │
│  │ [卡片1]      │ │ [卡片2]      │ │... │   │
│  │ Gin路由分析  │ │ Echo中间件   │ │    │   │
│  │ @author      │ │ @dev2        │ │    │   │
│  │ 👁100 👍20   │ │ 👁50 👍10    │ │    │   │
│  │ 2小时前      │ │ 1天前        │ │    │   │
│  └──────────────┘ └──────────────┘ └────┘   │
│                                               │
│  [加载更多...]                                │
│                                               │
└──────────────────────────────────────────────┘
```

**功能点：**
- 最新/最热排序切换
- 标签筛选
- 卡片点击查看详情
- 无限滚动加载
- 响应式布局

### 3.8 分析详情页 (AnalysisDetail.tsx)

**页面布局：**
```
┌──────────────────────────────────────────────┐
│  < 返回广场                                   │
├──────────────────────────────────────────────┤
│  Gin 框架路由模块深度分析                    │
│  by @gopher  发布于 2小时前                  │
│  标签: [Web框架] [路由] [Gin]                │
│  [👍 点赞 20] [⭐ 收藏 5] [浏览 100]        │
├──────────────────────────────────────────────┤
│                                               │
│         [框图展示 - 只读模式]                 │
│                                               │
├──────────────────────────────────────────────┤
│  描述:                                        │
│  本分析详细探讨了 Gin 框架的路由实现...      │
│                                               │
├──────────────────────────────────────────────┤
│  评论 (5)                                     │
│  ┌────────────────────────────────────────┐  │
│  │ @user1: 分析得很好，学到了！           │  │
│  │   └─ @gopher: 谢谢支持！               │  │
│  │ 2小时前                                 │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  [发表评论...]                                │
│                                               │
└──────────────────────────────────────────────┘
```

**功能点：**
- 显示分析详情和作者信息
- 框图只读展示
- 点赞/收藏功能
- 浏览数统计
- 评论列表（含回复）
- 发表评论/回复
- 需登录才能互动
## 四、API 集成

### 4.1 Axios 配置

```typescript
// services/api.ts
import axios from 'axios'
import { message } from 'antd'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加 Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
  (response) => {
    // 返回 data 字段（后端统一响应格式）
    return response.data
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // 登录过期
          message.error('登录已过期，请重新登录')
          useAuthStore.getState().logout()
          window.location.href = '/login'
          break
        case 403:
          message.error('没有权限')
          break
        case 404:
          message.error('资源不存在')
          break
        case 500:
          message.error('服务器错误')
          break
        default:
          message.error(data?.message || '请求失败')
      }
    } else if (error.request) {
      message.error('网络错误，请检查网络连接')
    } else {
      message.error('请求配置错误')
    }

    return Promise.reject(error)
  }
)

export default api
```

### 4.2 认证服务

```typescript
// services/authService.ts
import api from './api'
import type { LoginRequest, RegisterRequest, LoginResponse } from '../types/api'

export const authService = {
  // 注册
  async register(data: RegisterRequest) {
    const res = await api.post<any, { data: { user_id: number } }>(
      '/auth/register',
      data
    )
    return res.data
  },

  // 登录
  async login(data: LoginRequest) {
    const res = await api.post<any, { data: LoginResponse }>('/auth/login', data)
    const { token, user } = res.data
    localStorage.setItem('auth_token', token)
    return { token, user }
  },

  // 登出
  async logout() {
    localStorage.removeItem('auth_token')
  },

  // 获取用户信息
  async getProfile() {
    const res = await api.get<any, { data: any }>('/user/profile')
    return res.data
  },

  // GitHub OAuth 登录
  githubLogin() {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/github`
  },

  // 微信 OAuth 登录
  wechatLogin() {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/wechat`
  },
}
```

### 4.3 用户服务

```typescript
// services/userService.ts
import api from './api'
import type { UpdateProfileRequest } from '../types/api'

export const userService = {
  // 更新用户信息
  async updateProfile(data: UpdateProfileRequest) {
    const res = await api.put('/user/profile', data)
    return res.data
  },

  // 上传头像
  async uploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const res = await api.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data
  },

  // 获取配额信息
  async getQuotaInfo() {
    const res = await api.get('/quota/info')
    return res.data
  },
}
```

### 4.4 分析服务

```typescript
// services/analysisService.ts
import api from './api'
import type {
  CreateAnalysisRequest,
  UpdateAnalysisRequest,
  AnalysisListParams,
  ShareRequest,
} from '../types/api'

export const analysisService = {
  // 获取我的分析列表
  async getMyAnalyses(params: AnalysisListParams) {
    const res = await api.get('/analyses', { params })
    return res.data
  },

  // 创建分析
  async createAnalysis(data: CreateAnalysisRequest) {
    const res = await api.post('/analyses', data)
    return res.data
  },

  // 获取分析详情
  async getAnalysis(id: number) {
    const res = await api.get(`/analyses/${id}`)
    return res.data
  },

  // 更新分析
  async updateAnalysis(id: number, data: UpdateAnalysisRequest) {
    const res = await api.put(`/analyses/${id}`, data)
    return res.data
  },

  // 删除分析
  async deleteAnalysis(id: number) {
    await api.delete(`/analyses/${id}`)
  },

  // 分享到广场
  async shareAnalysis(id: number, data: ShareRequest) {
    const res = await api.post(`/analyses/${id}/share`, data)
    return res.data
  },

  // 取消分享
  async unshareAnalysis(id: number) {
    await api.delete(`/analyses/${id}/share`)
  },

  // 获取任务状态
  async getJobStatus(id: number) {
    const res = await api.get(`/analyses/${id}/job-status`)
    return res.data
  },
}
```

### 4.5 社区服务

```typescript
// services/communityService.ts
import api from './api'
import type { CommunityParams, CommentRequest } from '../types/api'

export const communityService = {
  // 获取广场列表
  async getCommunityAnalyses(params: CommunityParams) {
    const res = await api.get('/community/analyses', { params })
    return res.data
  },

  // 获取广场分析详情
  async getDetail(id: number) {
    const res = await api.get(`/community/analyses/${id}`)
    return res.data
  },

  // 点赞
  async likeAnalysis(id: number) {
    const res = await api.post(`/analyses/${id}/like`)
    return res.data
  },

  // 取消点赞
  async unlikeAnalysis(id: number) {
    await api.delete(`/analyses/${id}/like`)
  },

  // 收藏
  async bookmarkAnalysis(id: number) {
    const res = await api.post(`/analyses/${id}/bookmark`)
    return res.data
  },

  // 取消收藏
  async unbookmarkAnalysis(id: number) {
    await api.delete(`/analyses/${id}/bookmark`)
  },

  // 获取评论列表
  async getComments(id: number, params: { page: number; page_size: number }) {
    const res = await api.get(`/analyses/${id}/comments`, { params })
    return res.data
  },

  // 发表评论
  async postComment(id: number, data: CommentRequest) {
    const res = await api.post(`/analyses/${id}/comments`, data)
    return res.data
  },

  // 删除评论
  async deleteComment(id: number) {
    await api.delete(`/comments/${id}`)
  },
}
```

### 4.6 WebSocket 服务

```typescript
// services/wsService.ts
import type { ProgressMessage } from '../types'

export class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectTimer: NodeJS.Timeout | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private onMessage: (msg: ProgressMessage) => void
  private onError?: (error: Event) => void
  private onClose?: () => void

  constructor(
    onMessage: (msg: ProgressMessage) => void,
    onError?: (error: Event) => void,
    onClose?: () => void
  ) {
    this.onMessage = onMessage
    this.onError = onError
    this.onClose = onClose
  }

  connect() {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      console.error('No auth token found')
      return
    }

    const wsURL = `${import.meta.env.VITE_WS_URL}/ws?token=${token}`

    try {
      this.ws = new WebSocket(wsURL)

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const msg: ProgressMessage = JSON.parse(event.data)
          this.onMessage(msg)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.onError?.(error)
      }

      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        this.onClose?.()
        this.scheduleReconnect()
      }
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000)

    console.log(`Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts})`)

    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, delay)
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}
```

---

## 五、核心功能实现

### 5.1 认证流程

```typescript
// hooks/useAuth.ts
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import type { LoginRequest, RegisterRequest } from '../types/api'

export const useAuth = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, login, logout } = useAuthStore()
  const [loading, setLoading] = useState(false)

  // 登录
  const handleLogin = async (data: LoginRequest) => {
    setLoading(true)
    try {
      const res = await authService.login(data)
      login(res.token, res.user)
      message.success('登录成功')
      navigate('/workspace')
    } catch (error) {
      console.error('Login failed:', error)
      // 错误已在拦截器处理
    } finally {
      setLoading(false)
    }
  }

  // 注册
  const handleRegister = async (data: RegisterRequest) => {
    setLoading(true)
    try {
      await authService.register(data)
      message.success('注册成功，请查收验证邮件')
      navigate('/login')
    } catch (error) {
      console.error('Register failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // 登出
  const handleLogout = () => {
    logout()
    authService.logout()
    message.success('已退出登录')
    navigate('/login')
  }

  // GitHub 登录
  const handleGitHubLogin = () => {
    authService.githubLogin()
  }

  // 微信登录
  const handleWeChatLogin = () => {
    authService.wechatLogin()
  }

  return {
    user,
    isAuthenticated,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
    handleGitHubLogin,
    handleWeChatLogin,
  }
}
```

**OAuth 回调页面：**
```typescript
// pages/OAuthCallback.tsx
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuthStore()

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      // 保存 token 并获取用户信息
      localStorage.setItem('auth_token', token)

      authService
        .getProfile()
        .then((user) => {
          login(token, user)
          navigate('/workspace')
        })
        .catch((error) => {
          console.error('Failed to get profile:', error)
          navigate('/login')
        })
    } else {
      navigate('/login')
    }
  }, [searchParams, login, navigate])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin size="large" tip="正在登录..." />
    </div>
  )
}
```

### 5.2 实时进度监听

```typescript
// hooks/useWebSocket.ts
import { useEffect, useState } from 'react'
import { message } from 'antd'
import { WebSocketService } from '../services/wsService'
import type { ProgressMessage } from '../types'

export const useWebSocket = (analysisId: number, onCompleted?: (ossURL: string) => void) => {
  const [progress, setProgress] = useState<ProgressMessage | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const ws = new WebSocketService(
      (msg) => {
        // 只处理当前分析的消息
        if (msg.data.analysis_id === analysisId) {
          setProgress(msg)

          if (msg.type === 'analysis_completed') {
            message.success('分析完成！')
            onCompleted?.(msg.data.diagram_oss_url!)
          } else if (msg.type === 'analysis_failed') {
            message.error(`分析失败: ${msg.data.error_message}`)
          }
        }
      },
      (error) => {
        console.error('WebSocket error:', error)
        setConnected(false)
      },
      () => {
        setConnected(false)
      }
    )

    ws.connect()
    setConnected(true)

    return () => {
      ws.disconnect()
    }
  }, [analysisId, onCompleted])

  return { progress, connected }
}
```

**进度页面组件：**
```typescript
// pages/AnalysisProgress.tsx
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Progress, Spin, message } from 'antd'
import { useWebSocket } from '../hooks/useWebSocket'
import { analysisService } from '../services/analysisService'

export default function AnalysisProgress() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const analysisId = parseInt(id!)

  const { progress, connected } = useWebSocket(analysisId, (ossURL) => {
    // 分析完成，跳转到编辑器
    navigate(`/analysis/${analysisId}`)
  })

  const handleCancel = async () => {
    try {
      await analysisService.deleteAnalysis(analysisId)
      message.info('已取消分析')
      navigate('/workspace')
    } catch (error) {
      console.error('Failed to cancel:', error)
    }
  }

  if (!connected) {
    return <Spin size="large" tip="正在连接..." />
  }

  if (!progress) {
    return <Spin size="large" tip="等待任务开始..." />
  }

  return (
    <div style={{ maxWidth: 600, margin: '100px auto', textAlign: 'center' }}>
      <h2>分析中...</h2>

      <div style={{ margin: '40px 0' }}>
        <Spin size="large" />
      </div>

      <div style={{ marginBottom: 20 }}>
        <strong>当前步骤:</strong>
        <div style={{ marginTop: 10, fontSize: 16 }}>
          {progress.data.current_step || '初始化...'}
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <strong>已耗时:</strong>
        <div style={{ marginTop: 10, fontSize: 16 }}>
          {formatElapsedTime(progress.data.elapsed_seconds || 0)}
        </div>
      </div>

      <Button danger onClick={handleCancel}>
        取消分析
      </Button>
    </div>
  )
}

function formatElapsedTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}分${secs}秒`
}
```

### 5.3 自动保存

```typescript
// hooks/useAutoSave.ts
import { useEffect, useRef } from 'react'
import { message } from 'antd'
import { analysisService } from '../services/analysisService'

export const useAutoSave = (
  analysisId: number,
  diagramData: any,
  interval = 30000 // 30秒
) => {
  const [isSaving, setIsSaving] = useState(false)
  const dataRef = useRef(diagramData)

  useEffect(() => {
    dataRef.current = diagramData
  }, [diagramData])

  useEffect(() => {
    if (!analysisId || !diagramData) return

    const timer = setInterval(async () => {
      if (!dataRef.current) return

      setIsSaving(true)
      try {
        await analysisService.updateAnalysis(analysisId, {
          diagram_data: dataRef.current,
        })
        console.log('Auto-saved at', new Date().toLocaleTimeString())
      } catch (error) {
        console.error('Auto-save failed:', error)
        // 不显示错误消息，避免打扰用户
      } finally {
        setIsSaving(false)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [analysisId, interval])

  const manualSave = async () => {
    if (!analysisId || !dataRef.current) return

    setIsSaving(true)
    try {
      await analysisService.updateAnalysis(analysisId, {
        diagram_data: dataRef.current,
      })
      message.success('保存成功')
    } catch (error) {
      console.error('Manual save failed:', error)
      message.error('保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  return { isSaving, manualSave }
}
```

### 5.4 OSS 数据加载

```typescript
// utils/ossLoader.ts
import pako from 'pako'

export async function loadDiagramFromOSS(ossURL: string): Promise<any> {
  try {
    // 1. 获取压缩数据
    const response = await fetch(ossURL)
    if (!response.ok) {
      throw new Error('Failed to fetch diagram')
    }

    const arrayBuffer = await response.arrayBuffer()

    // 2. 解压 gzip
    const decompressed = pako.ungzip(new Uint8Array(arrayBuffer), { to: 'string' })

    // 3. 解析 JSON
    const json = JSON.parse(decompressed)

    return json
  } catch (error) {
    console.error('Failed to load diagram:', error)
    throw error
  }
}
```

**编辑器页面：**
```typescript
// pages/AnalysisEditor.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Spin, message } from 'antd'
import { ArrowLeftOutlined, SaveOutlined, ShareAltOutlined } from '@ant-design/icons'
import { analysisService } from '../services/analysisService'
import { loadDiagramFromOSS } from '../utils/ossLoader'
import { useAutoSave } from '../hooks/useAutoSave'
import StructElementEditor from '../components/Workspace/Editor' // 集成 struct_element

export default function AnalysisEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const analysisId = parseInt(id!)

  const [analysis, setAnalysis] = useState<any>(null)
  const [diagramData, setDiagramData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const { isSaving, manualSave } = useAutoSave(analysisId, diagramData)

  // 加载分析详情和框图数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await analysisService.getAnalysis(analysisId)
        setAnalysis(data)

        if (data.diagram_oss_url) {
          const diagram = await loadDiagramFromOSS(data.diagram_oss_url)
          setDiagramData(diagram)
        }
      } catch (error) {
        message.error('加载失败')
        navigate('/workspace')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [analysisId, navigate])

  const handleShare = () => {
    // 打开分享弹窗
    // TODO: 实现分享弹窗
  }

  if (loading) {
    return <Spin size="large" fullscreen />
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部工具栏 */}
      <div style={{ padding: '10px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/workspace')}>
          返回
        </Button>
        <h3 style={{ flex: 1, margin: 0 }}>{analysis?.title}</h3>
        <Button
          icon={<SaveOutlined />}
          onClick={manualSave}
          loading={isSaving}
        >
          {isSaving ? '保存中...' : '保存'}
        </Button>
        <Button
          type="primary"
          icon={<ShareAltOutlined />}
          onClick={handleShare}
          disabled={analysis?.status !== 'completed'}
        >
          分享
        </Button>
      </div>

      {/* 编辑器区域 */}
      <div style={{ flex: 1 }}>
        <StructElementEditor
          data={diagramData}
          onChange={setDiagramData}
        />
      </div>
    </div>
  )
}
```

### 5.5 TypeScript 类型定义

```typescript
// types/index.ts

export interface User {
  id: number
  username: string
  email: string
  avatar_url: string
  bio: string
  subscription_level: 'free' | 'basic' | 'pro'
  email_verified: boolean
  created_at: string
}

export interface Analysis {
  id: number
  user_id: number
  title: string
  description: string
  creation_type: 'ai' | 'manual'
  repo_url?: string
  start_struct?: string
  analysis_depth?: number
  model_name?: string
  diagram_oss_url?: string
  diagram_size?: number
  status: 'draft' | 'pending' | 'analyzing' | 'completed' | 'failed'
  error_message?: string
  is_public: boolean
  view_count: number
  like_count: number
  comment_count: number
  bookmark_count: number
  created_at: string
  updated_at: string
}

export interface CommunityAnalysis extends Analysis {
  author: {
    id: number
    username: string
    avatar_url: string
    bio: string
  }
  tags: string[]
  share_title: string
  share_description: string
  shared_at: string
  user_interaction?: {
    liked: boolean
    bookmarked: boolean
  }
}

export interface Comment {
  id: number
  user: {
    id: number
    username: string
    avatar_url: string
  }
  content: string
  parent_id: number | null
  replies?: Comment[]
  created_at: string
}

export interface ProgressMessage {
  type: 'analysis_progress' | 'analysis_completed' | 'analysis_failed'
  data: {
    job_id: number
    analysis_id: number
    status?: string
    current_step?: string
    elapsed_seconds?: number
    diagram_oss_url?: string
    error_message?: string
  }
}

export interface QuotaInfo {
  subscription_level: 'free' | 'basic' | 'pro'
  daily_quota: number
  quota_used_today: number
  quota_remaining: number
  quota_reset_at: string
  subscription_expires_at: string | null
}

export interface Model {
  name: string
  display_name: string
  required_level: 'free' | 'basic' | 'pro'
  description: string
  speed: string
  quality: string
}
```

```typescript
// types/api.ts

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface CreateAnalysisRequest {
  title: string
  creation_type: 'ai' | 'manual'
  repo_url?: string
  start_struct?: string
  analysis_depth?: number
  model_name?: string
  diagram_data?: any
}

export interface UpdateAnalysisRequest {
  title?: string
  description?: string
  diagram_data?: any
}

export interface ShareRequest {
  share_title: string
  share_description?: string
  tags?: string[]
}

export interface AnalysisListParams {
  page?: number
  page_size?: number
  search?: string
  status?: string
}

export interface CommunityParams {
  page?: number
  page_size?: number
  sort?: 'latest' | 'hot'
  tags?: string
}

export interface CommentRequest {
  content: string
  parent_id?: number
}

export interface UpdateProfileRequest {
  username?: string
  bio?: string
}
```
## 六、开发任务

### Phase 1: 基础架构 (Week 1-2)

#### 项目初始化
- [ ] 使用 Vite 创建 React + TypeScript 项目
- [ ] 配置 ESLint + Prettier
- [ ] 配置路径别名 (@/)
- [ ] 安装依赖包

#### 路由和布局
- [ ] 配置 React Router v6
- [ ] 创建 Layout 组件
- [ ] 创建 Header/Footer
- [ ] 创建 ProtectedRoute 组件
- [ ] 配置路由守卫

#### 状态管理
- [ ] 配置 Zustand
- [ ] 创建 authStore
- [ ] 创建 analysisStore
- [ ] 创建 communityStore

#### API 集成
- [ ] 配置 Axios 实例
- [ ] 添加请求/响应拦截器
- [ ] 创建各个 Service 文件
- [ ] 错误处理封装

#### 通用组件
- [ ] Loading 组件
- [ ] Empty 组件
- [ ] ErrorBoundary
- [ ] ConfirmModal

---

### Phase 2: 认证与用户 (Week 2-3)

#### 登录注册
- [ ] 登录页面
- [ ] 注册页面
- [ ] 表单验证
- [ ] OAuth 登录按钮组件
- [ ] OAuth 回调页面

#### 用户功能
- [ ] 个人信息页面
- [ ] 头像上传
- [ ] 信息编辑
- [ ] 退出登录

#### 认证逻辑
- [ ] useAuth Hook
- [ ] Token 管理
- [ ] 登录状态持久化

---

### Phase 3: 工作区 (Week 3-4)

#### 分析列表
- [ ] AnalysisList 组件
- [ ] AnalysisCard 组件
- [ ] 搜索功能
- [ ] 状态筛选
- [ ] 分页加载

#### 创建分析
- [ ] CreateModal 组件
- [ ] AI 分析表单
  - [ ] 仓库 URL 验证
  - [ ] 起始结构体输入
  - [ ] 深度滑块
  - [ ] 模型选择下拉
- [ ] 手动创建表单
- [ ] 表单提交处理

#### 编辑器
- [ ] 集成 struct_element
- [ ] OSS 数据加载
- [ ] 编辑器组件封装
- [ ] 自动保存功能
- [ ] 手动保存按钮
- [ ] 工具栏实现

#### 分析进度
- [ ] Progress 页面
- [ ] WebSocket 集成
- [ ] 实时进度显示
- [ ] 取消分析功能
- [ ] 完成后跳转

#### 分享功能
- [ ] ShareModal 组件
- [ ] 标题/描述输入
- [ ] 标签选择
- [ ] 分享提交
- [ ] 取消分享

---

### Phase 4: 广场与社区 (Week 4-5)

#### 广场列表
- [ ] Community 页面
- [ ] CommunityCard 组件
- [ ] 最新/最热切换
- [ ] 标签筛选
- [ ] 无限滚动加载

#### 分析详情
- [ ] AnalysisDetail 页面
- [ ] 框图只读展示
- [ ] 作者信息展示
- [ ] 点赞按钮
- [ ] 收藏按钮
- [ ] 统计数据显示

#### 评论系统
- [ ] CommentList 组件
- [ ] CommentItem 组件
- [ ] ReplyItem 组件
- [ ] CommentInput 组件
- [ ] 发表评论
- [ ] 回复评论
- [ ] 删除评论
- [ ] 分页加载

---

### Phase 5: 优化与测试 (Week 5-6)

#### 性能优化
- [ ] React.lazy 懒加载路由
- [ ] 图片懒加载
- [ ] 防抖/节流优化
- [ ] memo 优化（必要时）
- [ ] 代码分割

#### 响应式设计
- [ ] 移动端适配（可选）
- [ ] 平板适配（可选）
- [ ] 桌面端优化

#### 用户体验
- [ ] 加载状态优化
- [ ] 错误提示优化
- [ ] 成功反馈
- [ ] 空状态提示
- [ ] 骨架屏（可选）

#### 测试
- [ ] 单元测试（关键组件）
- [ ] E2E 测试（可选）
- [ ] 浏览器兼容性测试

#### 文档
- [ ] README.md
- [ ] 组件文档
- [ ] API 文档
- [ ] 部署文档

---

## 七、开发规范

### 7.1 代码规范

**ESLint 配置：**
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
  }
}
```

**Prettier 配置：**
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

**命名规范：**
- 组件文件：PascalCase (UserProfile.tsx)
- 工具文件：camelCase (formatDate.ts)
- 类型文件：camelCase (user.types.ts)
- 常量：UPPER_SNAKE_CASE (API_BASE_URL)
- 组件：PascalCase (UserCard)
- 函数：camelCase (fetchUserData)
- 接口：PascalCase (UserData)

### 7.2 组件规范

**函数式组件：**
```typescript
// ✅ 推荐
interface Props {
  title: string
  onSubmit: (data: any) => void
}

export default function MyComponent({ title, onSubmit }: Props) {
  return <div>{title}</div>
}

// ❌ 不推荐
export default function MyComponent(props: any) {
  return <div>{props.title}</div>
}
```

**Props 类型定义：**
- 必须定义 Props 接口
- 避免使用 any 类型
- 使用可选属性而不是默认值（除非必要）

**组件职责：**
- 单一职责原则
- 大组件拆分为小组件
- 复用组件放在 components/
- 页面专用组件放在页面目录内

### 7.3 状态管理规范

**Zustand Store：**
```typescript
// ✅ 推荐 - 明确的状态和操作
interface UserState {
  user: User | null
  loading: boolean
  error: string | null
  fetchUser: () => Promise<void>
  updateUser: (data: Partial<User>) => void
}

// ❌ 不推荐 - 混乱的状态
interface State {
  data: any
  doSomething: () => void
}
```

**状态更新：**
- 使用不可变更新
- 避免直接修改状态
- 复杂逻辑放在 Service 层

### 7.4 样式规范

**优先级：**
1. 使用 Ant Design 组件默认样式
2. 使用 CSS-in-JS (styled-components / emotion)
3. 使用 CSS Modules
4. 全局样式最小化

**示例：**
```typescript
// 使用 Ant Design
import { Button, Card } from 'antd'

// 自定义样式
const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
}

export default function MyComponent() {
  return (
    <div style={styles.container}>
      <Card>
        <Button type="primary">提交</Button>
      </Card>
    </div>
  )
}
```

### 7.5 API 调用规范

**在组件中：**
```typescript
// ✅ 推荐 - 使用 Service
import { userService } from '../services/userService'

const handleUpdate = async () => {
  try {
    await userService.updateProfile(data)
    message.success('更新成功')
  } catch (error) {
    // 错误已在拦截器处理
  }
}

// ❌ 不推荐 - 直接使用 axios
import api from '../services/api'

const handleUpdate = async () => {
  await api.put('/user/profile', data)
}
```

**错误处理：**
- 全局错误在拦截器处理
- 特殊错误在组件中处理
- 使用 try-catch 包裹异步操作

### 7.6 性能优化规范

**懒加载：**
```typescript
// 路由懒加载
const Workspace = lazy(() => import('./pages/Workspace'))

<Suspense fallback={<Loading />}>
  <Workspace />
</Suspense>
```

**防抖节流：**
```typescript
// hooks/useDebounce.ts
import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

**Memo 优化：**
```typescript
// 仅在必要时使用
import { memo } from 'react'

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  // 复杂计算...
  return <div>{/* ... */}</div>
})
```

### 7.7 Git 规范

**分支命名：**
- feature/功能名
- bugfix/问题描述
- hotfix/紧急修复

**提交信息：**
```
feat: 添加用户登录功能
fix: 修复列表加载bug
docs: 更新README
style: 格式化代码
refactor: 重构分析服务
test: 添加用户测试
chore: 更新依赖
```

---

## 八、环境配置

### 8.1 环境变量

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_WS_URL=ws://localhost:8080/api/v1
```

```bash
# .env.production
VITE_API_BASE_URL=https://api.example.com/api/v1
VITE_WS_URL=wss://api.example.com/api/v1
```

### 8.2 依赖包

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "antd": "^5.12.0",
    "@ant-design/icons": "^5.2.0",
    "zustand": "^4.4.0",
    "axios": "^1.6.0",
    "dayjs": "^1.11.0",
    "pako": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/node": "^20.10.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0",
    "@vitejs/plugin-react": "^4.2.0",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.1.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

### 8.3 Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd', '@ant-design/icons'],
          'zustand-vendor': ['zustand'],
        },
      },
    },
  },
})
```

---

## 九、启动命令

### 9.1 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 格式化代码
npm run format
```

### 9.2 生产环境

```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

### 9.3 package.json 脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 十、关键注意事项

### 10.1 安全性
- 不要在前端存储敏感信息
- Token 仅存储在 localStorage，不要在 URL 或 cookie
- 所有用户输入都要验证
- 防止 XSS 攻击（使用 React 的内置防护）

### 10.2 性能
- 使用 React.lazy 和 Suspense 懒加载路由
- 大列表使用虚拟滚动（react-window）
- 图片使用懒加载
- API 请求防抖节流
- 避免不必要的重渲染

### 10.3 用户体验
- 加载状态明确（Spin / Skeleton）
- 错误提示友好（message / notification）
- 成功反馈及时
- 空状态有提示
- 表单验证实时反馈

### 10.4 可访问性
- 合理使用语义化标签
- 图片添加 alt 属性
- 按钮添加 aria-label（必要时）
- 键盘导航支持

### 10.5 浏览器兼容
- 支持现代浏览器（Chrome、Firefox、Safari、Edge）
- 不支持 IE
- 使用 Vite 的默认浏览器目标

---

## 十一、部署

### 11.1 构建优化

**环境变量：**
- 生产环境使用 .env.production
- API URL 指向生产服务器
- 启用生产模式

**构建命令：**
```bash
npm run build
```

**构建产物：**
- 输出目录：dist/
- 包含：index.html + assets/

### 11.2 部署方式

**Nginx 部署：**
```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/go-analyzer-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Docker 部署：**
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Vercel/Netlify 部署：**
- 连接 GitHub 仓库
- 设置构建命令：npm run build
- 设置输出目录：dist
- 配置环境变量

---

## 十二、故障排查

### 12.1 常见问题

**Token 失效：**
- 检查 Token 是否过期
- 检查拦截器是否正确设置
- 检查后端是否返回 401

**WebSocket 连接失败：**
- 检查 WS_URL 配置
- 检查后端 WebSocket 服务是否启动
- 检查 Token 是否有效

**OSS 数据加载失败：**
- 检查 OSS URL 是否有效
- 检查 CORS 配置
- 检查解压逻辑

**路由不工作：**
- 检查 BrowserRouter 是否正确配置
- 检查 Nginx 配置（try_files）

---

**文档版本**: v1.0  
**最后更新**: 2025-01-20  
**维护者**: Frontend Team

祝开发顺利！ 🚀
