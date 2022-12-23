import { Link, useLoaderData } from 'react-router-dom'
import { getPosts, TPost } from '../../common/requests'
import './post-list.scss'

export async function postsLoader() {
  const posts = await getPosts()
  return posts
}

export function PostsContainer() {
  const posts = useLoaderData() as TPost[]
  return (
    <section className='container post-list grid grid-cols-3 gap-4'>
      <PostsList posts={posts} />
    </section>
  )
}

export function PostsList({ posts }: { posts: TPost[] }) {
  return (
    <>
      {posts.map((p) => {
        let previewUrl = `https://firebasestorage.googleapis.com/v0/b/codeblocks-991a2.appspot.com/o/${p.id}.png?alt=media`
        const { uid, displayName, photoUrl } = p.user
        return (
          <article key={p.id} className='post'>
            <div class='flex flex-column flex-1 justify-center'>
              <Link to={`/post/${p.id}`} className='cover'>
                <div
                  className='image'
                  style={{
                    background: `url(${previewUrl}) 50% 0 no-repeat`,
                    backgroundSize: 'cover'
                  }}
                  title={`${p.description}`}></div>
              </Link>

              <header class='flex footer items-center'>
                <Link
                  to={`/@/${uid}`}
                  style={{
                    width: 40,
                    marginRight: 8
                  }}>
                  <img
                    class='avatar'
                    src={photoUrl!}
                    alt={displayName}
                    referrerpolicy='no-referrer'
                  />
                </Link>
                <div class='title'>
                  <h4 class='title'>
                    <Link to={`/post/${p.id}`}>{p.title}</Link>
                  </h4>
                  <Link class='author' to={`/@${uid}`}>
                    {displayName}
                  </Link>
                </div>
              </header>
            </div>
          </article>
        )
      })}
    </>
  )
}
