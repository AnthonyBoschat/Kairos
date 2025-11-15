"use client"
import s from "./styles.module.scss"
import FolderStrokeIcon from "@/components/ui/icons/FolderStroke"




export default function AddFolder(){


    return(
        <button className={s.container}>
            <FolderStrokeIcon size={18} />
            <span>
                Ajouter un dossier
            </span>
        </button>
    )
}