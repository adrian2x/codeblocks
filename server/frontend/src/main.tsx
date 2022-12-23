import { render } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { App } from './app'
import ErrorPage from './routes/errorPage'
import { Post, postLoader } from './components/posts/Post'
import { PostsContainer, postsLoader } from './components/posts/PostList'
import { UserPage, userPostsLoader } from './components/users/UserPage'
import './index.scss'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: ErrorPage,
    children: [
      {
        path: '',
        element: <PostsContainer />,
        loader: postsLoader
      },
      {
        path: 'post',
        element: <Post key={Math.random()} />
      },
      {
        path: 'post/:post_id',
        element: <Post key={Math.random()} />,
        loader: postLoader
      },
      {
        path: '@/:user_id',
        element: <UserPage key={Math.random()} />,
        loader: userPostsLoader
      }
    ]
  }
])

render(<RouterProvider router={router} />, document.body)
