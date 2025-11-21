"use client"
import Divider from "@/components/divider"
import s from "./styles.module.scss"
import AddFolderButton from "./_components/addFolderButton"
import FolderList from "./_components/folderList"
import Logout from "./_components/logout"
import { useState } from "react"
import { Folder } from "@prisma/client"

interface SideBarProps{
    folders: Folder[]
}


export default function SideBar(props:SideBarProps){

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
                <AddFolderButton setIsAddingFolder={setIsAddingFolder}/>

                <Divider width={"30%"} style={{marginTop:"1rem"}} />
                
                {/* Liste des dossiers */}
                <FolderList setIsAddingFolder={setIsAddingFolder} isAddingFolder={isAddingFolder} folders={props.folders}/>

            </div>
            <Logout/>
        </div>
    )
}