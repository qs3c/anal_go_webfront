import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'
import Home from './pages/Home'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />, // Or Navigate to /community later
      },
      {
        path: 'community',
        element: <Home />, // Placeholder
      },
      {
        path: 'workspace',
        element: <div>Workspace (Protected)</div>, // Placeholder
      },
      {
        path: 'login',
        element: <div>Login Page</div>, // Placeholder
      },
      {
        path: 'register',
        element: <div>Register Page</div>, // Placeholder
      },
      {
        path: '*',
        element: <div>404 Not Found</div>,
      },
    ],
  },
])
