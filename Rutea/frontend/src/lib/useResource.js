import { useEffect, useState } from 'react'
import { api } from './api.js'

export function useResource(path, token) {
  const [revision, setRevision] = useState(0)
  const [result, setResult] = useState(null)
  const key = JSON.stringify([path, token, revision])

  useEffect(() => {
    if (!path) return
    const controller = new AbortController()
    api(path, { token, signal: controller.signal }).then(
      (data) => setResult({ key, data }),
      (error) => { if (error.name !== 'AbortError') setResult({ key, error: error.message }) },
    )
    return () => controller.abort()
  }, [key, path, token])

  return {
    data: result?.key === key ? result.data : undefined,
    error: result?.key === key ? result.error : '',
    reload: () => setRevision((current) => current + 1),
  }
}
