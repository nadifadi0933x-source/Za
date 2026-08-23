import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useFetchContents = (filters) => {
  return useQuery({
    queryKey: ['contents', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters)
      const response = await fetch(`/api/contents?${params}`)
      if (!response.ok) throw new Error('Failed to fetch contents')
      return response.json()
    },
  })
}

export const useFetchContent = (id) => {
  return useQuery({
    queryKey: ['content', id],
    queryFn: async () => {
      const response = await fetch(`/api/contents/${id}`)
      if (!response.ok) throw new Error('Failed to fetch content')
      return response.json()
    },
    enabled: !!id,
  })
}

export const useSearchContents = (query) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    enabled: !!query,
  })
}

export const useCreateReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (reviewData) => {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      })
      if (!response.ok) throw new Error('Failed to create review')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews'])
    },
  })
}

export const useUploadContent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData) => {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error('Upload failed')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contents'])
    },
  })
}

export const useFetchAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await fetch('/api/admin/analytics')
      if (!response.ok) throw new Error('Failed to fetch analytics')
      return response.json()
    },
  })
}
