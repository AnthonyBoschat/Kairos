import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { ApiResponse } from "@/lib/api-response"

export async function POST(req: Request) {
  try {
    const { email, password, name, confirmation } = await req.json()
    
    if (!email || !password || !name || !confirmation) {
      return ApiResponse.badRequest("Tous les champs sont requis")
    }

    if (password !== confirmation) {
      return ApiResponse.badRequest("Les mots de passe ne correspondent pas")
    }
    
    const exists = await prisma.user.findUnique({
      where: { email }
    })
    
    if (exists) {
      return ApiResponse.conflict("L'adresse e-mail est déjà utiliser")
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    })
    
    return ApiResponse.created({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    })
  } catch (error) {
    return ApiResponse.serverError()
  }
}