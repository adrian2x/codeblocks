import { useRef } from 'react'
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
