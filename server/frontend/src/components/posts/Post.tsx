import escape from 'escape-html'
import highlight from 'highlight.js/es/common'
import { useEffect, useState } from 'preact/hooks'
import { useLoaderData } from 'react-router-dom'
import { getPost, TPost } from '../../common/requests'
import { user } from '../../stores/uiState'
import { CodeEditor, generateGradient } from '../CodeEditor'

export async function postLoader({ params }: any) {
  if (params.post_id) {
    return getPost(params.post_id)
  }
}

export function Post() {
  const post = useLoaderData() as TPost
  const isEditor = !post || post?.user.uid === user.value?.uid
  return (
    <div className='container'>
      {isEditor ? <CodeEditor post={post} /> : <ReadOnlyPost post={post} />}
    </div>
  )
}

export function ReadOnlyPost({ post }: { post: TPost }) {
  const [background, setBackground] = useState(generateGradient())

  useEffect(() => highlight.highlightAll(), [])

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
