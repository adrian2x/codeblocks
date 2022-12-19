import { useState, useEffect, useRef } from 'react'
import highlight from 'highlight.js/es/common'
import './components/FirebaseAuth'

function Navbar() {
  return (
    <nav class='nav'>
      <div class='nav-start'>
        <a class='brand'>Codeblocks</a>
        <a class='active'>Link 1</a>
        <a>Link 2</a>
      </div>
      <div class='nav-end'>
        <a href=''>Sign in</a>
        <button className='primary'>Save</button>
      </div>
    </nav>
  )
}

export function App() {
  return (
    <div>
      <Navbar />
      <main className='container'>
        <PostCreate />
      </main>
    </div>
  )
}

export function PostCreate() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [code, setCode] = useState('')
  const [theme, setTheme] = useState('Default')
  const [isEditing, setEditing] = useState(true)
  const [user, setUser] = useState<firebase.default.User | null>(null)

  const textBox = useRef<HTMLTextAreaElement>(null)

  const onSubmit = () => {
    console.log('update', title, description, code)
  }

  function updateTheme(nextTheme: string) {
    setTheme(nextTheme)
    // Load the theme styles
    document.querySelector(`link[title="${nextTheme}"]`)!.removeAttribute('disabled')
    requestAnimationFrame(() => {
      document.querySelector(`link[title="${theme}"]`)!.setAttribute('disabled', 'disabled')
    })
  }

  function escape(s: string) {
    return s.replace(/[^0-9A-Za-z ]/g, (c) => '&#' + c.charCodeAt(0) + ';')
  }

  const onTheme = (e: any) => {
    let nextTheme = e.currentTarget.value
    updateTheme(nextTheme)
    localStorage.setItem('editorTheme', nextTheme)
  }

  useEffect(() => {
    updateTheme(localStorage.getItem('editorTheme') || 'Default')
    setUser(JSON.parse(localStorage.getItem('user') ?? ''))
  }, [])

  useEffect(() => {
    console.log('isEditing')
    if (isEditing) textBox.current?.focus()
    highlight.highlightAll()
  }, [isEditing, code])

  return (
    <div class='post-form'>
      <div>
        <div>
          <h4 class='mt2'>
            <input
              class='clear'
              type='text'
              placeholder='Title'
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

        <div className='code-background'>
          <div class='toolbar'>
            <div>
              <select class='styles' title='Theme' value={theme} onInput={onTheme}>
                <option value='Default'>
                  <a href='#default'>Default</a>
                </option>

                {/* <option>
                <a href='#A 11 Y Dark' class=''>
                  A11Y Dark
                </a>
              </option> */}

                {/* <option>
              <a href='#A 11 Y Light'>A 11 Y Light</a>
            </option>*/}

                {/* <option>
              <a href='#Agate' class=''>
                Agate
              </a>
            </option>*/}

                {/* <option>
              <a href='#An Old Hope' class=''>
                An Old Hope
              </a>
            </option>*/}

                {/* <option>
                <a href='#Androidstudio'>Androidstudio</a>
              </option> */}

                {/* <option>
              <a href='#Arduino Light'>Arduino Light</a>
            </option>*/}

                {/* <option>
              <a href='#Arta'>Arta</a>
            </option>*/}

                {/* <option>
              <a href='#Ascetic'>Ascetic</a>
            </option> */}

                <option>
                  <a href='#Atom One Dark' class=''>
                    Atom One Dark
                  </a>
                </option>

                {/* <option>
              <a href='#Atom One Dark Reasonable' class=''>
                Atom One Dark Reasonable
              </a>
            </option> */}

                {/* <option>
                <a href='#Atom One Light'>Atom One Light</a>
              </option> */}

                {/* <option>
              <a href='#Base16 / 3024'>Base16 / 3024</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Apathy'>Base16 / Apathy</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Apprentice' class=''>
                Base16 / Apprentice
              </a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Ashes'>Base16 / Ashes</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Cave' class=''>
                Base16 / Atelier Cave
              </a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Cave Light' class=''>
                Base16 / Atelier Cave Light
              </a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Dune'>Base16 / Atelier Dune</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Dune Light' class=''>
                Base16 / Atelier Dune Light
              </a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Estuary'>Base16 / Atelier Estuary</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Estuary Light'>Base16 / Atelier Estuary Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Forest'>Base16 / Atelier Forest</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Forest Light'>Base16 / Atelier Forest Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Heath'>Base16 / Atelier Heath</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Heath Light'>Base16 / Atelier Heath Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Lakeside'>Base16 / Atelier Lakeside</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Lakeside Light'>Base16 / Atelier Lakeside Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Plateau'>Base16 / Atelier Plateau</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Plateau Light'>Base16 / Atelier Plateau Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Savanna'>Base16 / Atelier Savanna</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Savanna Light'>Base16 / Atelier Savanna Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Seaside'>Base16 / Atelier Seaside</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Seaside Light'>Base16 / Atelier Seaside Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Sulphurpool'>Base16 / Atelier Sulphurpool</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atelier Sulphurpool Light'>Base16 / Atelier Sulphurpool Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Atlas'>Base16 / Atlas</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Bespin'>Base16 / Bespin</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Black Metal'>Base16 / Black Metal</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Black Metal Bathory'>Base16 / Black Metal Bathory</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Black Metal Burzum'>Base16 / Black Metal Burzum</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Black Metal Dark Funeral'>Base16 / Black Metal Dark Funeral</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Black Metal Gorgoroth'>Base16 / Black Metal Gorgoroth</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Black Metal Immortal'>Base16 / Black Metal Immortal</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Black Metal Khold'>Base16 / Black Metal Khold</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Black Metal Marduk'>Base16 / Black Metal Marduk</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Black Metal Mayhem'>Base16 / Black Metal Mayhem</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Black Metal Nile'>Base16 / Black Metal Nile</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Black Metal Venom'>Base16 / Black Metal Venom</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Brewer'>Base16 / Brewer</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Bright'>Base16 / Bright</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Brogrammer'>Base16 / Brogrammer</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Brush Trees'>Base16 / Brush Trees</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Brush Trees Dark'>Base16 / Brush Trees Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Chalk'>Base16 / Chalk</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Circus'>Base16 / Circus</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Classic Dark'>Base16 / Classic Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Classic Light'>Base16 / Classic Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Codeschool'>Base16 / Codeschool</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Colors'>Base16 / Colors</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Cupcake'>Base16 / Cupcake</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Cupertino'>Base16 / Cupertino</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Danqing'>Base16 / Danqing</a>
            </option>*/}

                {/* <option>
                  <a href='#Base16 / Darcula'>Base16 / Darcula</a>
                </option> */}

                {/* <option>
              <a href='#Base16 / Dark Violet'>Base16 / Dark Violet</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Darkmoss'>Base16 / Darkmoss</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Darktooth'>Base16 / Darktooth</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Decaf'>Base16 / Decaf</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Default Dark'>Base16 / Default Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Default Light'>Base16 / Default Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Dirtysea'>Base16 / Dirtysea</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Dracula'>Base16 / Dracula</a>
            </option> */}

                {/* <option>
              <a href='#Base16 / Edge Dark'>Base16 / Edge Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Edge Light'>Base16 / Edge Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Eighties'>Base16 / Eighties</a>
            </option> */}

                {/* <option>
              <a href='#Base16 / Embers'>Base16 / Embers</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Equilibrium Dark'>Base16 / Equilibrium Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Equilibrium Gray Dark'>Base16 / Equilibrium Gray Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Equilibrium Gray Light'>Base16 / Equilibrium Gray Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Equilibrium Light'>Base16 / Equilibrium Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Espresso'>Base16 / Espresso</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Eva'>Base16 / Eva</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Eva Dim'>Base16 / Eva Dim</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Flat'>Base16 / Flat</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Framer'>Base16 / Framer</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Fruit Soda'>Base16 / Fruit Soda</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Gigavolt'>Base16 / Gigavolt</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Github'>Base16 / Github</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Google Dark'>Base16 / Google Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Google Light'>Base16 / Google Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Grayscale Dark'>Base16 / Grayscale Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Grayscale Light'>Base16 / Grayscale Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Green Screen'>Base16 / Green Screen</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Gruvbox Dark Hard'>Base16 / Gruvbox Dark Hard</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Gruvbox Dark Medium'>Base16 / Gruvbox Dark Medium</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Gruvbox Dark Pale'>Base16 / Gruvbox Dark Pale</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Gruvbox Dark Soft'>Base16 / Gruvbox Dark Soft</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Gruvbox Light Hard'>Base16 / Gruvbox Light Hard</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Gruvbox Light Medium'>Base16 / Gruvbox Light Medium</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Gruvbox Light Soft'>Base16 / Gruvbox Light Soft</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Hardcore'>Base16 / Hardcore</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Harmonic 16 Dark'>Base16 / Harmonic 16 Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Harmonic 16 Light'>Base16 / Harmonic 16 Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Heetch Dark'>Base16 / Heetch Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Heetch Light'>Base16 / Heetch Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Helios'>Base16 / Helios</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Hopscotch'>Base16 / Hopscotch</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Horizon Dark'>Base16 / Horizon Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Horizon Light'>Base16 / Horizon Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Humanoid Dark'>Base16 / Humanoid Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Humanoid Light'>Base16 / Humanoid Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Ia Dark'>Base16 / Ia Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Ia Light'>Base16 / Ia Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Icy Dark'>Base16 / Icy Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Ir Black'>Base16 / Ir Black</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Isotope'>Base16 / Isotope</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Kimber'>Base16 / Kimber</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / London Tube'>Base16 / London Tube</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Macintosh'>Base16 / Macintosh</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Marrakesh'>Base16 / Marrakesh</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Materia'>Base16 / Materia</a>
            </option> */}

                <option>
                  <a href='#Base16 / Material'>Base16 / Material</a>
                </option>

                {/* <option>
                  <a href='#Base16 / Material Darker'>Base16 / Material Darker</a>
                </option> */}

                {/* <option>
              <a href='#Base16 / Material Lighter'>Base16 / Material Lighter</a>
            </option> */}

                {/* <option>
              <a href='#Base16 / Material Palenight'>Base16 / Material Palenight</a>
            </option> */}

                {/* <option>
              <a href='#Base16 / Material Vivid'>Base16 / Material Vivid</a>
            </option> */}

                {/* <option>
              <a href='#Base16 / Mellow Purple'>Base16 / Mellow Purple</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Mexico Light'>Base16 / Mexico Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Mocha'>Base16 / Mocha</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Monokai'>Base16 / Monokai</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Nebula'>Base16 / Nebula</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Nord'>Base16 / Nord</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Nova'>Base16 / Nova</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Ocean' class=''>
                Base16 / Ocean
              </a>
            </option> */}

                {/* <option>
              <a href='#Base16 / Oceanicnext' class=''>
                Base16 / Oceanicnext
              </a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / One Light'>Base16 / One Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Onedark' class=''>
                Base16 / Onedark
              </a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Outrun Dark'>Base16 / Outrun Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Papercolor Dark'>Base16 / Papercolor Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Papercolor Light'>Base16 / Papercolor Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Paraiso'>Base16 / Paraiso</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Pasque'>Base16 / Pasque</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Phd'>Base16 / Phd</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Pico'>Base16 / Pico</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Pop'>Base16 / Pop</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Porple'>Base16 / Porple</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Qualia'>Base16 / Qualia</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Railscasts'>Base16 / Railscasts</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Rebecca'>Base16 / Rebecca</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Ros Pine'>Base16 / Ros Pine</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Ros Pine Dawn'>Base16 / Ros Pine Dawn</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Ros Pine Moon'>Base16 / Ros Pine Moon</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Sagelight'>Base16 / Sagelight</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Sandcastle'>Base16 / Sandcastle</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Seti Ui'>Base16 / Seti Ui</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Shapeshifter'>Base16 / Shapeshifter</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Silk Dark'>Base16 / Silk Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Silk Light'>Base16 / Silk Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Snazzy'>Base16 / Snazzy</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Solar Flare'>Base16 / Solar Flare</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Solar Flare Light'>Base16 / Solar Flare Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Solarized Dark'>Base16 / Solarized Dark</a>
            </option> */}

                {/* <option>
              <a href='#Base16 / Solarized Light'>Base16 / Solarized Light</a>
            </option> */}

                {/* <option>
              <a href='#Base16 / Spacemacs'>Base16 / Spacemacs</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Summercamp'>Base16 / Summercamp</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Summerfruit Dark'>Base16 / Summerfruit Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Summerfruit Light'>Base16 / Summerfruit Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Synth Midnight Terminal Dark'>
                Base16 / Synth Midnight Terminal Dark
              </a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Synth Midnight Terminal Light'>
                Base16 / Synth Midnight Terminal Light
              </a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Tango'>Base16 / Tango</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Tender'>Base16 / Tender</a>
            </option>*/}

                <option>
                  <a href='#Base16 / Tomorrow'>Base16 / Tomorrow</a>
                </option>

                <option>
                  <a href='#Base16 / Tomorrow Night'>Base16 / Tomorrow Night</a>
                </option>

                {/* <option>
              <a href='#Base16 / Twilight'>Base16 / Twilight</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Unikitty Dark'>Base16 / Unikitty Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Unikitty Light'>Base16 / Unikitty Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Vulcan'>Base16 / Vulcan</a>
            </option>*/}

                {/* <option>
                  <a href='#Base16 / Windows 10'>Base16 / Windows 10</a>
                </option> */}

                {/* <option>
              <a href='#Base16 / Windows 10 Light'>Base16 / Windows 10 Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Windows 95'>Base16 / Windows 95</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Windows 95 Light'>Base16 / Windows 95 Light</a>
            </option>*/}

                {/* <option>
                  <a href='#Base16 / Windows High Contrast'>Base16 / Windows High Contrast</a>
                </option> */}

                {/* <option>
              <a href='#Base16 / Windows High Contrast Light'>
                Base16 / Windows High Contrast Light
              </a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Windows Nt'>Base16 / Windows Nt</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Windows Nt Light'>Base16 / Windows Nt Light</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Woodland'>Base16 / Woodland</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Xcode Dusk'>Base16 / Xcode Dusk</a>
            </option>*/}

                {/* <option>
              <a href='#Base16 / Zenburn'>Base16 / Zenburn</a>
            </option> */}

                {/* <option>
              <a href='#Brown Paper'>Brown Paper</a>
            </option>*/}

                {/* <option>
              <a href='#Codepen Embed'>Codepen Embed</a>
            </option> */}

                {/* <option>
              <a href='#Color Brewer'>Color Brewer</a>
            </option>*/}

                {/* <option>
                <a href='#Dark'>Dark</a>
              </option> */}

                {/* <option>
              <a href='#Devibeans'>Devibeans</a>
            </option>*/}

                {/* <option>
              <a href='#Docco'>Docco</a>
            </option> */}

                {/* <option>
              <a href='#Far'>Far</a>
            </option>*/}

                {/* <option>
              <a href='#Felipec'>Felipec</a>
            </option>*/}

                {/* <option>
              <a href='#Foundation'>Foundation</a>
            </option> */}

                <option>
                  <a href='#Github'>Github</a>
                </option>

                <option>
                  <a href='#Github Dark'>Github Dark</a>
                </option>

                {/* <option>
              <a href='#Github Dark Dimmed'>Github Dark Dimmed</a>
            </option>*/}

                {/* <option>
              <a href='#Gml'>Gml</a>
            </option>*/}

                {/* <option>
                  <a href='#Googlecode' class=''>
                    Googlecode
                  </a>
                </option> */}

                {/* <option>
              <a href='#Gradient Dark'>Gradient Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Gradient Light' class=''>
                Gradient Light
              </a>
            </option>*/}

                {/* <option>
              <a href='#Grayscale'>Grayscale</a>
            </option>*/}

                <option>
                  <a href='#Hybrid'>Hybrid</a>
                </option>

                {/* <option>
              <a href='#Idea'>Idea</a>
            </option>*/}

                {/* <option>
              <a href='#Intellij Light'>Intellij Light</a>
            </option>*/}

                {/* <option>
              <a href='#Ir Black'>Ir Black</a>
            </option>*/}

                {/* <option>
              <a href='#Isbl Editor Dark'>Isbl Editor Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Isbl Editor Light'>Isbl Editor Light</a>
            </option>*/}

                {/* <option>
              <a href='#Kimbie Dark'>Kimbie Dark</a>
            </option> */}

                {/* <option>
              <a href='#Kimbie Light'>Kimbie Light</a>
            </option>*/}

                {/* <option>
              <a href='#Lightfair'>Lightfair</a>
            </option>*/}

                {/* <option>
              <a href='#Lioshi'>Lioshi</a>
            </option>*/}

                {/* <option>
              <a href='#Magula'>Magula</a>
            </option>*/}

                {/* <option>
              <a href='#Mono Blue' class=''>
                Mono Blue
              </a>
            </option>*/}

                {/* <option>
                <a href='#Monokai' class=''>
                  Monokai
                </a>
              </option> */}

                <option>
                  <a href='#Monokai Sublime' class=''>
                    Monokai Sublime
                  </a>
                </option>

                {/* <option>
              <a href='#Night Owl'>Night Owl</a>
            </option>*/}

                {/* <option>
              <a href='#Nnfx Dark'>Nnfx Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Nnfx Light'>Nnfx Light</a>
            </option>*/}

                {/* <option>
                <a href='#Nord'>Nord</a>
              </option> */}

                {/* <option>
              <a href='#Obsidian'>Obsidian</a>
            </option> */}

                {/* <option>
              <a href='#Panda Syntax Dark'>Panda Syntax Dark</a>
            </option>*/}

                {/* <option>
              <a href='#Panda Syntax Light'>Panda Syntax Light</a>
            </option>*/}

                {/* <option>
              <a href='#Paraiso Dark' class='current'>
                Paraiso Dark
              </a>
            </option>*/}

                {/* <option>
              <a href='#Paraiso Light'>Paraiso Light</a>
            </option>*/}

                {/* <option>
              <a href='#Pojoaque'>Pojoaque</a>
            </option>*/}

                {/* <option>
              <a href='#Purebasic' class=''>
                Purebasic
              </a>
            </option>*/}

                {/* <option>
              <a href='#Qtcreator Dark' class=''>
                Qtcreator Dark
              </a>
            </option>*/}

                {/* <option>
              <a href='#Qtcreator Light'>Qtcreator Light</a>
            </option> */}

                {/* <option>
              <a href='#Rainbow' class=''>
                Rainbow
              </a>
            </option>*/}

                {/* <option>
              <a href='#Routeros' class=''>
                Routeros
              </a>
            </option>*/}

                {/* <option>
              <a href='#School Book' class=''>
                School Book
              </a>
            </option>*/}

                {/* <option>
              <a href='#Shades Of Purple' class=''>
                Shades Of Purple
              </a>
            </option>*/}

                {/* <option>
              <a href='#Srcery'>Srcery</a>
            </option>*/}

                {/* <option>
              <a href='#Stackoverflow Dark' class=''>
                Stackoverflow Dark
              </a>
            </option>*/}

                {/* <option>
              <a href='#Stackoverflow Light'>Stackoverflow Light</a>
            </option>*/}

                {/* <option>
              <a href='#Sunburst' class=''>
                Sunburst
              </a>
            </option>*/}

                <option>
                  <a href='#Tokyo Night Dark' class=''>
                    Tokyo Night Dark
                  </a>
                </option>

                {/* <option>
                  <a href='#Tokyo Night Light' class=''>
                    Tokyo Night Light
                  </a>
                </option> */}

                <option>
                  <a href='#Tomorrow Night Blue' class=''>
                    Tomorrow Night Blue
                  </a>
                </option>

                {/* <option>
                <a href='#Tomorrow Night Bright' class=''>
                  Tomorrow Night Bright
                </a>
              </option> */}

                <option>
                  <a href='#Vs' class=''>
                    Vs
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

                {/* <option>
              <a href='#Xt 256' class=''>
                Xt 256
              </a>
            </option>*/}
              </select>
            </div>

            <div>
              <label htmlFor=''>
                <input type='checkbox' /> Show avatar
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
                    setEditing(true)
                  }}></code>

                <textarea
                  class='clear'
                  ref={textBox}
                  placeholder='Add your code here...'
                  onInput={(e) => {
                    let self = e.currentTarget
                    setCode(escape(self.value))
                    self.style.height = '0'
                    self.style.height = self.scrollHeight + 'px'
                    setEditing(false)
                  }}
                  onKeyDown={(e) => {
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
            {user && (
              <div className='avatar flex items-center'>
                <img
                  class='drop-shadow-3'
                  src={user?.photoURL ?? `https://www.gravatar.com/avatar/?d=mp&s=190`}
                  alt={user?.displayName ?? ''}
                  referrerpolicy='no-referrer'
                />
                <div>
                  <div className='author text-shadow' contentEditable>
                    {user?.displayName}
                  </div>
                  <small className='secondary text-shadow' contentEditable>
                    {user?.displayName}
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div class='flex flex-row-reverse'></div>
    </div>
  )
}
