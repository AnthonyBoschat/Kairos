"use client"

import { signIn } from "next-auth/react"
import { Dispatch, SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import s from "./styles.module.scss"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await signIn("credentials", {
      email:props.email,
      password:props.password,
      redirect: false
    })
    
    if (result?.error) {
      toast.error("Impossible de vous connecter. Vérifiez vos identifiants et réessayez.")
    } else {
      // router.push("/dashboard")
      toast.success("Connexion réussi")
    }
  }

  
  return (
    <form className={s.container} onSubmit={handleSubmit}>
      <div className={s.row}>
        <label htmlFor="email">Adresse e-mail</label>
        <input
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
            type="password"
            value={props.password}
            onChange={(e) => props.setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            {showPassword ? <EyesOpenIcon/> : <EyesCloseIcon/>}
          </button>
        </div>
        <span className={s.forgot}>
          <button>
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