import { useState, useRef, useEffect } from 'react'
import highlight from 'highlight.js/es/common'
import { useStore } from '../hooks/useStore'
import { request } from '../common/requests'

export function CodeEditor() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [code, setCode] = useState('')

  const [user, setUser] = useState<firebase.default.User | null>(null)

  const [editorState, updateEditorState] = useStore('editorState', {
    theme: 'Default',
    showWatermark: true,
    showAvatar: true
  })

  const setEditor = (obj: Object) => updateEditorState({ ...editorState, ...obj })

  const [background] = useState(generateGradient())

  const textBox = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') ?? ''))
    if (editorState.theme !== 'Default') {
      updateStyles('Default', editorState.theme)
    }
  }, [])

  useEffect(() => {
    highlight.highlightAll()
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
            class='clear'
            placeholder='Add a nice description'
            onInput={(e) => setDescription(e.currentTarget.value)}></textarea>
        </div>

        <div className='code-background' style={{ background }}>
          <div class='toolbar'>
            <div>
              <select
                class='styles'
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
              <label>
                <input
                  type='checkbox'
                  checked={editorState.showWatermark}
                  onChange={() => {
                    setEditor({ showWatermark: !editorState.showWatermark })
                  }}
                />{' '}
                Watermark
              </label>
            </div>
          </div>

          <div class='code-window hljs drop-shadow-4'>
            <div className='flex buttons'>
              <div className='btn-1'></div>
              <div className='btn-2'></div>
              <div className='btn-3'></div>
            </div>

            <div className='code-wrapper'>
              <pre>
                <code
                  class={code ? 'hljs' : ''}
                  id='code'
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
            <div className='avatar flex items-center' hidden={!editorState.showWatermark}>
              {user && (
                <img
                  class='drop-shadow-3'
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
                <small className='secondary' contentEditable>
                  your@email.com
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class='flex flex-row-reverse'>
        <button
          className='primary'
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
          Save it
        </button>
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
  return `linear-gradient(${deg}deg, ${createHex()}, ${createHex()})`
}

function createHex() {
  var hexCode1 = ''
  var hexValues1 = '0123456789abcdef'

  for (var i = 0; i < 6; i++) {
    hexCode1 += hexValues1.charAt(Math.floor(Math.random() * hexValues1.length))
  }
  return '#' + hexCode1
}
