import toast from 'react-hot-toast'
import { useEffect, useState } from 'preact/hooks'
import { Link, Params, useLoaderData, useNavigate } from 'react-router-dom'
import { updateCurrentUser } from '../../common/firebase'
import { deleteUser, getUser, GetUserResponse, updateUser } from '../../common/requests'
import { currentUser } from '../../stores/uiState'
import { generateGradient } from '../posts/CodeEditor'
import { postLanguage, PostLanguages, PostsList } from '../posts/PostList'
import { PhotoUploader } from './PhotoUploader'

import './profile-page.scss'
import { Tabs } from '../tabs/Tabs'

export async function userPostsLoader({ params }: { params: Params }) {
  if (params.user_id) {
    return getUser(params.user_id)
  }
}

export function ProfilePage() {
  const { user, posts } = useLoaderData() as GetUserResponse
  const [userProfile, setUserProfile] = useState(user)
  const [background, setBackground] = useState([user.backgroundColor] ?? generateGradient())
  const [isSaving, setSaving] = useState(false)
  const navigate = useNavigate()

  const isOwner = currentUser.value?.uid === user.id

  useEffect(() => {
    if (user) {
      setUserProfile(user)
      setBackground([user.backgroundColor] ?? generateGradient())
    }
  }, [user, setUserProfile, setBackground])

  useEffect(() => {
    postLanguage.value = ''
  }, [])

  function setUser(data: Object) {
    setUserProfile({ ...userProfile, ...data })
    toast.dismiss()
    return toast.promise(updateUser(currentUser.value!.uid, data), {
      loading: 'Saving…',
      success: 'Success!',
      error: 'There was an error.'
    })
  }

  async function handleDelete(userId: string) {
    try {
      setSaving(true)
      await toast.promise(deleteUser(userId), {
        loading: 'Deleting…',
        success: 'Your account was deleted.',
        error: 'There was an error'
      })
      navigate('/')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className='container profile-page' data-active={isOwner && !isSaving}>
        <header>
          <div
            key={background[0]}
            className='banner'
            style={{ background: background[0] }}
            onClick={() => {
              if (isOwner) {
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
              value={userProfile.photoUrl ?? userProfile.photoURL}
              altText={userProfile.displayName ?? ''}
              allowEditing={isOwner}
              onUpdate={(url) => {
                setUser({ photoUrl: url })
                updateCurrentUser({ photoURL: url })
              }}
            />
            <h1
              key={userProfile.displayName}
              className='title'
              contentEditable={isOwner}
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
                <Link
                  to={`/@/${user.id}`}
                  key={userProfile.displayHandle}
                  contentEditable={isOwner}
                  onClick={(e: any) => {
                    if (isOwner) e.preventDefault()
                  }}
                  onBlur={(e: any) => {
                    let value = e.currentTarget.innerHTML
                    if (value !== userProfile.displayHandle) {
                      setUser({ displayHandle: value })
                      updateCurrentUser({ displayHandle: value })
                    }
                  }}>
                  {userProfile.displayHandle ?? 'Anonymous'}
                </Link>
              </span>
              <span class='sep'>{`  •  `}</span>
            </div>
            {(userProfile.about || isOwner) && (
              <Editable
                className='bio text-center'
                readOnly={!isOwner}
                defaultValue={userProfile.about}
                placeholder='About me…'
                onChange={(about) => {
                  setUser({ about })
                }}
              />
            )}
          </div>
        </header>
        <div className='container p0'>
          {isOwner && (
            <>
              <div className='flex justify-center'>
                <Tabs
                  current=''
                  onChange={(current) => {
                    postLanguage.value = current
                  }}>
                  <span id=''>Posts</span>
                  <span id='saved'>Saved</span>
                </Tabs>
              </div>
            </>
          )}
          <div className='post-list grid grid-cols-1 md-grid-cols-2 p4'>
            <PostsList
              key={userProfile.id}
              uid={userProfile.id}
              language={postLanguage.value}
              noHeader
            />
          </div>

          {/* {isOwner && (
          <div className='danger flex justify-center'>
            <button
              className='outline'
              onClick={(e) => {
                if (window.confirm('You sure you want to delete your profile and posts?')) {
                  handleDelete(userProfile.id)
                }
              }}>
              Delete account
            </button>
          </div>
        )} */}
        </div>
      </div>

      {isOwner && <PostLanguages key={userProfile.id} title='My Languages' />}
    </>
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
