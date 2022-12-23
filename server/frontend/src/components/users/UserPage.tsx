import { getUser, GetUserResponse, updateUser } from '../../common/requests'
import { useLoaderData, Params } from 'react-router-dom'
import { useState } from 'preact/hooks'
import { PostsList } from '../posts/PostList'
import { generateGradient, uploadImage } from '../posts/CodeEditor'
import toast from 'react-hot-toast'
import { currentUser } from '../../stores/uiState'

import './users-page.scss'
import { updateCurrentUser } from '../../common/firebase'

export async function userPostsLoader({ params }: { params: Params }) {
  if (params.user_id) {
    return getUser(params.user_id)
  }
}

export function UserPage() {
  const { user, posts } = useLoaderData() as GetUserResponse
  const allowEditing = user.id === currentUser.value?.uid

  const [userState, setUserState] = useState(user)
  const [background, setBackground] = useState([user.backgroundColor] ?? generateGradient())

  const setUser = (data: Object) => {
    setUserState({ ...userState, ...data })
    return toast.promise(updateUser(currentUser.value!.uid, data), {
      loading: 'Saving...',
      success: 'Success!',
      error: 'There was an error.'
    })
  }

  return (
    <div className='user-page' data-active={allowEditing}>
      <header>
        <div
          key={background[0]}
          className='banner'
          style={{ background: background[0] }}
          onClick={() => {
            if (allowEditing) {
              let backgroundGradient = generateGradient()
              setBackground(backgroundGradient)
              setUser({
                backgroundColor: backgroundGradient[0]
              })
            }
          }}></div>
        <div className='user-avatar'>
          <div class='avatar-container'>
            <img
              key={userState.photoUrl}
              class='avatar drop-shadow-4'
              src={userState.photoUrl ?? `https://www.gravatar.com/avatar/?d=mp&s=48`}
              alt={userState.displayName ?? ''}
              referrerpolicy='no-referrer'
            />
            {allowEditing && (
              <>
                <input
                  id='avatar-upload'
                  type='file'
                  hidden
                  onChange={async (e) => {
                    let fileName = currentUser.value!.uid
                    if (e.currentTarget.files) {
                      let url = await handleFileUpload(fileName, e.currentTarget.files[0])
                      setUser({ photoUrl: url })
                      updateCurrentUser({ photoURL: url })
                    }
                  }}
                />
                <div
                  className='btn-upload'
                  onClick={(e) => {
                    document.getElementById('avatar-upload')?.click()
                  }}>
                  ⬆️
                </div>
              </>
            )}
          </div>
          <h1
            key={userState.displayName}
            className='title'
            contentEditable={allowEditing}
            onBlur={(e) => {
              let update = {
                displayName: e.currentTarget.innerHTML
              }
              setUser(update)
              updateCurrentUser(update)
            }}>
            {userState.displayName}
          </h1>
          <div className='details'>
            <span>
              <a
                key={userState.displayHandle}
                contentEditable={allowEditing}
                href={`/@/${user.id}`}
                onClick={(e) => {
                  if (allowEditing) e.preventDefault()
                }}
                onBlur={(e) => {
                  let update = {
                    displayHandle: e.currentTarget.innerHTML
                  }
                  setUser(update)
                  updateCurrentUser(update)
                }}>
                {userState.displayHandle ?? 'Anonymous'}
              </a>
            </span>
            <span class='sep'>{`  •  `}</span>
          </div>
        </div>
      </header>
      <div className='container'>
        <div className='post-list grid grid-cols-3 gap-4'>
          <PostsList posts={posts} />
        </div>
      </div>
    </div>
  )
}

async function handleFileUpload(fileName: string, file: File) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onload = async () => {
      let data = reader.result!
      await uploadImage(fileName, data as ArrayBuffer)
      resolve(
        `https://firebasestorage.googleapis.com/v0/b/codeblocks-991a2.appspot.com/o/${fileName}?alt=media`
      )
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
