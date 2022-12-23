import { getUser, GetUserResponse, updateUser } from '../../common/requests'
import { useLoaderData, Params } from 'react-router-dom'
import { useCallback, useId, useRef, useState } from 'preact/hooks'
import { PostsList } from '../posts/PostList'
import { generateGradient, uploadImage } from '../posts/CodeEditor'
import toast from 'react-hot-toast'
import { currentUser } from '../../stores/uiState'
import { updateCurrentUser } from '../../common/firebase'

import './user-page.scss'

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

  const setUser = useCallback(
    (data: Object) => {
      setUserState({ ...userState, ...data })
      return toast.promise(updateUser(userState.id, data), {
        loading: 'Saving...',
        success: 'Success!',
        error: 'There was an error.'
      })
    },
    [userState]
  )

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
          <PhotoUploader
            value={userState.photoUrl}
            altText={userState.displayName ?? ''}
            allowEditing={allowEditing}
            onUpdate={(url) => {
              setUser({ photoUrl: url })
              updateCurrentUser({ photoURL: url })
            }}
          />
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
  return new Promise<string>((resolve, reject) => {
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

export function PhotoUploader({
  value,
  altText,
  allowEditing,
  onUpdate
}: {
  value: string
  altText?: string
  allowEditing?: boolean
  onUpdate?: (data: string) => any
}) {
  let ref = useRef<HTMLInputElement>(null)
  return (
    <div class='avatar-container'>
      <img
        class='avatar drop-shadow-4'
        src={value ?? `https://www.gravatar.com/avatar/?d=mp&s=48`}
        alt={altText ?? ''}
        referrerpolicy='no-referrer'
      />
      {allowEditing && (
        <>
          <input
            ref={ref}
            type='file'
            hidden
            onChange={async (e) => {
              let fileName = currentUser.value!.uid
              if (e.currentTarget.files) {
                let url = await handleFileUpload(fileName, e.currentTarget.files[0])
                onUpdate?.(url)
              }
            }}
          />
          <div className='btn-upload' onClick={(e) => ref.current?.click()}>
            ⬆️
          </div>
        </>
      )}
    </div>
  )
}
