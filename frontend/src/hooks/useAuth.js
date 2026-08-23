import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import authService from '../services/authService'

export function useLogin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries(['user'])
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userData) => authService.register(userData),
    onSuccess: () => {
      queryClient.invalidateQueries(['user'])
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
    retry: false,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userData) => authService.updateProfile(userData),
    onSuccess: () => {
      queryClient.invalidateQueries(['user'])
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (passwordData) => authService.changePassword(passwordData),
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email) => authService.forgotPassword(email),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }) => authService.resetPassword(token, password),
  })
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token) => authService.verifyEmail(token),
  })
}
