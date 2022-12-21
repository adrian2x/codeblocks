import { Link, useLoaderData } from 'react-router-dom'
import escape from 'escape-html'
import { getPost, getPosts, TPost } from '../common/requests'
import { CodeEditor, generateGradient } from './CodeEditor'
import { user } from '../stores/uiState'
import { useState } from 'preact/hooks'

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
  const isOwner = user.value?.uid === post?.user.uid
  return (
    <div className='container'>
      {isOwner ? <CodeEditor post={post} /> : <ReadOnlyPost post={post} />}
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

export function ReadOnlyPost({ post }: { post: TPost }) {
  const [background, setBackground] = useState(generateGradient())

  return (
    <div class='post-form'>
      <div class='post-header'>
        <div>
          <h4 class='title m0'>{post.title}</h4>
        </div>

        <p>{post.description}</p>

        <div id='code-background' style={{ background: background[0] }}>
          <div class='flex flex-justify-center'>
            <h5 className='title'>{post.title}</h5>
          </div>

          <div id='code-window' class='code-window hljs'>
            <div className='flex buttons'>
              <div className='btn-1'></div>
              <div className='btn-2'></div>
              <div className='btn-3'></div>
            </div>

            <div className='code-wrapper'>
              <pre class={`${post.language ?? ''}`}>
                <code
                  id='code'
                  class={`hljs ${post.language}`}
                  dangerouslySetInnerHTML={{ __html: escape(post.code) }}
                />
              </pre>
            </div>
          </div>

          <div className='credits flex justify-between'>
            <div className='avatar flex items-center'>
              {post.user.photoUrl && (
                <img
                  class='drop-shadow-4'
                  src={post.user.photoUrl}
                  alt={post.user.displayName ?? ''}
                  referrerpolicy='no-referrer'
                />
              )}
              <div>
                <div className='author text-shadow'>{post.user.displayName}</div>
                <small className='secondary text-shadow'>{post.user.handleName}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
