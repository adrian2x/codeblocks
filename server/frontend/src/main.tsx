import { render } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { App } from './app'
import ErrorPage from './routes/errorPage'
import { Post } from './components/Post'
import './index.scss'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: ErrorPage,
    children: [
      {
        path: 'post',
        element: <Post />,
        errorElement: ErrorPage
      },
      {
        path: 'posts/:post_id',
        element: <Post />,
        errorElement: ErrorPage
      }
    ]
  }
])

render(<RouterProvider router={router} />, document.getElementById('app') as HTMLElement)
