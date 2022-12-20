import { useState, useRef, useEffect } from 'react'
import highlight from 'highlight.js/es/common'
import { useStore } from '../hooks/useStore'
import { request } from '../common/requests'
import { Dropdown } from './Dropdown'

export function CodeEditor() {
  const [postState, setPostState] = useState({
    title: '',
    description: '',
    code: '',
    language: ''
  })

  const setPost = (obj: Object) => setPostState({ ...postState, ...obj })

  const [user, setUser] = useState<firebase.default.User | null>(null)

  const [editorState, updateEditorState] = useStore('editorState', {
    theme: 'Default',
    watermark: 'avatar'
  })

  const setEditor = (obj: Object) => updateEditorState({ ...editorState, ...obj })

  const [background, setBackground] = useState(generateGradient())

  const textBox = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') ?? ''))
    if (editorState.theme !== 'Default') {
      updateStyles('Default', editorState.theme)
    }
  }, [])

  useEffect(() => {
    highlight.highlightAll()
    let matchLanguage = document.getElementById('code')!.className.match(/language-(.*)\s?/)
    let language = matchLanguage?.[1].toLowerCase()
    if (language && language !== 'undefined') {
      setPost({ language })
    } else {
      setPost({ language: '' })
    }
  }, [postState.code])

  async function onSubmit() {
    if (user) {
      request(`${user.uid}/posts/`, {
        ...postState,
        watermark: editorState.watermark,
        displayName: editorState.displayName,
        handleName: editorState.handleName
      })
    }
  }

  return (
    <div class='post-form'>
      <div class='post-header'>
        <div>
          <h4 class='m0'>
            <input
              class='clear'
              type='text'
              placeholder='Title'
              style={{ margin: 0, fontWeight: 700 }}
              onBlur={(e) => setPost({ title: e.currentTarget.value })}
            />
          </h4>
        </div>
        <div>
          <textarea
            class='clear mb1'
            placeholder='Add a nice description'
            style={{ lineHeight: 1.6 }}
            onBlur={(e) => {
              setPost({ description: e.currentTarget.value })
            }}></textarea>
        </div>

        <div class='toolbar mb1'>
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

          <div class='flex ml-auto items-baseline'>
            <button
              class='outline'
              onClick={async () => {
                // Download
              }}>
              Export
            </button>
            <button class='primary outline mr0' onClick={onSubmit}>
              Save
            </button>
          </div>
        </div>

        <div className='code-background' style={{ background: background[0] }}>
          <div class='code-window hljs drop-shadow-4'>
            <div className='flex buttons'>
              <div className='btn-1'></div>
              <div className='btn-2'></div>
              <div className='btn-3'></div>
            </div>

            <div className='code-wrapper'>
              <pre>
                <code
                  id='code'
                  class={postState.code ? 'hljs' : ''}
                  dangerouslySetInnerHTML={{ __html: postState.code }}
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
                    setPost({ code: escape(self.value) })
                    self.style.height = '0'
                    self.style.height = self.scrollHeight + 'px'
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
              {user && (
                <img
                  hidden={editorState.watermark !== 'avatar'}
                  class='drop-shadow-4'
                  src={user?.photoURL ?? `https://www.gravatar.com/avatar/?d=mp&s=190`}
                  alt={user?.displayName ?? ''}
                  referrerpolicy='no-referrer'
                />
              )}
              <div>
                {user && (
                  <div
                    className='author text-shadow'
                    contentEditable
                    onBlur={(e) => {
                      setEditor({ displayName: e.currentTarget.textContent })
                    }}>
                    {editorState.displayName ?? user?.displayName}
                  </div>
                )}
                <small
                  className='secondary text-shadow'
                  contentEditable
                  onBlur={(e) => {
                    setEditor({ handleName: e.currentTarget.textContent })
                  }}>
                  {editorState.handleName ?? 'your@email.com'}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function escape(s: string) {
  return s.replace(/[^0-9A-Za-z ]/g, (c) => '&#' + c.charCodeAt(0) + ';')
}

function updateStyles(theme: string, nextTheme: string) {
  // Load the theme styles
  document.querySelector(`link[title="${nextTheme}"]`)!.removeAttribute('disabled')
  requestAnimationFrame(() => {
    document.querySelector(`link[title="${theme}"]`)!.setAttribute('disabled', 'disabled')
  })
}

function generateGradient() {
  let deg = Math.floor(Math.random() * 360)
  let from = createHex(),
    to = createHex()
  return [`linear-gradient(${deg}deg, ${from}, ${to})`, from, to]
}

function createHex() {
  var hexCode1 = ''
  var hexValues1 = '0123456789abcdef'

  for (var i = 0; i < 6; i++) {
    hexCode1 += hexValues1.charAt(Math.floor(Math.random() * hexValues1.length))
  }
  return '#' + hexCode1
}
