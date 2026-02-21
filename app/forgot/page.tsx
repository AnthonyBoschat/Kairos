"use client"
import handleResponse from "@/utils/handleResponse"
import s from "./styles.module.scss"
import { forgotPassword } from "../actions/auth"
import React from "react"
import { toast } from "react-toastify"
import ArrowLeftIcon from "@/components/ui/icons/ArrowLeft"

interface ForgotPasswordProps{

}


export default function ForgotPassword(props:ForgotPasswordProps){


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form)
        const email = formData.get("email") as string
        handleResponse(async() => {
            const response = await forgotPassword(email);
            if(response.success){
                toast.success("Code de réinitialisation envoyé.")
                form.reset()
            }
        })
    }

    return(
        <div className={s.container}>
            <a href="/"><ArrowLeftIcon size={18}/> Page de connexion</a>

            <h1>Mot de passe oublié</h1>
            
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Adresse email</label>
                <input placeholder="abc@hotmail.com" name="email" type="email" id="email" />
                <input className={s.submit} type="submit" value={"Envoyer un code de validation"} />
            </form>
        </div>
    )
}