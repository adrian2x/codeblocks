import escape from 'escape-html'
// @ts-expect-error
import { ago } from 'time-ago'
import { useEffect, useState } from 'preact/hooks'
import { useLoaderData, Link } from 'react-router-dom'
import { getPost, TPost } from '../../common/requests'
import { currentUser } from '../../stores/uiState'
import { autoSize, CodeEditor, generateGradient, updateStyles } from './CodeEditor'
import { RouteProps } from '../../types'
import './post.scss'

export async function postLoader({ params }: RouteProps) {
  if (params.post_id) {
    return getPost(params.post_id)
  }
}

export function Post() {
  const post = useLoaderData() as TPost
  const isEditor = !post || post?.user.uid === currentUser.value?.uid
  return (
    <div className='container'>
      {isEditor ? <CodeEditor post={post} /> : <ReadOnlyPost post={post} />}
    </div>
  )
}

export function ReadOnlyPost({ post }: { post: TPost }) {
  const [background, setBackground] = useState(generateGradient())
  let hljs = import('highlight.js/es/common').then((module) => module.default)
  let highlightAll = () => hljs.then((hljs) => hljs.highlightAll())

  useEffect(() => {
    autoSize()
    if (post.theme && post.theme != 'Default') {
      updateStyles('Default', post.theme).then(highlightAll)
    }
    highlightAll()
  }, [])

  return (
    <div class='post-form'>
      <div class='post-header'>
        <div>
          <h4 class='title m0'>{post.title || 'Untitled'}</h4>
          <div class='details'>
            <span>
              <Link to={`/@/${post.user.uid}`}>{post.user.displayName ?? 'Anonymous'}</Link>
            </span>
            <span class='sep'>{`  •  `}</span>
            <span>{ago(post.created)}</span>
          </div>
        </div>

        <p>{post.description}</p>

        <div id='code-background' style={{ background: background[0] }}>
          <div class='flex flex-justify-center'>
            <h5 className='title'>{post.title}</h5>
          </div>

          <div id='code-window' class='code-window hljs'>
            <div className='window-title'>
              <div className='buttons flex'>
                <div className='btn-1'></div>
                <div className='btn-2'></div>
                <div className='btn-3'></div>
              </div>
              <div>
                <button
                  className='outline dark'
                  onClick={(e) => {
                    let target = e.currentTarget
                    copyToClipboard(post.code).then(() => {
                      target.innerText = 'Copied'
                    })
                  }}>
                  Copy
                </button>
              </div>
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
            <Avatar
              photoUrl={post.user.photoUrl}
              displayHandle={post.user.displayHandle}
              displayName={post.user.displayName}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function Avatar({
  photoUrl,
  displayHandle,
  displayName
}: {
  photoUrl?: string | null
  displayHandle: string
  displayName?: string
}) {
  return (
    <div className='flex items-center'>
      <div className='avatar-container'>
        <img
          class='avatar drop-shadow-4'
          src={photoUrl ?? `https://www.gravatar.com/avatar/?d=mp&s=48`}
          alt={displayHandle ?? ''}
          referrerpolicy='no-referrer'
        />
      </div>
      <div>
        {displayName && <div className='author text-shadow'>{displayName}</div>}
        <small className='secondary text-shadow'>{displayHandle}</small>
      </div>
    </div>
  )
}

function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text)
}
