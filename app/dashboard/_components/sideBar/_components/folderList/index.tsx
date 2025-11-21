"use client"
import s from "./styles.module.scss"
import { Folder } from "@prisma/client"
import AddFolderButton from "../newFolder"
import { Dispatch, SetStateAction } from "react"
import FolderItem from "../folderItem"

interface DefaultProps{
    isAddingFolder:boolean
    folders: Folder[]
    setIsAddingFolder: Dispatch<SetStateAction<boolean>>
}


export default function FolderList(props:DefaultProps){


    return(
        <div className={s.container}>
            {props.isAddingFolder && <AddFolderButton setIsAddingFolder={props.setIsAddingFolder}/>}
            {props.folders.map((folder, index) => <FolderItem key={index} folder={folder}/>)}
        </div>
    )
}