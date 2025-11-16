"use client"
import FolderSolidIcon from "@/components/ui/icons/FolderSolid"
import s from "./styles.module.scss"
import { Folder } from "@/types/folder"
import FOLDER_COLORS from "@/constants/folderColor"
import { useState } from "react"
import ArrowLeftIcon from "@/components/ui/icons/ArrowLeft"
import withClass from "@/utils/class"
import OptionsIcon from "@/components/ui/icons/Options"

interface FolderProps{
    folder: Folder
}


export default function FolderButton({folder}:FolderProps){


    const [isHover, setIsHover] = useState(false)

    return(
        <button onMouseLeave={() => setIsHover(false)} onMouseEnter={() => setIsHover(true)} title="Accéder au contenu d'un dossier" className={s.container}>
            <FolderSolidIcon color={folder.customColor ? folder.customColor : FOLDER_COLORS[folder.defaultColor ?? 0]} size={18} />
            <span>
                {folder.title}
            </span>
            <div className={withClass(s.indicator, isHover && s.active)}>
                {isHover && <ArrowLeftIcon size={16}/>}
            </div>
            <div className={withClass(s.options, isHover && s.active)}>
                {isHover && <button onClick={() => console.log("click option")}><OptionsIcon size={20}/></button>}
            </div>
        </button>
    )
}