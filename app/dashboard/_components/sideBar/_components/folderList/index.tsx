"use client"
import s from "./styles.module.scss"
import { Folder } from "@prisma/client"
import AddFolderButton from "../newFolder"
import { Dispatch, SetStateAction, useState } from "react"
import FolderItem from "../folderItem"
import FolderOptions from "../folderOptions"

interface DefaultProps{
    isAddingFolder:boolean
    folders: Folder[]
    setIsAddingFolder: Dispatch<SetStateAction<boolean>>
}


export default function FolderList(props:DefaultProps){

    const [selectedFolderOptions, setSelectedFolderOptions] = useState<null|Folder>(null)
    

    return(
        <>
            <div className={s.container}>
                {props.isAddingFolder && <AddFolderButton setIsAddingFolder={props.setIsAddingFolder}/>}
                {props.folders.map((folder, index) => <FolderItem setSelectedFolderOptions={setSelectedFolderOptions} key={index} folder={folder}/>)}
            </div>
            {selectedFolderOptions && <FolderOptions folder={selectedFolderOptions} setSelectedFolderOptions={setSelectedFolderOptions}/>}
        </>
    )
}