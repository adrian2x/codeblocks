import { Link, useLoaderData } from 'react-router-dom'
import { getPosts, TPost } from '../../common/requests'
import './post-list.scss'

export async function postsLoader({ params }: any) {
  const posts = await getPosts()
  return posts
}

export function PostsList() {
  const posts = useLoaderData() as TPost[]
  return (
    <section className='post-list grid grid-cols-3 gap-4'>
      {posts.map((p) => {
        let previewUrl = `https://firebasestorage.googleapis.com/v0/b/codeblocks-991a2.appspot.com/o/${p.id}.png?alt=media`
        const { uid, displayName, photoUrl } = p.user
        return (
          <article key={p.id} className='post'>
            <div class='flex flex-column flex-1 justify-center'>
              <Link to={`/posts/${p.id}`} className='cover'>
                <div
                  className='image'
                  style={{
                    background: `url(${previewUrl}) 50% 0 no-repeat`,
                    backgroundSize: 'cover'
                  }}></div>
                {/* <picture>
                  <source srcSet={previewUrl} type='image/png' />
                  <img src={previewUrl} alt='' loading='lazy' />
                </picture> */}
              </Link>

              <header class='flex footer items-center'>
                <Link to={`/@${uid}`}>
                  <img
                    class='avatar'
                    src={photoUrl!}
                    alt={displayName}
                    referrerpolicy='no-referrer'
                  />
                </Link>
                <div>
                  <h4 class='title'>
                    <Link to={`/posts/${p.id}`}>{p.title}</Link>
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
    </section>
  )
}
