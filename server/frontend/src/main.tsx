import { render } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { App } from './app'
import ErrorPage from './routes/errorPage'
import { Post, postLoader, PostsList, postsLoader } from './components/Post'
import './index.scss'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: ErrorPage,
    children: [
      {
        path: '',
        element: <PostsList />,
        loader: postsLoader
      },
      {
        path: 'post',
        element: <Post />
      },
      {
        path: 'posts/:post_id',
        element: <Post />,
        loader: postLoader
      }
    ]
  }
])

render(<RouterProvider router={router} />, document.getElementById('app') as HTMLElement)
