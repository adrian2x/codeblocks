import { useRef, useState } from 'preact/hooks'
import toast from 'react-hot-toast'
import { Params, useLoaderData } from 'react-router-dom'
import { updateCurrentUser } from '../../common/firebase'
import { getUser, GetUserResponse, updateUser } from '../../common/requests'
import { currentUser } from '../../stores/uiState'
import { generateGradient, uploadImage } from '../posts/CodeEditor'
import { PostsList } from '../posts/PostList'

import './user-page.scss'

export async function userPostsLoader({ params }: { params: Params }) {
  if (params.user_id) {
    return getUser(params.user_id)
  }
}

export function UserPage() {
  const { user, posts } = useLoaderData() as GetUserResponse
  const allowEditing = user.id === currentUser.value?.uid

  const [userProfile, setUserProfile] = useState(user)
  const [background, setBackground] = useState([user.backgroundColor] ?? generateGradient())

  const setUser = (data: Object) => {
    setUserProfile({ ...userProfile, ...data })
    toast.dismiss()
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
          <PhotoUploader
            value={userProfile.photoUrl}
            altText={userProfile.displayName ?? ''}
            allowEditing={allowEditing}
            onUpdate={(url) => {
              setUser({ photoUrl: url })
              updateCurrentUser({ photoURL: url })
            }}
          />
          <h1
            key={userProfile.displayName}
            className='title'
            contentEditable={allowEditing}
            onBlur={(e) => {
              let value = e.currentTarget.innerHTML
              if (value !== userProfile.displayName) {
                setUser({ displayName: value })
                updateCurrentUser({ displayName: value })
              }
            }}>
            {userProfile.displayName}
          </h1>
          <div className='details'>
            <span>
              <a
                href={`/@/${user.id}`}
                key={userProfile.displayHandle}
                contentEditable={allowEditing}
                onClick={(e) => {
                  if (allowEditing) e.preventDefault()
                }}
                onBlur={(e) => {
                  let value = e.currentTarget.innerHTML
                  if (value !== userProfile.displayHandle) {
                    setUser({ displayHandle: value })
                    updateCurrentUser({ displayHandle: value })
                  }
                }}>
                {userProfile.displayHandle ?? 'Anonymous'}
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
  let inputRef = useRef<HTMLInputElement>(null)
  let imageRef = useRef<HTMLImageElement>(null)
  return (
    <div class='avatar-container'>
      <img
        ref={imageRef}
        class='avatar drop-shadow-4'
        src={value ?? `https://www.gravatar.com/avatar/?d=mp&s=48`}
        alt={altText ?? ''}
        referrerpolicy='no-referrer'
      />
      {allowEditing && (
        <>
          <input
            hidden
            ref={inputRef}
            type='file'
            onChange={async (e) => {
              let fileName = currentUser.value!.uid
              if (e.currentTarget.files) {
                let url = await handleFileUpload(fileName, e.currentTarget.files[0])
                imageRef.current!.src = url
                onUpdate?.(url)
              }
            }}
          />
          <div className='btn-upload' onClick={(e) => inputRef.current?.click()}>
            ⬆️
          </div>
        </>
      )}
    </div>
  )
}
