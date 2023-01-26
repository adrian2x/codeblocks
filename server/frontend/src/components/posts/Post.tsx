import escape from 'escape-html'
import { useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link, useLoaderData } from 'react-router-dom'
import { currentUser } from '../../common/firebase'
import { getPost } from '../../common/requests'
import { ago } from '../../common/time-ago'
import { RouteProps, TPost } from '../../types'
import './code-editor.scss'
import { autoSize, CodeEditor, updateStyles } from './CodeEditor'
import './post.scss'
import { PostActions } from './PostActions'

export async function postLoader({ params }: RouteProps) {
  if (params.post_id) {
    return getPost(params.post_id)
  }
}

export function postImageHref(id: string) {
  return `https://firebasestorage.googleapis.com/v0/b/codeblocks-991a2.appspot.com/o/${id}.png?alt=media`
}

export default function Post() {
  const post = useLoaderData() as TPost

  const isEditor = useMemo(() => {
    if (!post) return true
    if (currentUser.value) {
      let currentId = currentUser.value.uid
      if (currentId === post.user.uid) return true
      if (currentId === post.user.id) return true
    }
  }, [post, currentUser.value])

  return (
    <div className='container'>
      {isEditor ? <CodeEditor post={post} /> : <ReadOnlyPost post={post} />}
    </div>
  )
}

export function ReadOnlyPost({ post }: { post: TPost }) {
  let hljs = import('highlight.js/es/common').then((module) => module.default)
  let highlightAll = () => hljs.then((hljs) => hljs.highlightAll())

  // const [background, setBackground] = useState(generateGradient())

  useEffect(() => {
    autoSize()
    if (post.theme) {
      updateStyles(post.theme).then(highlightAll).then(autoSize)
    }
    highlightAll().then(autoSize)
  }, [post])

  const { uid, displayName, displayHandle, photoUrl } = post.user

  return (
    <div class='post-form' key={`post-${post.id}`}>
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

        <ReactMarkdown>{post.description}</ReactMarkdown>

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

        <PostActions post={post} />
      </div>
    </div>
  )
}

function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text)
}
