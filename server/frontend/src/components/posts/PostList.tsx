// @ts-expect-error
import { ago } from 'time-ago'
import { signal } from '@preact/signals'
import { useCallback, useEffect } from 'preact/hooks'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link, useLoaderData } from 'react-router-dom'
import { getPosts, TPost } from '../../common/requests'
import useInfiniteScroll from '../../hooks/useInfiniteScroll'
import { avatarUrl } from '../users/avatarUrl'

import './post-list.scss'

export const postLanguage = signal('')

export async function loadPosts() {
  return await getPosts()
}

function parseURLParams() {
  return new URLSearchParams(location.search)
}

function setURLParam(name: string, value: string) {
  // Get current URL
  const url = new URL(window.location.href)

  // Update or remove a param
  if (value) {
    url.searchParams.set(name, value)
  } else {
    url.searchParams.delete(name)
  }

  // Update the current URL
  window.history.replaceState(null, '', url)
}

export function PostsContainer() {
  const posts = useLoaderData() as TPost[]
  useEffect(() => {
    postLanguage.value = ''
  }, [])
  return (
    <div className='flex w-100 justify-between'>
      <section className='container post-list grid grid-cols-1'>
        <PostsList />
      </section>
      <PostLanguages />
    </div>
  )
}

const PAGE_SIZE = 10

export type PostsListProps = {
  uid?: string
  noHeader?: boolean
  language?: string
}

export function PostsList({ uid, noHeader, language }: PostsListProps) {
  const [posts, setPosts] = useState<TPost[]>([])
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)

  const resetState = useCallback(() => {
    setPosts([])
    setDisabled(false)
    setLoading(false)
  }, [setPosts, setDisabled, setLoading])

  async function onLoadMore() {
    if (loading || disabled) return false
    try {
      setLoading(true)
      let nextPosts = await getPosts(uid, posts[posts.length - 1]?.id, postLanguage.value)
      setPosts(posts.concat(nextPosts))
      setDisabled(nextPosts.length < PAGE_SIZE)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Reset the results when the languange changes
    resetState()
  }, [postLanguage.value, resetState])

  const observerRef = useInfiniteScroll({
    disabled,
    onLoadMore
  })

  return (
    <>
      {posts.map((post) => {
        return <PostItem p={post} noHeader={noHeader} />
      })}
      <div ref={observerRef}>
        <p></p>
        {loading && 'Loading...'}
        {!loading && posts.length === 0 && 'No posts to show.'}
      </div>
    </>
  )
}

export function PostItem({ noHeader, p }: any) {
  let previewUrl = `https://firebasestorage.googleapis.com/v0/b/codeblocks-991a2.appspot.com/o/${p.id}.png?alt=media`
  const { uid, displayName, displayHandle, photoUrl } = p.user
  return (
    <article key={p.id} className='post'>
      <div class='flex flex-column flex-1'>
        {!noHeader && (
          <header class='header'>
            <Link
              to={`/@/${uid}`}
              style={{
                width: 40,
                marginRight: 8
              }}>
              <img
                class='avatar'
                src={photoUrl ?? avatarUrl(displayName)}
                alt={displayName}
                referrerpolicy='no-referrer'
              />
            </Link>

            <div class='post-meta'>
              <div className='meta'>
                <span>
                  <Link class='author' to={`/@/${uid}`}>
                    {displayName} {displayHandle}
                  </Link>
                </span>
                <span class='sep mx1'>{`•`}</span>
                <span>{ago(p.created, false)}</span>
              </div>
              <div class='title'>{p.title && <h4 class='title'>{p.title || 'Untitled'}</h4>}</div>
            </div>
          </header>
        )}

        <div className='content'>
          {!noHeader && <ReactMarkdown>{p.description}</ReactMarkdown>}

          <Link to={`/post/${p.id}`} className='cover'>
            <div
              className='image'
              style={{
                background: `url(${previewUrl}) 50% 0 no-repeat`,
                backgroundSize: 'cover'
              }}
              title={`${p.description}`}></div>
          </Link>
        </div>
      </div>
    </article>
  )
}

interface PostLanguagesProps {
  title?: string
}

export function PostLanguages({ title }: PostLanguagesProps) {
  const setPostLanguage = (e: any) => {
    postLanguage.value = e.target.id
  }

  return (
    <div className='aside sm-hide'>
      <section onClick={setPostLanguage}>
        <div className='title'>{title ?? 'Popular'}</div>
        <div className='post-languages'>
          <a id='python'>Python</a>
          <a id='c'>C</a>
          <a id='java'>Java</a>
          <a id='javascript'>JavaScript</a>
          <a id='cpp'>C++</a>
          <a id='csharp'>C#</a>
          <a id='sql'>SQL</a>
          <a id='php'>PHP</a>
          <a id='swift'>Swift</a>
          <a id='go'>Go</a>
          <a id='r'>R</a>
          <a id='ruby'>Ruby</a>
          <a id='rust'>Rust</a>
          <a id='kotlin'>Kotlin</a>
          <a id='typescript'>TypeScript</a>
          <a id='bash'>Bash</a>
          <a id='html'>HTML</a>
          <a id='css'>CSS</a>
          <a id='scss'>SCSS</a>
          <a id='xml'>XML</a>
          <a id='markdown'>Markdown</a>
          <a id='shell'>Shell</a>
          <a id='powershell'>PowerShell</a>
          {/* <a id='python-repl'>Python REPL</a> */}
          <a id='makefile'>Makefile</a>
          <a id='toml'>TOML</a>
          <a id='yaml'>YAML</a>
          <a id='json'>JSON</a>
          <a id='plaintext'>Plain Text</a>
        </div>
      </section>
    </div>
  )
}
