"use client"
import { Folder } from "@/types/folder"
import s from "./styles.module.scss"
import FolderButton from "../folderButton"

interface DefaultProps{
    folders: Folder[]
}


export default function FolderList(props:DefaultProps){


    return(
        <div className={s.container}>
            {props.folders.map((folder, index) => <FolderButton key={index} folder={folder}/>)}
        </div>
    )
}