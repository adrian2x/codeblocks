import { useRef } from 'react'
import { avatarUrl } from './avatarUrl'
import './photo-uploader.scss'

export function PhotoUploader({
  fileName,
  value,
  altText,
  allowEditing,
  onUpdate
}: {
  fileName: string
  value: string | null
  altText?: string | null
  allowEditing?: boolean
  onUpdate?: (data: string) => any
}) {
  let inputRef = useRef<HTMLInputElement>(null)
  let imageRef = useRef<HTMLImageElement>(null)

  return (
    <div class='avatar-container' data-editor={allowEditing} title='Change photo'>
      <img
        ref={imageRef}
        class='avatar drop-shadow-4'
        src={value ?? avatarUrl(altText ?? '')}
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
              if (e.currentTarget.files) {
                let url = await handleFileUpload(fileName, e.currentTarget.files[0])
                if (imageRef.current) {
                  imageRef.current.src = url
                }
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

export async function uploadImage(name: string, blob: Blob | ArrayBuffer | Uint8Array) {
  return import('firebase/storage').then(async (module) => {
    const { getStorage, ref, uploadBytes } = module
    const storage = getStorage()
    const fileRef = ref(storage, name)
    let result = await uploadBytes(fileRef, blob)
    return result
  })
}

async function handleFileUpload(fileName: string, file: File) {
  let blob = await resizeImage(file)
  await uploadImage(fileName, blob)
  let url = `https://firebasestorage.googleapis.com/v0/b/codeblocks-991a2.appspot.com/o/${fileName}?alt=media`
  console.log('image', url)
  return url
}

function resizeImage(file: File, width = 512, quality = 0.8) {
  return new Promise<Blob>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.src = reader.result as string
      ;(img.onload = () => {
        const canvas = document.createElement('canvas')
        const newWidth = Math.min(width, img.width)
        const scaleFactor = newWidth / img.width
        canvas.width = newWidth
        canvas.height = img.height * scaleFactor
        const ctx = canvas.getContext('2d')
        // img.width and img.height will contain the original dimensions
        ctx?.drawImage(img, 0, 0, newWidth, img.height * scaleFactor)
        ctx?.canvas.toBlob((blob) => resolve(blob as Blob), 'image/jpeg', quality)
      }),
        (reader.onerror = reject)
    }
    reader.readAsDataURL(file)
  })
}
