import { Link, useLoaderData } from 'react-router-dom'
import { getPosts, TPost } from '../../common/requests'

export async function postsLoader({ params }: any) {
  const posts = await getPosts()
  return posts
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
