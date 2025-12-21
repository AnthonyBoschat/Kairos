"use client"
import s from "./styles.module.scss"
import AddFolderButton from "../newFolder"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import FolderItem from "../folderItem"
import FolderOptions from "../folderOptions"
import { FolderWithList } from "@/types/list"
import { useAppDispatch } from "@/store/hooks"
import StorageService from "@/services/StorageService"
import { setSelectedFolderID } from "@/store/slices/folderSlice"

interface DefaultProps{
    isAddingFolder:boolean
    folders: FolderWithList[]
    setIsAddingFolder: Dispatch<SetStateAction<boolean>>
}


export default function FolderList(props:DefaultProps){

    const [selectedFolderOptions, setSelectedFolderOptions] = useState<null|FolderWithList>(null)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const storedSelectedFolderID = StorageService.get("selectedFolderID")
        if(storedSelectedFolderID){
            dispatch(setSelectedFolderID(storedSelectedFolderID))
        }
    }, [])

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