export function request<TResponse = {}>(
  endpoint: string,
  body: any = undefined,
  customConfig: RequestInit = {}
) {
  const config: any = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...customConfig.headers
    }
  }
  if (body) {
    config.body = JSON.stringify(body)
  }
  return window.fetch(endpoint, config).then((response) => response.json() as TResponse)
}

request.get = <T>(url: string) => request<T>(url)

request.post = <T>(url: string, body: any, customConfig: RequestInit = {}) =>
  request<T>(url, body, customConfig)

request.delete = <T>(url: string, body = undefined, customConfig: RequestInit = {}) =>
  request<T>(url, body, {
    method: 'DELETE',
    ...customConfig
  })

export interface TPost {
  id: string
  title: string
  description: string
  created: number
  code: string
  windowTitle?: string
  language: string
  theme: string
  user: {
    id: string
    uid: string
    displayName: string
    displayHandle: string
    photoUrl: string | null
  }
  preview?: string
}

export function getPost(id: string) {
  return request<TPost>(`/api/posts/${id}`)
}

export function getPosts(uid?: string, cursor?: string, language?: string) {
  console.log(location)
  let url = new URL('/api/posts/', location.origin)
  if (uid) url.searchParams.set('uid', uid)
  if (cursor) url.searchParams.set('cursor', cursor)
  if (language) url.searchParams.set('language', language)
  return request<TPost[]>(url.toString())
}

export async function createPost(post: any) {
  // Make a request with the post content
  let data = await request<TPost>('/api/posts/', post)
  return data
}

export async function duplicatePost(userId: string, post: any) {
  // Make a request with the post content
  let data = await request<TPost>(`/api/posts/copy/${userId}`, {
    ...post,
    created: Date.now()
  })
  return data
}

export async function updatePost(id: string, post: Partial<TPost>) {
  // Make a request with the post content
  let data = await request<TPost>(`/api/posts/${id}`, post)
  return data
}

export type CustomUser = {
  id: string
  photoUrl: string
  photoURL: string
  displayName: string
  displayHandle: string
  backgroundColor?: string
  about?: string
}

export type GetUserResponse = {
  user: CustomUser
  posts: TPost[]
}

export function getUser(user_id: string) {
  return request<GetUserResponse>(`/api/users/${user_id}`)
}

export function createUser(user: any) {
  return request(`/api/users/`, user)
}

export function updateUser(userId: string, user: any) {
  return request(`/api/users/${userId}`, user)
}

export function deletePost(id: string) {
  return request.delete<TPost>(`/api/posts/${id}`)
}

export function deleteUser(id: string) {
  return request.delete<TPost>(`/api/users/${id}`)
}
