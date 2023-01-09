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
import './code-editor.scss'

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
      updateStyles('Default', post.theme).then(highlightAll).then(autoSize)
    }
    highlightAll()
  }, [])

  const { uid, displayName, displayHandle, photoUrl } = post.user

  return (
    <div class='post-form'>
      <div class='post'>
        <header class='header flex flex-row'>
          <Link
            to={`/@/${uid}`}
            style={{
              marginRight: 8
            }}>
            <img class='avatar' src={photoUrl!} alt={displayName} referrerpolicy='no-referrer' />
          </Link>

          <div class='flex-column'>
            <div className='meta flex-row'>
              <span>
                <Link class='author' to={`/@/${uid}`}>
                  {displayName} {displayHandle}
                </Link>
              </span>
              <span class='sep mx1'>{`•`}</span>
              <span>{ago(post.created, false)}</span>
            </div>
            <div class='title'>
              {post.title && <h4 class='title'>{post.title || 'Untitled'}</h4>}
            </div>
          </div>
        </header>

        <p>{post.description}</p>

        <div
          id='code-background'
          style={{ background: 'transparent', padding: 0, position: 'relative' }}>
          {/* <div class='flex flex-justify-center'>
            <h5 className='title'>{post.title}</h5>
          </div> */}

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
        </div>
      </div>
    </div>
  )
}

function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text)
}
