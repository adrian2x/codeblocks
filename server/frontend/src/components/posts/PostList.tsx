import { signal } from '@preact/signals'
import { useCallback, useEffect } from 'preact/hooks'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link, useLoaderData } from 'react-router-dom'
import { getPosts, getSavedPosts } from '../../common/requests'
import useInfiniteScroll from '../../hooks/useInfiniteScroll'
import { avatarUrl } from '../users/avatarUrl'
import { filterBySaved } from '../users/ProfilePage'
import { PostActions } from './PostActions'
import { TPost } from '../../types'
import { ago } from '../../common/time-ago'
import './post-list.scss'

export const filterByLanguage = signal('')

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

export default function PostsContainer() {
  useEffect(() => {
    filterByLanguage.value = ''
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
  onlyImage?: boolean
  language?: string
}

export function PostsList({ uid, onlyImage }: PostsListProps) {
  const [posts, setPosts] = useState<TPost[]>([])
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const resetState = useCallback(() => {
    setPosts([])
    setLoading(false)
    setDisabled(false)
  }, [setPosts, setDisabled, setLoading])

  async function onLoadMore() {
    try {
      setLoading(true)
      let nextPosts: TPost[] = []
      if (filterBySaved.value && uid) {
        nextPosts = await getSavedPosts(uid, posts[posts.length - 1]?.id)
      } else {
        nextPosts = await getPosts(uid, posts[posts.length - 1]?.id, filterByLanguage.value)
      }
      setPosts(posts.concat(nextPosts))
      setDisabled(nextPosts.length < PAGE_SIZE)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Reset the results when the filters change
    resetState()
  }, [filterByLanguage.value, filterBySaved.value])

  const observerRef = useInfiniteScroll({
    disabled: disabled || loading,
    onLoadMore
  })

  let isEmpty = disabled && posts.length === 0

  return (
    <>
      {posts.map((post) => {
        return <PostItem isSaved p={post} onlyImage={onlyImage} />
      })}
      <div ref={observerRef}>
        {loading && <PostSkeleton onlyImage={onlyImage} />}
        {isEmpty && 'No posts to show.'}
      </div>
    </>
  )
}

export function PostItem({ isSaved, onlyImage, p }: any) {
  const { id, uid, displayName, displayHandle, photoUrl } = p.user ?? {}
  let profileLink = `/@/${displayHandle || uid || id}`
  let previewUrl =
    p.preview ??
    `https://firebasestorage.googleapis.com/v0/b/codeblocks-991a2.appspot.com/o/${p.id}.png?alt=media`
  return (
    <article key={p.id} className='post'>
      <div class='flex flex-column flex-1'>
        {!onlyImage && (
          <header class='header'>
            <Link to={profileLink}>
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
                  <Link class='author' to={profileLink}>
                    {displayName} {displayHandle}
                  </Link>
                </span>
                <span class='sep mx1'>{`•`}</span>
                <span>{ago(p.created, false)}</span>
              </div>
              <div class='title'>
                {p.title && (
                  <h4 class='title'>
                    <Link to={`/post/${p.id}`}>{p.title || 'Untitled'}</Link>
                  </h4>
                )}
              </div>
            </div>
          </header>
        )}

        <div className='content'>
          {!onlyImage && <ReactMarkdown>{p.description}</ReactMarkdown>}

          <Link to={`/post/${p.id}`} className='cover'>
            <div
              className='image'
              style={{
                background: `url(${previewUrl}) 50% 0 no-repeat`,
                backgroundSize: 'cover'
              }}
              title={`${p.description}`}></div>
          </Link>

          <PostActions post={p} />
        </div>
      </div>
    </article>
  )
}

export function PostLanguages({ title }: { title?: string }) {
  const setPostLanguage = (e: any) => {
    filterByLanguage.value = e.target.id
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

function SkeletonText({ width }: any) {
  return (
    <div
      className='skeleton-text'
      style={{
        width: width ?? '100%'
      }}
    />
  )
}

export function PostSkeleton({ onlyImage }: any) {
  return (
    <article className='post is-skeleton'>
      <div class='flex flex-column flex-1'>
        {!onlyImage && (
          <header class='header'>
            <img
              class='avatar'
              src='http://www.gravatar.com/avatar/?d=mp'
              referrerpolicy='no-referrer'
            />

            <div class='post-meta'>
              <div className='meta'>
                <span class='sep mx1'>{`•`}</span>
              </div>
              <div class='title'>
                <h4 class='title'>Loading…</h4>
              </div>
            </div>
          </header>
        )}

        <div className='content'>
          {!onlyImage && (
            <p>
              <SkeletonText width='80%' />
            </p>
          )}
          <div className='cover'>
            <div className='image'></div>
          </div>
          <p></p>
        </div>
      </div>
    </article>
  )
}
