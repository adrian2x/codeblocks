import { render } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { App } from './app'
import lazy from './common/preact-lazy'
import { postLoader } from './components/posts/Post'
import { userProfileLoader } from './components/users/ProfilePage'
import './index.scss'
import ErrorPage from './routes/errorPage'

const PostLazy = lazy(() => import('./components/posts/Post'))
const ProfileLazy = lazy(() => import('./components/users/ProfilePage'))
const PostsLazy = lazy(() => import('./components/posts/PostList'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: ErrorPage,
    children: [
      {
        path: 'post/:post_id',
        element: <PostLazy key={Math.random()} />,
        loader: postLoader
      },
      {
        path: 'post',
        element: <PostLazy key={Math.random()} />
      },
      {
        path: '@/:user_id',
        element: <ProfileLazy />,
        loader: userProfileLoader
      },
      {
        path: 'saved',
        element: <ProfileLazy defaultSaved={true} />,
        loader: userProfileLoader
      },
      {
        path: 'explore',
        element: <PostsLazy key='explore' />
      },
      {
        path: '',
        element: <PostsLazy key='home' />
      }
    ]
  }
])

render(<RouterProvider router={router} />, document.body)
