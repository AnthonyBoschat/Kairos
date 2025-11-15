import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

/**
 * Configuration de NextAuth pour l'authentification
 * Utilise une stratégie JWT avec connexion par email/password
 */
const handler = NextAuth({
  // Configuration des méthodes de connexion disponibles
  providers: [
    CredentialsProvider({
      name: "credentials", // Identifiant du provider utilisé dans signIn()
      
      // Définition des champs du formulaire de connexion
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      
      /**
       * Vérifie les identifiants lors de la connexion
       * @returns Les données utilisateur si valide, null sinon
       */
      async authorize(credentials) {
        // Vérifie que les champs requis sont présents
        if (!credentials?.email || !credentials?.password) return null
        
        // Recherche l'utilisateur en base
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        // Vérifie l'existence de l'utilisateur et la validité du mot de passe
        if (!user || !await bcrypt.compare(credentials.password, user.password)) {
          return null // Connexion refusée
        }
        
        // Connexion acceptée : retourne les données à stocker dans le JWT
        return { 
          id: user.id, 
          email: user.email, 
          name: user.name 
        }
      }
    })
  ],
  
  // Configuration de la session
  session: {
    strategy: "jwt", // Utilise des tokens JWT (pas de session serveur)
    maxAge: 30 * 24 * 60 * 60, // Durée de validité : 30 jours
  },
  
  // Pages personnalisées
  pages: {
    signIn: "/", // Page de connexion custom
  },
  
  // Hooks appelés pendant le processus d'authentification
  callbacks: {
    /**
     * Gère les redirections après connexion
     * Redirige vers /dashboard par défaut
     */
    async redirect({ url, baseUrl }) {
      // Permet les query params dans les URLs relatives
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Permet les query params pour les URLs du même domaine
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    
    /**
     * Enrichit le token JWT avec l'ID utilisateur
     * Appelé à la création du token (première connexion)
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id // Ajoute l'ID au token
      }
      return token
    },
    
    /**
     * Enrichit la session côté client avec l'ID utilisateur
     * Appelé quand useSession() est utilisé
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string // Transfert l'ID du token vers la session
      }
      return session
    }
  }
})

// Export pour Next.js App Router (gère GET pour lire la session, POST pour login/logout)
export { handler as GET, handler as POST }