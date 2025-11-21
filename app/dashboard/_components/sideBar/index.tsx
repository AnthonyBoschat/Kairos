"use client"
import Divider from "@/components/divider"
import s from "./styles.module.scss"
import AddFolder from "../addFolder"
import FolderList from "../folderList"
import Logout from "../logout"
import { useState } from "react"
import { Folder } from "@prisma/client"

interface DefaultProps{
    folders: Folder[]
}


export default function SideBar(props:DefaultProps){

    const [isAddingFolder, setIsAddingFolder] = useState(false)

    return(
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
                <AddFolder setIsAddingFolder={setIsAddingFolder}/>

                <Divider width={"30%"} style={{marginTop:"1rem"}} />
                
                {/* Liste des dossiers */}
                <FolderList setIsAddingFolder={setIsAddingFolder} isAddingFolder={isAddingFolder} folders={props.folders}/>

            </div>
            <Logout/>
        </div>
    )
}