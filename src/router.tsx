import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import OAuthCallback from './pages/OAuthCallback'
import Profile from './pages/Profile'
import Workspace from './pages/Workspace'
import Community from './pages/Community'
import NotFound from './pages/NotFound'

const AnalysisDetail = lazy(() => import('./pages/AnalysisDetail'))
const AnalysisProgress = lazy(() => import('./pages/AnalysisProgress'))
const AnalysisEditor = lazy(() => import('./pages/AnalysisEditor'))

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<div style={{ padding: 24 }}>加载中...</div>}>
    {element}
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'community',
        element: <Community />,
      },
      {
        path: 'community/:id',
        element: withSuspense(<AnalysisDetail />),
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
            {withSuspense(<AnalysisEditor />)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'analysis/:id/progress',
        element: (
          <ProtectedRoute>
            {withSuspense(<AnalysisProgress />)}
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
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
