// @ts-expect-error
import domtoimage from 'dom-to-image-more'
import escape from 'escape-html'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createPost, deletePost, TPost, updatePost } from '../../common/requests'
import { useStore } from '../../hooks/useStore'
import { currentUser as userSignal } from '../../stores/uiState'
import { FirebaseUser } from '../../types'
import { Dropdown } from '../Dropdown'
import { PhotoUploader, uploadImage } from '../users/PhotoUploader'
import { FaTrash } from 'react-icons/fa'
import './code-editor.scss'

export function CodeEditor({ post }: { post?: TPost }) {
  // import highlightjs module
  let hljs = import('highlight.js/es/common').then((module) => module.default)
  let highlightAll = () => hljs.then((hljs) => hljs.highlightAll())

  // Get editor preferences
  const [editorState, updateEditorState] = useStore('editorState', {
    background: true,
    showTitle: true,
    theme: post?.theme ?? 'Default',
    watermark: 'avatar'
  })

  const setEditor = (obj: Object) => updateEditorState({ ...editorState, ...obj })

  // This is the initial post state
  const [postState, setPostState] = useState(
    post ?? {
      id: undefined,
      title: '',
      description: '',
      code: '',
      language: ''
    }
  )

  useEffect(() => {
    if (post?.id) setPostState(post)
  }, [post])

  const setPost = (obj: Object) => setPostState({ ...postState, ...obj })

  // The code background gradient colors
  const [background, setBackground] = useState(generateGradient())

  const [isSaving, setSaving] = useState(false)

  // Get signed in user
  const currentUser = userSignal.value

  useEffect(() => {
    autoSize()
    // Load theme preferences
    if (editorState.theme !== 'Default') {
      updateStyles('Default', editorState.theme)
    }
    highlightAll()
  }, [])

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
    })
  }, [postState.code])

  useEffect(() => {
    // Update highlighted when language changes
    hljs.then((hljs) => hljs.highlightAll())
  }, [postState.language])

  async function handleSubmit(e: any) {
    setSaving(true)
    // Let's save some state for later...
    let { id, code, title, description } = postState
    setEditor({ code, title, description })
    let request = onSubmit(id, currentUser, postState, editorState)
      .then((value) => value && setPostState(value))
      .finally(() => setSaving(false))
    // Update the ui to show pending message
    toast.promise(request, {
      loading: 'Saving…',
      success: 'Your post was saved!',
      error: 'There was an error'
    })
  }

  const navigate = useNavigate()

  function handleDelete(e: any) {
    setSaving(true)
    toast
      .promise(deletePost(post!.id), {
        loading: 'Deleting…',
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
            placeholder='Add a nice description'
            value={postState.description}
            style={{ lineHeight: 1.6 }}
            onBlur={(e) => {
              setPost({ description: e.currentTarget.value })
            }}></textarea>
        </div>

        <div class='toolbar'>
          <div>
            <select
              class='field'
              title='Theme'
              value={editorState.theme}
              onChange={(e: any) => {
                let theme = editorState.theme
                let nextTheme = e.currentTarget.value
                updateStyles(theme, nextTheme)
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
                      checked={!editorState.background}
                      onChange={(e) => {
                        setEditor({ background: !editorState.background })
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

          <div class='flex items-baseline ml-auto'>
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
              disabled={isSaving || !userSignal.value}
              onClick={handleSubmit}>
              Save
            </button>
          </div>
        </div>

        <div
          id='code-background'
          style={{ background: (editorState.background && 'transparent') || background[0] }}>
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
              <div class='label' contentEditable>
                Untitled
              </div>
            </div>

            <div className='code-wrapper'>
              <pre class={`${postState.language ?? ''}`}>
                <code
                  id='code'
                  class={
                    postState.code
                      ? `hljs ${postState.language ? 'language-' + postState.language : ''}`
                      : ''
                  }
                  dangerouslySetInnerHTML={{ __html: escape(postState.code) }}
                  contentEditable
                  onBlur={(e) => {
                    const self = e.currentTarget
                    const code = self.innerText.replace(/\n\n\n/gm, '\n\n')
                    setPost({ code: code })
                    if (code.trim()) autoSize()
                  }}
                />
              </pre>
            </div>
          </div>

          <div className='credits flex justify-between'>
            <div className='flex items-center' hidden={!editorState.watermark}>
              {currentUser && editorState.watermark === 'avatar' && (
                <PhotoUploader
                  fileName={currentUser.uid}
                  value={editorState.photoUrl ?? post?.user.photoUrl ?? currentUser?.photoURL}
                  altText={editorState?.displayName ?? currentUser.displayName}
                  allowEditing
                  onUpdate={(url) => {
                    setEditor({ photoUrl: url })
                  }}
                />
              )}
              <div class='text-white'>
                {currentUser && (
                  <div
                    className='author text-shadow'
                    contentEditable
                    onBlur={(e) => {
                      setEditor({ displayName: e.currentTarget.textContent })
                    }}>
                    {editorState.displayName ?? post?.user.displayName ?? currentUser?.displayName}
                  </div>
                )}
                <small
                  className='secondary text-shadow'
                  contentEditable
                  onBlur={(e) => {
                    setEditor({ displayHandle: e.currentTarget.textContent })
                  }}>
                  {editorState.displayHandle ?? post?.user.displayHandle ?? 'your@email.com'}
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
export function updateStyles(theme: string, nextTheme: string) {
  document
    .querySelectorAll(`link[href*="highlight.js/"]`)
    .forEach((link) => link.setAttribute('disabled', 'disabled'))
  return new Promise((resolve, reject) => {
    let link = document.querySelector(`link[title="${nextTheme}"]`) as HTMLLinkElement
    link.onload = resolve
    link.onerror = reject
    link.removeAttribute('disabled')
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

export function autoSize() {
  console.log('autosizing')
  let code = document.getElementById('code')!
  code.style.width = '0'
  code.style.width = code.scrollWidth + 'px'
  const codeWindow = document.getElementById('code-window')!
  if (code.style.width == '0px') code.style.width = 'auto'
  codeWindow.style.width = '0'
  codeWindow.style.width = code.scrollWidth + 36 + 'px'
  if (parseInt(codeWindow.style.width) < 170) {
    codeWindow.style.minWidth = '16ch'
  }
}

/**
 * Generates the code preview screenshot from the editor.
 */
async function getScreenshot(download = false, fileName = 'codeblocks.png') {
  let node = document.getElementById('code-background')!
  let dataUrl: string = await domtoimage.toPng(node)
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
          displayName: editorState.displayName || undefined,
          displayHandle: editorState.displayHandle
        }
      }))

  // Upload the code screenshot
  setTimeout(async () => {
    let node = document.getElementById('code-background')!
    let blob = await domtoimage.toBlob(node)
    let image = await uploadImage(`${response.id}.png`, blob)
    console.log('uploaded image', image.ref)
  })

  return response
}
