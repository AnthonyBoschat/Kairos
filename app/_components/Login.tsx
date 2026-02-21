"use client"

import { signIn } from "next-auth/react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import s from "./auth.module.scss"
import withClass from "@/utils/class"
import EyesOpenIcon from "@/components/ui/icons/EyesOpen"
import EyesCloseIcon from "@/components/ui/icons/EyesClose"

interface LoginProps{
    email:string,
    password:string,
    setEmail: Dispatch<SetStateAction<string>>;
    setPassword: Dispatch<SetStateAction<string>>;
}

export default function Login(props:LoginProps) {

  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if(showError){
      setShowError(false)
    }
  }, [props.email, props.password])

  const handleSubmit = async (e: React.FormEvent) => {
    setShowError(false)
    e.preventDefault()
    const result = await signIn("credentials", {
      email:props.email,
      password:props.password,
      redirect: false
    })
    if (result?.error) {
      if(result?.error === "notFound") setShowError(true)
      toast.error("Impossible de vous connecter. Vérifiez vos identifiants et réessayez.")
    } else {
      router.push("/dashboard")
      toast.success("Connexion réussi")
    }
  }


  const handleForgotPassword = async () => {
    router.push("/forgot")
  };

  return (
    <form className={s.container} onSubmit={handleSubmit}>
      <div className={s.row}>
        <label htmlFor="email">Adresse e-mail</label>
        <input
          className={withClass(showError && s.error)}
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
            className={withClass(showError && s.error)}
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
        <span className={s.forgot}>
          <button type="button" onClick={handleForgotPassword}>
            Mot de passe oublié ?
          </button>
        </span>
      </div>
      <div className={withClass(s.row, s.submit)}>
        <button type="submit">Se connecter</button>
      </div>
    </form>
  )
}