"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react" // Ajout
import { api } from "@/lib/axios"
import { toast } from "react-toastify"
import s from "./auth.module.scss"
import withClass from "@/utils/class"
import EyesOpenIcon from "@/components/ui/icons/EyesOpen"
import EyesCloseIcon from "@/components/ui/icons/EyesClose"
import axios, { AxiosError } from "axios"

interface RegisterProps{
    name:string,
    setName: Dispatch<SetStateAction<string>>;
    email:string,
    setEmail: Dispatch<SetStateAction<string>>;
    password:string,
    setPassword: Dispatch<SetStateAction<string>>;
    confirmation:string,
    setConfirmation: Dispatch<SetStateAction<string>>;
}

export default function Register(props: RegisterProps) {
  const router = useRouter()

  const [showPassword, setShowPassword]   = useState(false)
  const [emailError, setEmailError]       = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  useEffect(() => {
    if(emailError) setEmailError(false)
  }, [props.email])

  useEffect(() => {
    if(passwordError) setPasswordError(false)
  }, [props.password, props.confirmation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const payload = {
      name:props.name, 
       email:props.email, 
       password:props.password, 
       confirmation:props.confirmation, 
    }
    
    try{
      await api.post("/api/register", payload)
      const result = await signIn("credentials", {
        email: props.email,
        password: props.password,
        redirect: false
      })
      if (result?.ok) {
          toast.success("Inscription réussie")
          router.push("/dashboard")
      } 

    }catch(error){
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error
        if(message === "Les mots de passe ne correspondent pas") setPasswordError(true)
        if(message === "L'adresse e-mail est déjà utiliser") setEmailError(true)
      }
    }
  }

  return (
    <form className={s.container} onSubmit={handleSubmit}>

      <div className={s.row}>
        <label htmlFor="name">Nom</label>
        <input
          id="name"
          type="text"
          value={props.name}
          onChange={(e) => props.setName(e.target.value)}
          placeholder="Nom"
          required
        />
      </div>

      <div className={s.row}>
        <label htmlFor="email">Adresse e-mail</label>
        <input
          className={withClass(emailError && s.error)}
          id="email"
          type="email"
          value={props.email}
          onChange={(e) => props.setEmail(e.target.value)}
          placeholder="E-mail"
          required
        />
      </div>

      <div className={s.row}>
        <label htmlFor="password">Mot de passe</label>
        <div style={{position:"relative"}}>
          <input
            className={withClass(passwordError && s.error)}
            type={showPassword ? "text" : "password"}
            value={props.password}
            onChange={(e) => props.setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={s.show}
          >
            {showPassword ? <EyesOpenIcon size={20}/> : <EyesCloseIcon size={20}/>}
          </button>
        </div>
      </div>

      <div className={s.row}>
        <label htmlFor="confirmation">Confirmation</label>
        <input
          className={withClass(passwordError && s.error)}
          id="confirmation"
          type="password"
          value={props.confirmation}
          onChange={(e) => props.setConfirmation(e.target.value)}
          placeholder="Confirmation"
          required
        />
      </div>
      
      <div className={withClass(s.row, s.submit)}>
        <button type="submit">S'inscrire</button>
      </div>
    </form>
  )
}