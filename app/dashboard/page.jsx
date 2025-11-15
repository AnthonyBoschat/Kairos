"use client"

import { signOut } from "next-auth/react";
import s from "./styles.module.scss"
import Divider from "@/components/divider/index"
import FolderList from "./_components/folderList/index.tsx"
import AddFolder from "./_components/addFolder/index.tsx"

const folders = [
    {name:"Clémence", color: "#0025AB"},
    {name:"Cefim", color: "#CF4F00"},
    {name:"Randonnée", color: "#06AB00"},
    {name:"Liste de course", color: "#AE05B6"},
]


export default function Dashboard(){

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/?signedOut=true" })
    }

    return(
        <div className={s.page}>
            <button onClick={handleSignOut} style={{position:"absolute", top:"1rem", right:"1rem"}}>Déconnexion</button>

            <div className={s.side}>
                <div className={s.container}>

                    {/* Logo */}
                    <img 
                        className={s.logo}
                        src="/icons/kairos_logo.svg" 
                        alt="" 
                    />

                    <Divider style={{marginTop:"1rem"}} />

                    {/* Ajouter un dossier */}
                    <AddFolder/>

                    <Divider width={"30%"} style={{marginTop:"1rem"}} />
                    
                    {/* Liste des dossiers */}
                    <FolderList folders={folders}/>

                </div>
            </div>


            <div className={s.content}>
                Content
            </div>

        </div>
    )
}