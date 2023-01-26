import { signal } from '@preact/signals'
import { useEffect, useState } from 'preact/hooks'
import toast from 'react-hot-toast'
import { Link, Params, useLoaderData, useNavigate } from 'react-router-dom'
import { currentUser, updateCurrentUser } from '../../common/firebase'
import { deleteUser, getUser, updateUser } from '../../common/requests'
import { TUser } from '../../types'
import { generateGradient } from '../posts/CodeEditor'
import { filterByLanguage, PostLanguages, PostsList } from '../posts/PostList'
import { Tabs } from '../tabs/Tabs'
import { PhotoUploader } from './PhotoUploader'
import './profile-page.scss'

export const filterBySaved = signal(false)

export async function userPostsLoader({ params }: { params: Params }) {
  if (params.user_id) {
    return getUser(params.user_id)
  }
}

export default function ProfilePage() {
  const user = useLoaderData() as TUser
  const [userProfile, setUserProfile] = useState(user)
  const [background, setBackground] = useState([user.backgroundColor] ?? generateGradient())
  const [isSaving, setSaving] = useState(false)
  const navigate = useNavigate()

  const isEditor = currentUser.value?.uid === user.id

  useEffect(() => {
    filterByLanguage.value = ''
  }, [])

  useEffect(() => {
    if (user) {
      setUserProfile(user)
      setBackground([user.backgroundColor] ?? generateGradient())
      filterBySaved.value = false
    }
  }, [user, setUserProfile, setBackground])

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
      <div className='container profile-page' data-active={isEditor && !isSaving}>
        <header>
          <div
            key={background[0]}
            className='banner'
            style={{ background: background[0] }}
            onClick={() => {
              if (isEditor) {
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
              allowEditing={isEditor}
              onUpdate={(url) => {
                setUser({ photoUrl: url })
                updateCurrentUser({ photoURL: url })
              }}
            />
            <h1
              key={userProfile.displayName}
              className='title'
              contentEditable={isEditor}
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
                  contentEditable={isEditor}
                  onClick={(e: any) => {
                    if (isEditor) e.preventDefault()
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
            {(userProfile.about || isEditor) && (
              <Editable
                className='bio text-center'
                readOnly={!isEditor}
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
          {isEditor && (
            <>
              <div className='flex justify-center'>
                <Tabs current=''>
                  <span
                    onClick={() => {
                      filterBySaved.value = false
                    }}
                    id=''>
                    Posts
                  </span>
                  <span
                    id='saved'
                    onClick={() => {
                      filterBySaved.value = true
                    }}>
                    Saved
                  </span>
                </Tabs>
              </div>
            </>
          )}

          <div className='post-list grid grid-cols-1 md-grid-cols-2 p4'>
            <PostsList
              key={userProfile.id}
              uid={userProfile.id}
              language={filterByLanguage.value}
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

      {isEditor && <PostLanguages key={userProfile.id} title='My Languages' />}
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
