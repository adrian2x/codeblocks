import toast from 'react-hot-toast'
import { useState } from 'preact/hooks'
import { Params, useLoaderData } from 'react-router-dom'
import { updateCurrentUser } from '../../common/firebase'
import { getUser, GetUserResponse, updateUser } from '../../common/requests'
import { currentUser } from '../../stores/uiState'
import { generateGradient } from '../posts/CodeEditor'
import { PostsList } from '../posts/PostList'
import { PhotoUploader } from './PhotoUploader'

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
            fileName={currentUser.value?.uid ?? ''}
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
          {(userProfile.about || allowEditing) && (
            <Editable
              className='bio text-center'
              readOnly={!allowEditing}
              defaultValue={userProfile.about}
              placeholder='About me...'
              onChange={(about) => {
                setUser({ about })
              }}
            />
          )}
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

export function Editable({
  className,
  readOnly,
  defaultValue,
  placeholder,
  onChange
}: {
  className?: string
  readOnly?: boolean
  defaultValue?: string
  placeholder?: string
  onChange?: (value: string) => any
}) {
  return (
    <div
      className={className}
      contentEditable={!readOnly}
      onInput={(e) => {
        // Trim content if it becomes too long
        let value = e.currentTarget.innerText
        if (value.trim().length >= 100) {
          value = value.trim().substring(0, 100)
          e.currentTarget.innerText = value
        }
      }}
      onKeyPress={(e) => {
        // Enforce max length
        let value = e.currentTarget.innerText
        if (value.trim().length >= 100) {
          e.preventDefault()
          return false
        }
      }}
      onBlur={(e) => {
        let value = e.currentTarget.innerText.trim()
        if (value !== defaultValue) onChange?.(value)
      }}>
      {defaultValue ?? placeholder ?? ''}
    </div>
  )
}
