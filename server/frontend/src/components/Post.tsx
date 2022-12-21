import { Link, useLoaderData } from 'react-router-dom'
import { getPost, getPosts, TPost } from '../common/requests'
import { CodeEditor } from './CodeEditor'

export async function postLoader({ params }: any) {
  if (!params.post_id) return {}
  return getPost(params.post_id)
}

export async function postsLoader({ params }: any) {
  const posts = await getPosts()
  return posts
}

export function Post() {
  const post = useLoaderData() as TPost
  return (
    <div className='container'>
      <CodeEditor post={post} />
    </div>
  )
}

export function PostsList() {
  const posts = useLoaderData() as TPost[]
  return (
    <ul>
      {posts.map((p) => {
        return (
          <li>
            <Link to={`/posts/${p.id}`}>{p.title}</Link>
          </li>
        )
      })}
    </ul>
  )
}
