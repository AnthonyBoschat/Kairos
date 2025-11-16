import axios from 'axios'
import { toast } from 'react-toastify'

/**
 * Instance Axios configurée pour l'application
 * - BaseURL automatique
 * - Headers par défaut
 * - Gestion d'erreurs centralisée
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Intercepteur de réponse pour gérer les erreurs globalement
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extraction du message d'erreur
    const message = error.response?.data?.error || 'Une erreur est survenue'
    
    toast.error(message)
    
    return Promise.reject(error)
  }
)