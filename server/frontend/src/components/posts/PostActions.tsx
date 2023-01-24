import { useState } from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa'
import { FiRepeat, FiShare2 } from 'react-icons/fi'
import { RWebShare } from 'react-web-share'
import { duplicatePost, savePost, TPost } from '../../common/requests'
import { currentUser } from '../../stores/uiState'
import './post-actions.scss'

export function PostActions({ post }: { post: TPost }) {
  const postUrl = `${location.origin}/post/${post.id}`

  // TODO: check if post was previously saved...
  const [isSaved, setSaved] = useState(false)

  const [isDuplicated, setDuplicated] = useState(false)

  function handleDuplicate() {
    if (currentUser.value) {
      let prevDuplicated = isDuplicated
      setDuplicated(!isDuplicated)
      duplicatePost(currentUser.value.uid, post)
        // Roll back if there was an error
        .catch(() => setDuplicated(prevDuplicated))
    }
  }

  function handleSave() {
    if (currentUser.value) {
      let prevSaved = isSaved
      setSaved(!isSaved)
      savePost(post.id, currentUser.value.uid, !isSaved)
        // Roll back if there was an error
        .catch(() => setSaved(prevSaved))
    }
  }

  return (
    <div className='post_actions'>
      <button
        title='Star'
        onClick={handleSave}
        style={{
          color: isSaved ? '#ffc300' : 'inherit'
        }}>
        {isSaved ? <FaStar /> : <FaRegStar />} Star
      </button>
      <button
        title='Duplicate'
        onClick={handleDuplicate}
        style={{
          color: isDuplicated ? 'rgb(0, 186, 124)' : 'inherit'
        }}>
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
        <button title='Share'>
          <FiShare2 /> Share
        </button>
      </RWebShare>
    </div>
  )
}
