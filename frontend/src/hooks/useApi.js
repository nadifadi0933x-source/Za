import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

export function useFetch(endpoint, options = {}) {
  return useQuery({
    queryKey: [endpoint, options],
    queryFn: async () => {
      const response = await api.get(endpoint, { params: options.params })
      return response.data
    },
    enabled: options.enabled !== false,
    ...options,
  })
}

export function useCreate(endpoint, options = {}) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(endpoint, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries([endpoint])
      options.onSuccess?.(response)
    },
  })
}

export function useUpdate(endpoint, options = {}) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`${endpoint}/${id}`, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries([endpoint])
      options.onSuccess?.(response)
    },
  })
}

export function useDelete(endpoint, options = {}) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => api.delete(`${endpoint}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries([endpoint])
      options.onSuccess?.()
    },
  })
}

export function usePatch(endpoint, options = {}) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`${endpoint}/${id}`, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries([endpoint])
      options.onSuccess?.(response)
    },
  })
}
