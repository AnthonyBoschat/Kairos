"use client"
import s from "./styles.module.scss"
import FolderStrokeIcon from "@/components/ui/icons/FolderStroke"
import { Dispatch, SetStateAction } from "react"


interface AddFolderProps{
    setIsAddingFolder: Dispatch<SetStateAction<boolean>>
}

export default function addFolderButton(props:AddFolderProps){

    const handleClick = async() => {
        props.setIsAddingFolder(current => !current)
    }

    return(
        <button title="Ajouter un nouveau dossier" onClick={handleClick} className={s.container}>
            <FolderStrokeIcon size={18} />
            <span>
                Ajouter un dossier
            </span>
        </button>
    )
}