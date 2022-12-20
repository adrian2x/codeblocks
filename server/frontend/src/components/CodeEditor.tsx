import { useState, useRef, useEffect } from 'react'
import highlight from 'highlight.js/es/common'
import { useStore } from '../hooks/useStore'
import { request } from '../common/requests'
import { Dropdown } from './Dropdown'

export function CodeEditor() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [code, setCode] = useState('')

  const [user, setUser] = useState<firebase.default.User | null>(null)

  const [editorState, updateEditorState] = useStore('editorState', {
    theme: 'Default',
    watermark: 'avatar',
    showAvatar: true
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
    console.log('language', matchLanguage?.[1])
  }, [code])

  return (
    <div class='post-form'>
      <div>
        <div>
          <h4 class='m0'>
            <input
              class='clear'
              type='text'
              placeholder='Title'
              style={{ margin: 0, fontWeight: 700 }}
              onInput={(e) => setTitle(e.currentTarget.value)}
            />
          </h4>
        </div>
        <div>
          <textarea
            class='clear mb1'
            placeholder='Add a nice description'
            style={{ lineHeight: 1.6 }}
            onInput={(e) => setDescription(e.currentTarget.value)}></textarea>
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
            <select class='field' title='Language'>
              <option value=''>Auto</option>
              <option value='Bash'>Bash</option>
              <option value='CSS'>CSS</option>
              <option value='SCSS'>SCSS</option>
              <option value='HTML'>HTML</option>
              <option value='XML'>XML</option>
              <option value='Kotlin'>Kotlin</option>
              <option value='Markdown'>Markdown</option>
              <option value='R'>R</option>
              <option value='SQL'>SQL</option>
              <option value='C'>C</option>
              <option value='C++'>C++</option>
              <option value='C#'>C#</option>
              <option value='Objective-C'>Objective-C</option>
              <option value='Plain text'>Plain text</option>
              <option value='Ruby'>Ruby</option>
              <option value='Shell session'>Shell session</option>
              <option value='Go'>Go</option>
              <option value='Java'>Java</option>
              <option value='PHP'>PHP</option>
              <option value='Python'>Python</option>
              <option value='Python REPL'>Python REPL</option>
              <option value='Rust'>Rust</option>
              <option value='Swift'>Swift</option>
              <option value='JSON'>JSON</option>
              <option value='JavaScript'>JavaScript</option>
              <option value='TypeScript'>TypeScript</option>
              <option value='Makefile'>Makefile</option>
              <option value='TOML'>TOML</option>
              <option value='YAML'>YAML</option>
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
            <button
              class='primary outline mr0'
              onClick={async () => {
                if (user) {
                  request(`${user.uid}/posts/`, {
                    title,
                    description,
                    code,
                    showWatermark: editorState.showWatermark ? true : undefined
                  })
                }
              }}>
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
                  class={code ? 'hljs' : ''}
                  dangerouslySetInnerHTML={{ __html: code }}
                  onClick={(e) => {
                    textBox.current!.focus()
                  }}></code>

                <textarea
                  class='clear'
                  ref={textBox}
                  placeholder='// Add your code here...'
                  onInput={(e) => {
                    let self = e.currentTarget
                    setCode(escape(self.value))
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
                  {code}
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
                  <div className='author text-shadow' contentEditable>
                    {user?.displayName}
                  </div>
                )}
                <small className='secondary text-shadow' contentEditable>
                  {'your@email.com'}
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
