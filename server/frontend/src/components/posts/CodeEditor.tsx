import { debounce } from 'atomic-fns'
import domtoimg from 'dom-to-image-more'
import escape from 'escape-html'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { currentUser } from '../../common/firebase'
import { createPost, deletePost, updatePost } from '../../common/requests'
import { useStore } from '../../hooks/useStore'
import { FirebaseUser, TPost } from '../../types'
import { Dropdown } from '../Dropdown'
import { PhotoUploader, uploadImage } from '../users/PhotoUploader'

export const autoSize = debounce(() => {
  let code = document.getElementById('code')!
  code.style.width = '0'
  code.style.width = code.scrollWidth + 2 + 'px'
  const codeWindow = document.getElementById('code-window')!
  if (code.style.width == '2px') code.style.width = 'auto'
  codeWindow.style.width = '0'
  codeWindow.style.width = code.scrollWidth + 36 + 'px'
  codeWindow.style.minWidth = '16ch'
  codeWindow.style.maxWidth = '80ch'
  return codeWindow
}, 50)

export function CodeEditor({ post }: { post?: TPost }) {
  // import highlightjs module
  let hljs = import('highlight.js/es/common').then((module) => module.default)
  let highlightAll = () => hljs.then((hljs) => hljs.highlightAll())

  // Get editor preferences
  const [editorState, updateEditorState] = useStore('editorState', {
    fontSize: 20,
    background: true,
    showTitle: true,
    theme: post?.theme ?? 'Default',
    watermark: 'avatar'
  })

  const setEditor = (obj: Object) => updateEditorState({ ...editorState, ...obj })

  const codeInputRef = useRef<any>()

  // This is the initial post state
  const [postState, setPostState] = useState(
    post ?? {
      id: undefined,
      title: '',
      description: '',
      code: '',
      language: '',
      windowTitle: 'Untitled'
    }
  )

  useEffect(() => {
    if (post?.id) setPostState(post)
  }, [post])

  const setPost = (obj: Object) => setPostState({ ...postState, ...obj })

  // The code background gradient colors
  const [background, setBackground] = useState(generateGradient())

  const [isSaving, setSaving] = useState(false)

  useEffect(() => {
    autoSize()
    // Load theme preferences
    if (editorState.theme) {
      updateStyles(editorState.theme).then(highlightAll).then(autoSize)
    }
    highlightAll().then(autoSize)
  }, [post])

  useEffect(() => {
    // Update highlighted when code changes
    highlightAll().then(() => {
      if (postState.code) {
        // Get the code language detected by Highlightjs
        let matchLanguage = document.getElementById('code')!.className.match(/language-(.+)$/)
        let language = matchLanguage?.[1].toLowerCase()
        if (language !== 'undefined') setPost({ language })
      } else {
        setPost({ language: '' })
      }
      autoSize()
    })
  }, [postState.code, post])

  useEffect(() => {
    // Update highlighted when language changes
    highlightAll().then(autoSize)
  }, [postState.language, post])

  // Update the window size when font size changes
  useEffect(() => {
    autoSize()
  }, [editorState.fontSize])

  useEffect(() => {
    autoSize()
  }, [])

  async function handleSubmit(e: any) {
    setSaving(true)
    // Let's save some state for later...
    let { id, code, title, description } = postState
    setEditor({ code, title, description })
    let request = onSubmit(id, currentUser.value, postState, editorState)
      .then((value) => value && setPostState(value))
      .finally(() => setSaving(false))
    // Update the ui to show pending message
    toast.promise(request, {
      loading: 'Saving???',
      success: 'Your post was saved!',
      error: 'There was an error'
    })
  }

  const navigate = useNavigate()

  function handleDelete(e: any) {
    setSaving(true)
    toast
      .promise(deletePost(post!.id), {
        loading: 'Deleting???',
        success: 'Your post was deleted.',
        error: 'There was an error'
      })
      .then(() => {
        navigate('/')
      })
      .finally(() => {
        setSaving(false)
      })
  }

  return (
    <div class='post-form'>
      <div class='post-header'>
        <div>
          <h4 class='title m0'>
            <input
              class='clear font-bold'
              type='text'
              placeholder='Title'
              value={postState.title}
              onBlur={(e) => setPost({ title: e.currentTarget.value })}
            />
          </h4>
        </div>
        <div>
          <textarea
            class='clear mb1'
            placeholder={`Add notes using markdown...`}
            value={postState.description}
            style={{ lineHeight: 1.6, overflow: 'auto' }}
            rows={3}
            onBlur={(e) => {
              setPost({ description: e.currentTarget.value })
            }}></textarea>
        </div>

        <div class='toolbar'>
          <div>
            <select
              title='Font size'
              value={editorState.fontSize ?? 20}
              onChange={(e) => {
                let fontSize = parseInt(e.currentTarget.value)
                setEditor({ fontSize })
              }}>
              <option value={16}>16</option>
              <option value={18}>18</option>
              <option value={19}>19</option>
              <option value={20}>20</option>
              <option value={21}>21</option>
              <option value={22}>22</option>
              <option value={23}>23</option>
              <option value={24}>24</option>
              <option value={25}>25</option>
              <option value={28}>28</option>
              <option value={30}>30</option>
              <option value={32}>32</option>
            </select>
          </div>

          <div>
            <select
              class='field'
              title='Theme'
              value={editorState.theme}
              onChange={(e: any) => {
                let nextTheme = e.currentTarget.value
                updateStyles(nextTheme)
                setEditor({ theme: nextTheme })
              }}>
              <option value='Default'>
                <a href='#default'>Default</a>
              </option>

              <option value='Androidstudio'>Androidstudio</option>

              <option value='Atom One Dark'>Atom One</option>

              <option value='Material'>Material</option>

              <option value='Github'>Github</option>
              <option value='Github Dark'>Github Dark</option>

              <option value='Hybrid'>Hybrid</option>

              <option value='Tokyo Night Dark'>Tokyo Night</option>

              <option value='Tomorrow Night Blue'>Tomorrow Night</option>

              <option value='Vs 2015'>Vs 2015</option>

              <option value='Xcode'>Xcode</option>
            </select>
          </div>

          <div>
            <select
              class='field'
              title='Language'
              value={postState.language}
              onChange={(e) => {
                setPost({ language: e.currentTarget.value })
              }}>
              <option default value=''>
                Auto
              </option>
              <option value='bash'>Bash</option>
              <option value='css'>CSS</option>
              <option value='scss'>SCSS</option>
              <option value='html'>HTML</option>
              <option value='xml'>XML</option>
              <option value='kotlin'>Kotlin</option>
              <option value='markdown'>Markdown</option>
              <option value='r'>R</option>
              <option value='sql'>SQL</option>
              <option value='c'>C</option>
              <option value='cpp'>C++</option>
              <option value='csharp'>C#</option>
              <option value='objectivec'>Objective-C</option>
              <option value='plaintext'>Plain text</option>
              <option value='ruby'>Ruby</option>
              <option value='shell'>Shell</option>
              <option value='powershell'>PowerShell</option>
              <option value='go'>Go</option>
              <option value='java'>Java</option>
              <option value='php'>PHP</option>
              <option value='python'>Python</option>
              <option value='python-repl'>Python REPL</option>
              <option value='rust'>Rust</option>
              <option value='swift'>Swift</option>
              <option value='json'>JSON</option>
              <option value='javascript'>JavaScript</option>
              <option value='typescript'>TypeScript</option>
              <option value='makefile'>Makefile</option>
              <option value='toml'>TOML</option>
              <option value='yaml'>YAML</option>
            </select>
          </div>

          <div class='flex items-center'>
            <button
              class='icon-only outline'
              style={{ padding: '0.1rem' }}
              onClick={() => setBackground(generateGradient())}>
              <div
                style={{
                  background: background[0],
                  width: '1.6rem',
                  height: '1.6rem',
                  borderRadius: 4
                }}
              />
            </button>
            <div class='mr2'>
              <Dropdown
                modal
                target={
                  <button class='outline'>
                    More
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      aria-hidden='true'
                      class='ml-2 icon'
                      fill='none'
                      viewBox='0 0 20 20'>
                      <path
                        stroke='currentColor'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        stroke-width='1.5'
                        d='M6 8l4 4 4-4'
                      />
                    </svg>
                  </button>
                }>
                <div className='watermark'>
                  <label>Watermark</label>
                  <label>
                    <input
                      type='radio'
                      value='avatar'
                      radioGroup='watermark'
                      checked={editorState.watermark === 'avatar'}
                      onChange={(e) => {
                        setEditor({ watermark: e.currentTarget.value })
                      }}
                    />{' '}
                    Avatar
                  </label>
                  <label>
                    <input
                      type='radio'
                      value='simple'
                      radioGroup='watermark'
                      checked={editorState.watermark === 'simple'}
                      onChange={(e) => {
                        setEditor({ watermark: e.currentTarget.value })
                      }}
                    />{' '}
                    Simple
                  </label>
                  <label>
                    <input
                      type='radio'
                      value=''
                      radioGroup='watermark'
                      checked={editorState.watermark === ''}
                      onChange={(e) => {
                        setEditor({ watermark: '' })
                      }}
                    />{' '}
                    Hide
                  </label>
                </div>

                <div>
                  <label>Background</label>
                  <label>
                    <input
                      type='checkbox'
                      checked={editorState.background}
                      onChange={(e) => {
                        setEditor({ background: !!!editorState.background })
                      }}
                    />{' '}
                    Color
                  </label>
                  <label>
                    <input
                      type='checkbox'
                      checked={editorState.showTitle}
                      onChange={(e) => {
                        setEditor({ showTitle: !editorState.showTitle })
                      }}
                    />{' '}
                    Title
                  </label>
                </div>
              </Dropdown>
            </div>
          </div>

          <div class='flex items-baseline'>
            {post?.id && (
              <button
                className='outline'
                disabled={isSaving}
                title='Delete'
                onClick={() => {
                  if (window.confirm('Do you really want to delete this post?')) {
                    handleDelete(post!.id)
                  }
                }}>
                &nbsp;
                <FaTrash />
                &nbsp;
              </button>
            )}

            <button class='outline' onClick={() => getScreenshot(true)}>
              Export
            </button>
            <button
              class='primary outline mr0'
              disabled={isSaving || !currentUser.value}
              onClick={handleSubmit}>
              Save
            </button>
          </div>
        </div>

        <div
          id='code-background'
          style={{
            background: editorState.background ? background[0] : 'transparent',
            fontSize: editorState.fontSize ?? 20
          }}>
          <div class='flex flex-column flex-1 justify-center'>
            <div class='flex flex-justify-center'>
              <h5
                className='title'
                aria-hidden={!editorState.showTitle}
                contentEditable
                onBlur={(e) => {
                  setEditor({ title: e.currentTarget.innerText })
                }}>
                {postState.title}
              </h5>
            </div>

            <div id='code-window' class='code-window hljs'>
              <div className='window-title'>
                <div className='flex buttons'>
                  <div className='btn-1'></div>
                  <div className='btn-2'></div>
                  <div className='btn-3'></div>
                </div>
                <div
                  class='label'
                  contentEditable
                  onBlur={(e) => {
                    setPost({ windowTitle: e.currentTarget.innerText })
                  }}>
                  {postState.windowTitle ?? 'Untitled'}
                </div>
              </div>

              <div className='code-wrapper'>
                <pre class={`${postState.language ?? ''}`}>
                  <code
                    id='code'
                    ref={codeInputRef}
                    class={
                      postState.code
                        ? `hljs ${postState.language ? 'language-' + postState.language : ''}`
                        : ''
                    }
                    dangerouslySetInnerHTML={{ __html: escape(postState.code) }}
                    contentEditable
                    onFocus={(e) => autoSize()}
                    onBlur={(e) => {
                      const self = e.currentTarget
                      const code = self.innerText.replace(/\n\n\n/gm, '\n\n')
                      setPost({ code: code })
                      if (code.trim()) autoSize()
                    }}
                    onInput={() => {
                      autoSize()
                    }}
                  />
                </pre>
              </div>
            </div>
          </div>

          <div className='credits flex justify-between'>
            <div className='flex items-center' hidden={!editorState.watermark}>
              {currentUser.value && editorState.watermark === 'avatar' && (
                <PhotoUploader
                  fileName={currentUser.value.uid}
                  value={editorState.photoUrl ?? post?.user.photoUrl ?? currentUser.value?.photoURL}
                  altText={editorState?.displayName ?? currentUser.value.displayName}
                  allowEditing
                  onUpdate={(url) => {
                    setEditor({ photoUrl: url })
                  }}
                />
              )}
              <div class='text-white'>
                {currentUser.value && (
                  <div
                    className='author text-shadow'
                    contentEditable
                    onBlur={(e) => {
                      setEditor({ displayName: e.currentTarget.textContent })
                    }}>
                    {editorState.displayName ??
                      post?.user.displayName ??
                      currentUser.value?.displayName}
                  </div>
                )}
                <small
                  className='secondary text-shadow'
                  contentEditable
                  onBlur={(e) => {
                    setEditor({ displayHandle: e.currentTarget.textContent })
                  }}>
                  {editorState.displayHandle ?? post?.user.displayHandle ?? 'codeblocks.cloud'}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Load the theme styles dynamically */
export function updateStyles(nextTheme: string) {
  document
    .querySelectorAll(`link[href*="highlight.js/"]`)
    .forEach((link) => link.setAttribute('disabled', 'disabled'))
  return new Promise((resolve, reject) => {
    let link = document.querySelector(`link[title="${nextTheme}"]`) as HTMLLinkElement
    if (link) {
      link.onload = resolve
      link.onerror = reject
      link.removeAttribute('disabled')
    }
  })
}

/** Returns a tuple with the background gradient and color stops */
export function generateGradient() {
  let deg = Math.floor(Math.random() * 360)
  let from = createHex(),
    to = createHex()
  return [`linear-gradient(${deg}deg, ${from}, ${to})`, from, to]
}

/**
 * Random hexadecimal code value.
 */
function createHex() {
  var hexCode1 = ''
  var hexValues1 = '0123456789abcdef'

  for (var i = 0; i < 6; i++) {
    hexCode1 += hexValues1.charAt(Math.floor(Math.random() * hexValues1.length))
  }
  return '#' + hexCode1
}

/**
 * Generates the code preview screenshot from the editor.
 */
async function getScreenshot(download = false, fileName = 'codeblocks.png') {
  let dataUrl = await domtoimg.toPng(setImageSize('code-background', 1.333)[0])
  if (download) {
    var link = document.createElement('a')
    link.download = fileName
    link.href = dataUrl
    link.click()
  }
  return dataUrl
}

async function onSubmit(
  postId: string | undefined,
  currentUser: FirebaseUser,
  postState: Partial<TPost>,
  editorState: any
) {
  if (!currentUser) return false
  let response = await (postId
    ? updatePost(postId, postState)
    : createPost({
        ...postState,
        created: Date.now(),
        theme: editorState.theme,
        user: {
          uid: currentUser.uid,
          photoUrl: currentUser.photoURL,
          displayName: editorState.displayName,
          displayHandle: editorState.displayHandle
        }
      }))

  if (response.id) {
    // Upload the code screenshot
    await saveScreenshot(response.id + '@1.33')
    saveScreenshot(response.id, 1.91)
  }
  return response
}

function setImageSize(id: string, ratio = 1.91): [HTMLElement, number, number] {
  let node = document.getElementById(id)!
  let width = node.clientWidth
  let height = node.clientHeight
  if (width < height * ratio) {
    let newWidth = Math.ceil(height * ratio)
    node.style.width = `${newWidth}px`
  } else {
    let newHeight = Math.ceil(width / ratio)
    node.style.height = `${newHeight}px`
  }
  return [node, width, height]
}

async function saveScreenshot(name: string, ratio = 1.33) {
  let [node, prevW, prevH] = setImageSize('code-background', ratio)
  let blob = await domtoimg.toBlob(node)
  node.style.width = `${prevW}px`
  node.style.height = `${prevH}px`
  return uploadImage(`${name}.png`, blob)
}
