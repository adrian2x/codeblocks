import { FaStar, FaRegStar } from 'react-icons/fa'
import { FiRepeat, FiShare2 } from 'react-icons/fi'
import { RWebShare } from 'react-web-share'
import toast from 'react-hot-toast'
import { duplicatePost, TPost } from '../../common/requests'
import { currentUser } from '../../stores/uiState'
import { useState } from 'react'
import './post-actions.scss'

export function PostActions({ post }: { post: TPost }) {
  const postUrl = `${location.origin}/post/${post.id}`
  const [isSaved, setSaved] = useState(false)

  function handleDuplicate() {
    if (currentUser.value) {
      toast.promise(duplicatePost(currentUser.value.uid, post), {
        loading: 'Saving…',
        success: 'Your post is now ready!',
        error: 'There was an error.'
      })
    }
  }

  return (
    <div className='post_actions'>
      <button
        className='clear'
        data-active={isSaved}
        title='Star'
        onClick={() => {
          setSaved(!isSaved)
        }}>
        {isSaved ? <FaStar /> : <FaRegStar />} Star
      </button>
      <button className='clear' title='Duplicate' onClick={handleDuplicate}>
        <FiRepeat /> Duplicate
      </button>
      <RWebShare
        data={{
          text: post.description,
          url: postUrl,
          title: post.title
        }}
        sites={[
          'twitter',
          'facebook',
          'whatsapp',
          'linkedin',
          'reddit',
          'telegram',
          'mail',
          'copy'
        ]}>
        <button className='clear' title='Share'>
          <FiShare2 /> Share
        </button>
      </RWebShare>
    </div>
  )
}
