export function request(endpoint: string, body = undefined, customConfig: any = {}) {
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
  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then((response) => response.json())
}
