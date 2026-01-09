"use server"
import { getCurrentUser } from "@/lib/auth"


export default async function checkUser(){
    const user = await getCurrentUser()
    if (!user?.id) throw new Error("Non autorisé")
    return user
    
}