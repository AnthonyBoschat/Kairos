"use client"

import { useEffect, useMemo, useState } from "react";
import s from "./styles.module.scss"
import withClass from "@/utils/class";
import Login from "./_components/Login";
import useStorageState from "@/hooks/useStorageState";
import Register from "./_components/Register";
import Brand from "@/components/brand";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

export default function Home() {

  const searchParams  = useSearchParams()
  

  const [tab, setTab] = useState("login")
  const [emailLogin, setEmailLogin] = useStorageState("", "email")
  const [passwordLogin, setPasswordLogin] = useState("")
  
  const [nameRegister, setNameRegister] = useState("")
  const [emailRegister, setEmailRegister] = useState("")
  const [passwordRegister, setPasswordRegister] = useState("")
  const [confirmationRegister, setConfirmationRegister] = useState("")

    // En cas de déconnexion
  useEffect(() => {
    if(searchParams.get("signedOut") === "true") {
      toast.success("Vous avez été déconnecter")
    }
  }, [searchParams])


  return (
    <div className={s.page}>
        <div className={s.container}>

          <div className={s.header}>
            <ul className={s.tabs}>
              <li>
                <button className={withClass(tab === "login" && s.active)} onClick={() => setTab("login")}>Connexion</button>
              </li>
              <li>
                <button className={withClass(tab === "register" && s.active)} onClick={() => setTab("register")}>Inscription</button>
              </li>
            </ul>
            <Brand scale={0.9}/>
          </div>

          <div className={s.card}>
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
    </div>
  );
}