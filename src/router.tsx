import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import OAuthCallback from './pages/OAuthCallback'

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
        element: <Home />,
      },
      {
        path: 'workspace',
        element: <div>Workspace (Protected)</div>,
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
        element: <div>404 Not Found</div>,
      },
    ],
  },
])