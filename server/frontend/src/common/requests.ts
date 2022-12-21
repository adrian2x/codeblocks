export function request(endpoint: string, body: any = undefined, customConfig: any = {}) {
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
  return window.fetch(endpoint, config).then((response) => response.json())
}

export function getPost(id: string) {
  return request(`/posts/${id}`)
}

export function getPosts(id: string) {
  return request(`/posts/${id}`)
}

export async function updatePost(post: any) {
  // Make a request with the post content
  let data = await request('/posts/', post)
  return data
}
