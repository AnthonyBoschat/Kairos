"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react" // Ajout
import { api } from "@/lib/axios"
import { toast } from "react-toastify"
import s from "../styles.module.scss"

interface RegisterProps{
    email:string,
    password:string,
    name:string,
    setEmail: Dispatch<SetStateAction<string>>;
    setPassword: Dispatch<SetStateAction<string>>;
    setName: Dispatch<SetStateAction<string>>;
}

export default function Register({
  email, setEmail,
  password, setPassword,
  name, setName
}: RegisterProps) {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    

    await api.post("/api/register", { email, password, name })
    
    const result = await signIn("credentials", {
    email,
    password,
    redirect: false
    })
    
    if (result?.ok) {
        toast.success("Inscription réussie")
        router.push("/dashboard")
    } 
  }

  return (
    <form className={s.formAuth} onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-mail"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        required
      />
      <button type="submit">S'inscrire</button>
    </form>
  )
}