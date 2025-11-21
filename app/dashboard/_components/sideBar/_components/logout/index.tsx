"use client"
import { signOut } from "next-auth/react"


export default function Logout(){

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/?signedOut=true" })
    }

    return(
        <button onClick={handleSignOut} style={{position:"absolute", bottom:"1rem", left:"5rem"}}>Déconnexion</button>
    )
}