import { render } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { App } from './app'
import ErrorPage from './routes/errorPage'
import { Post, postLoader } from './components/posts/Post'
import { PostsList, postsLoader } from './components/posts/PostList'
import './index.scss'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: ErrorPage,
    children: [
      {
        path: '',
        element: <PostsList key={Math.random()} />,
        loader: postsLoader
      },
      {
        path: 'post',
        element: <Post key={Math.random()} />
      },
      {
        path: 'posts/:post_id',
        element: <Post key={Math.random()} />,
        loader: postLoader
      }
    ]
  }
])

render(<RouterProvider router={router} />, document.getElementById('app') as HTMLElement)
