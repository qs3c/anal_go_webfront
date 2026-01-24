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
import AnalysisDetail from './pages/AnalysisDetail'
import AnalysisProgress from './pages/AnalysisProgress'
import AnalysisEditor from './pages/AnalysisEditor'
import NotFound from './pages/NotFound'

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
        element: <AnalysisDetail />,
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
