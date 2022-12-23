export function request<TResponse = {}>(
  endpoint: string,
  body: any = undefined,
  customConfig: any = {}
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

export interface TPost {
  id: string
  title: string
  description: string
  created: number
  code: string
  language: string
  theme: string
  user: {
    uid: string
    displayName: string
    handleName: string
    photoUrl: string | null
  }
}

export function getPost(id: string) {
  return request<TPost>(`/api/posts/${id}`)
}

export function getPosts(uid?: string) {
  let params = new URLSearchParams()
  if (uid) params.set('uid', uid)
  return request(`/api/posts/?${params.toString()}`)
}

export async function createPost(post: any) {
  // Make a request with the post content
  let data = await request<TPost>('/api/posts/', post)
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
  displayName: string
  displayHandle: string
  backgroundColor?: string
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
