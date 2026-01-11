"use client"
import withClass from "@/utils/class"
import s from "./auth.module.scss"
import { useState } from "react"
import useStorageState from "@/hooks/useStorageState"
import Login from "./Login"
import Register from "./Register"

interface DefaultProps{

}


export default function AuthCard(props:DefaultProps){

      const [tab, setTab] = useState("login")
      const [emailLogin, setEmailLogin] = useStorageState("", "email")
      const [passwordLogin, setPasswordLogin] = useState("")
      
      const [nameRegister, setNameRegister] = useState("")
      const [emailRegister, setEmailRegister] = useState("")
      const [passwordRegister, setPasswordRegister] = useState("")
      const [confirmationRegister, setConfirmationRegister] = useState("")

    return(
        <div className={s.card}>

            <div className={s.header}>
              <ul className={s.tabs}>
                <li>
                  <button className={withClass(tab === "login" && s.active)} onClick={() => setTab("login")}>Connexion</button>
                </li>
                <li>
                  <button className={withClass(tab === "register" && s.active)} onClick={() => setTab("register")}>Inscription</button>
                </li>
              </ul>
            </div>
            <div className={s.form}>
              {tab === "login" && (
                <Login
                  email={emailLogin}
                  setEmail={setEmailLogin}
                  password={passwordLogin}
                  setPassword={setPasswordLogin}
                />
              )}
              {tab === "register" && (
                <Register
                  name={nameRegister}
                  setName={setNameRegister}
                  email={emailRegister}
                  setEmail={setEmailRegister}
                  password={passwordRegister}
                  setPassword={setPasswordRegister}
                  confirmation={confirmationRegister}
                  setConfirmation={setConfirmationRegister}
                />
              )}
            </div>
          </div>
    )
}