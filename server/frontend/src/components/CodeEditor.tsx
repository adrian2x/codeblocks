// @ts-expect-error
import domtoimage from 'dom-to-image-more'
import escape from 'escape-html'
import highlight from 'highlight.js/es/common'
import { useEffect, useRef, useState } from 'react'
import { createPost, TPost, updatePost } from '../common/requests'
import { useStore } from '../hooks/useStore'
import { user } from '../stores/uiState'
import { Dropdown } from './Dropdown'
import './code-editor.scss'

export function CodeEditor({ post }: { post?: TPost }) {
  // Get editor preferences
  const [editorState, updateEditorState] = useStore('editorState', {
    theme: 'Default',
    watermark: 'avatar'
  })

  const setEditor = (obj: Object) => updateEditorState({ ...editorState, ...obj })

  // This is the initial post state
  const [postState, setPostState] = useState(
    post ?? {
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

  const textBox = useRef<HTMLTextAreaElement>(null)

  // Get signed in user
  const currentUser = user.value
  console.log('editor render', currentUser)

  useEffect(() => {
    // Load theme preferences
    if (editorState.theme !== 'Default') {
      updateStyles('Default', editorState.theme)
    }
  }, [])

  useEffect(() => {
    // Update highlighted when code changes
    highlight.highlightAll()
    // Get the code language detected by Highlightjs
    if (postState.code) {
      let matchLanguage = document.getElementById('code')!.className.match(/language-(.+)$/)
      let language = matchLanguage?.[1].toLowerCase()
      if (language !== 'undefined') setPost({ language })
    }
  }, [postState.code])

  useEffect(() => {
    // Update highlighted when language changes
    highlight.highlightAll()
  }, [postState.language])

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
                setEditor({ theme: nextTheme })
                updateStyles(theme, nextTheme)
              }}>
              <option value='Default'>
                <a href='#default'>Default</a>
              </option>

              <option>
                <a href='#Androidstudio' class=''>
                  Androidstudio
                </a>
              </option>

              <option>
                <a href='#Atom One Dark' class=''>
                  Atom One Dark
                </a>
              </option>

              <option>
                <a href='#Material'>Material</a>
              </option>

              <option>
                <a href='#Tomorrow Night'>Tomorrow Night</a>
              </option>

              <option>
                <a href='#Github'>Github</a>
              </option>

              <option>
                <a href='#Github Dark'>Github Dark</a>
              </option>

              <option>
                <a href='#Hybrid'>Hybrid</a>
              </option>

              <option>
                <a href='#Sublime' class=''>
                  Sublime
                </a>
              </option>

              <option>
                <a href='#Tokyo Night Dark' class=''>
                  Tokyo Night Dark
                </a>
              </option>

              <option>
                <a href='#Tomorrow Night Blue' class=''>
                  Tomorrow Night Blue
                </a>
              </option>

              <option>
                <a href='#Vs 2015' class=''>
                  Vs 2015
                </a>
              </option>

              <option>
                <a href='#Xcode' class=''>
                  Xcode
                </a>
              </option>
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
              <option value='c++'>C++</option>
              <option value='c#'>C#</option>
              <option value='objective-c'>Objective-C</option>
              <option value='plain text'>Plain text</option>
              <option value='ruby'>Ruby</option>
              <option value='shell session'>Shell session</option>
              <option value='go'>Go</option>
              <option value='java'>Java</option>
              <option value='php'>PHP</option>
              <option value='python'>Python</option>
              <option value='python repl'>Python REPL</option>
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
                  backgroundColor: background[2],
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
                    More{' '}
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                      class='ml-2 icon'>
                      <path
                        fill-rule='evenodd'
                        d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
                        clip-rule='evenodd'></path>
                    </svg>
                  </button>
                }>
                <div>
                  <div className='watermark'>
                    <label htmlFor=''>Watermark</label>
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
                </div>
              </Dropdown>
            </div>
          </div>

          <div class='flex items-baseline ml-auto'>
            <button class='outline' onClick={() => getScreenshot()}>
              Export
            </button>
            <button
              class='primary outline mr0'
              onClick={(e) => {
                if (post) {
                  return updatePost(post.id, postState)
                }
                createPost({
                  ...postState,
                  created: Date.now(),
                  user: {
                    uid: currentUser.uid,
                    photoUrl: currentUser?.photoURL,
                    displayName: editorState.displayName,
                    handleName: editorState.handleName
                  }
                })
              }}>
              Save
            </button>
          </div>
        </div>

        <div id='code-background' style={{ background: background[0] }}>
          <div class='flex flex-justify-center'>
            <h5 className='title' contentEditable>
              {postState.title}
            </h5>
          </div>

          <div id='code-window' class='code-window hljs'>
            <div className='flex buttons'>
              <div className='btn-1'></div>
              <div className='btn-2'></div>
              <div className='btn-3'></div>
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
                  onClick={(e) => {
                    textBox.current!.focus()
                  }}
                />

                <textarea
                  class='code-area hljs hljs'
                  ref={textBox}
                  placeholder='// Add your code here...'
                  onInput={(e) => {
                    let self = e.currentTarget
                    setPost({ code: self.value })
                    self.style.height = '15px'
                    self.style.height = self.scrollHeight + 'px'
                    self.style.width = self.scrollWidth + 'px'

                    let code = document.getElementById('code')!
                    code.style.width = '0'
                    code.style.width = self.scrollWidth + 'px'
                    let codeWindow = document.getElementById('code-window')!
                    codeWindow.style.width = '0'
                    codeWindow.style.width = self.scrollWidth + 36 + 'px'
                  }}
                  onKeyDown={(e) => {
                    // Handle TAB key as indent instead of focus
                    let that = e.currentTarget!
                    if (e.keyCode == 9 || e.which == 9) {
                      e.preventDefault()
                      var s = that.selectionStart
                      that.value =
                        that.value.substring(0, that.selectionStart) +
                        '\t' +
                        that.value.substring(that.selectionEnd)
                      that.selectionEnd = s + 1
                    }
                  }}
                  onPaste={(e) => {
                    // e.preventDefault()
                    // let text = e.clipboardData!.getData('text/plain')
                    // e.currentTarget.innerHTML = text
                    // setCode(text)
                  }}>
                  {postState.code}
                </textarea>
              </pre>
            </div>
          </div>

          <div className='credits flex justify-between'>
            <div className='avatar flex items-center' hidden={!editorState.watermark}>
              {currentUser && editorState.watermark === 'avatar' && (
                <img
                  class='drop-shadow-4'
                  src={post?.user.photoUrl ?? currentUser?.photoURL}
                  alt={currentUser?.displayName ?? ''}
                  referrerpolicy='no-referrer'
                />
              )}
              <div>
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
                    setEditor({ handleName: e.currentTarget.textContent })
                  }}>
                  {editorState.handleName ?? post?.user.handleName ?? 'your@email.com'}
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
function updateStyles(theme: string, nextTheme: string) {
  document.querySelector(`link[title="${nextTheme}"]`)!.removeAttribute('disabled')
  requestAnimationFrame(() => {
    document.querySelector(`link[title="${theme}"]`)!.setAttribute('disabled', 'disabled')
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
function getScreenshot(fileName = 'codeblocks.jpeg') {
  let node = document.getElementById('code-background')!
  domtoimage.toJpeg(node, { quality: 0.95 }).then((dataUrl: string) => {
    var link = document.createElement('a')
    link.download = fileName
    link.href = dataUrl
    link.click()
  })
}
