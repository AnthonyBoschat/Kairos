"use client"

import { signIn } from "next-auth/react"
import { Dispatch, SetStateAction } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import s from "../styles.module.scss"

interface LoginProps{
    email:string,
    password:string,
    setEmail: Dispatch<SetStateAction<string>>;
    setPassword: Dispatch<SetStateAction<string>>;
}

export default function Login({
    email, setEmail,
    password, setPassword
}:LoginProps) {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    })
    
    if (result?.error) {
      toast.error("Impossible de vous connecter. Vérifiez vos identifiants et réessayez.")
    } else {
      router.push("/dashboard")
      toast.success("Connexion réussi")
    }
  }

  
  return (
    <form className={s.formAuth} onSubmit={handleSubmit}>
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
      <button type="submit">Se connecter</button>
    </form>
  )
}