"use client"

import { signOut } from "next-auth/react";

export default function Dashboard(){

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/?signedOut=true" })
    }

    return(
        <>
            <button onClick={handleSignOut} style={{position:"absolute", top:"1rem", right:"1rem"}}>Déconnexion</button>
            <span>Dashboard</span>
        </>
    )
}