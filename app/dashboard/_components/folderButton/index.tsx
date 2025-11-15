"use client"
import FolderSolidIcon from "@/components/ui/icons/FolderSolid"
import s from "./styles.module.scss"
import { Folder } from "@/types/folder"

interface FolderProps{
    folder: Folder
}


export default function FolderButton({folder}:FolderProps){


    return(
        <button className={s.container}>
            <FolderSolidIcon color={folder.color} size={18} />
            <span>
                {folder.name}
            </span>
        </button>
    )
}