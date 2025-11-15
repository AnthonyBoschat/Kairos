"use client"

import { useState } from "react";
import s from "./styles.module.scss"
import withClass from "@/utils/class";
import Login from "./_components/Login";
import useStorageState from "@/hooks/useStorageState";
import Register from "./_components/Register";

export default function Home() {

  const [tab, setTab] = useState("login")
  const [emailLogin, setEmailLogin] = useStorageState("", "email")
  const [passwordLogin, setPasswordLogin] = useState("")
  
  const [emailRegister, setEmailRegister] = useState("")
  const [passwordRegister, setPasswordRegister] = useState("")
  const [nameRegister, setNameRegister] = useState("")

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
              email={emailRegister}
              setEmail={setEmailRegister}
              password={passwordRegister}
              setPassword={setPasswordRegister}
              name={nameRegister}
              setName={setNameRegister}
            />
          )}
        </div>
      </div>

    </div>
  );
}