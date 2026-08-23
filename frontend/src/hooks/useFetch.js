import { useState, useEffect, useCallback } from 'react'
import axios from '../utils/axios'
import { handleApiError } from '../utils/tokenHelper'

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.get(url, options.params ? { params: options.params } : {})
      setData(response.data)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }, [url, options])

  useEffect(() => {
    if (options.enabled !== false) {
      fetchData()
    }
  }, [fetchData, options.enabled])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}

export function usePost(url, options = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const execute = useCallback(async (payload) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.post(url, payload)
      setData(response.data)
      options.onSuccess?.(response.data)
      return response.data
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      options.onError?.(errorMessage)
      throw errorMessage
    } finally {
      setLoading(false)
    }
  }, [url, options])

  return { execute, loading, error, data }
}

export function usePut(url, options = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const execute = useCallback(async (id, payload) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.put(`${url}/${id}`, payload)
      setData(response.data)
      options.onSuccess?.(response.data)
      return response.data
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      options.onError?.(errorMessage)
      throw errorMessage
    } finally {
      setLoading(false)
    }
  }, [url, options])

  return { execute, loading, error, data }
}

export function useDelete(url, options = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    
    try {
      await axios.delete(`${url}/${id}`)
      options.onSuccess?.()
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      options.onError?.(errorMessage)
      throw errorMessage
    } finally {
      setLoading(false)
    }
  }, [url, options])

  return { execute, loading, error }
}
