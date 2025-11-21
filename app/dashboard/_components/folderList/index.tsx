"use client"
import s from "./styles.module.scss"
import FolderButton from "../folderButton"
import { Folder } from "@prisma/client"
import AddFolderButton from "../addFolderButton"
import { Dispatch, SetStateAction } from "react"

interface DefaultProps{
    isAddingFolder:boolean
    folders: Folder[]
    setIsAddingFolder: Dispatch<SetStateAction<boolean>>
}


export default function FolderList(props:DefaultProps){


    return(
        <div className={s.container}>
            {props.isAddingFolder && <AddFolderButton setIsAddingFolder={props.setIsAddingFolder}/>}
            {props.folders.map((folder, index) => <FolderButton key={index} folder={folder}/>)}
        </div>
    )
}