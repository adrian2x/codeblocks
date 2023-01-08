// @ts-expect-error
import { ago } from 'time-ago'
import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { getPosts, TPost } from '../../common/requests'
import useInfiniteScroll from '../../hooks/useInfiniteScroll'
import { avatarUrl } from '../users/avatarUrl'
import './post-list.scss'

export async function loadPosts() {
  return await getPosts()
}

export function PostsContainer() {
  const posts = useLoaderData() as TPost[]
  return (
    <section className='container post-list grid grid-cols-1'>
      <PostsList />
    </section>
  )
}

const PAGE_SIZE = 10

export type PostsListProps = {
  uid?: string
  noHeader?: boolean
}

export function PostsList({ uid, noHeader }: PostsListProps) {
  const [posts, setPosts] = useState<TPost[]>([])
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onLoadMore() {
    if (loading || disabled) return false
    try {
      setLoading(true)
      let nextPosts = await getPosts(uid, posts[posts.length - 1]?.id)
      setPosts(posts.concat(nextPosts))
      setDisabled(nextPosts.length < PAGE_SIZE)
    } finally {
      setLoading(false)
    }
  }

  const observerRef = useInfiniteScroll({
    disabled,
    onLoadMore
  })

  return (
    <>
      {posts.map((post) => {
        return <PostDisplay p={post} noHeader={noHeader} />
      })}
      <div ref={observerRef}>
        <p></p>
        {loading && 'Loading...'}
      </div>
    </>
  )
}

export function PostDisplay({ noHeader, p }: any) {
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
          {!noHeader && <p>{p.description}</p>}

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
