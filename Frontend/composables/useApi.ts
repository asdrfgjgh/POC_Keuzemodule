// Frontend/composables/useApi.ts
// Composable voor API calls naar de backend

export const useApi = () => {
  const config = useRuntimeConfig()
  
  // Backend URL ophalen uit runtime config
  const backendUrl = config.public.backendUrl || 'http://localhost:3000'
  const apiBase = config.public.apiBase || `${backendUrl}/api`
  
  // Helper functie voor API calls
  const apiCall = async <T>(endpoint: string, options: any = {}): Promise<T> => {
    const url = `${apiBase}${endpoint}`
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    
    const mergedOptions = { ...defaultOptions, ...options }
    
    try {
      const response = await $fetch<T>(url, mergedOptions)
      return response
    } catch (error) {
      console.error(`API call failed for ${url}:`, error)
      throw error
    }
  }
  
  // Specifieke API methods
  const api = {
    // VKMs
    getVkms: () => apiCall('/vkms'),
    getVkm: (id: string) => apiCall(`/vkms/${id}`),
    
    // Users
    getUsers: () => apiCall('/users'),
    getUser: (id: string) => apiCall(`/users/${id}`),
    toggleFavorite: (userId: string, moduleId: string) => 
      apiCall(`/users/${userId}/favorite`, {
        method: 'PATCH',
        body: { moduleId }
      })
  }
  
  return {
    backendUrl,
    apiBase,
    apiCall,
    api
  }
}
