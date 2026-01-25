import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import api from '../api/client'

export interface Drama {
  id: string
  title: string
  cover: string
  episodes: number
}

export function useDramas(page = 1) {
  return useQuery({
    queryKey: ['dramas', page],
    queryFn: async () => {
      const { data } = await api.get(`/api/foryou?page=${page}`)
      return data.data as Drama[]
    }
  })
}

export function useDramasInfinite() {
  return useInfiniteQuery({
    queryKey: ['dramas-infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get(`/api/foryou?page=${pageParam}`)
      return data.data as Drama[]
    },
    getNextPageParam: (lastPage, allPages) => lastPage.length > 0 ? allPages.length + 1 : undefined,
    initialPageParam: 1
  })
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const { data } = await api.get(`/api/search?q=${encodeURIComponent(query)}`)
      return data.data as Drama[]
    },
    enabled: query.length > 0
  })
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const { data } = await api.get(`/api/book?id=${id}`)
      return data.data
    },
    enabled: !!id
  })
}

export function useChapters(id: string) {
  return useQuery({
    queryKey: ['chapters', id],
    queryFn: async () => {
      const { data } = await api.get(`/api/chapters?id=${id}`)
      return data.data.chapters as { id: string; index: number }[]
    },
    enabled: !!id
  })
}

export function useVideo(vid: string) {
  return useQuery({
    queryKey: ['video', vid],
    queryFn: async () => {
      const { data } = await api.get(`/api/video?vid=${vid}`)
      return data.data.url as string
    },
    enabled: !!vid
  })
}
