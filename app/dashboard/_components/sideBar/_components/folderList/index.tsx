"use client"
import s from "./styles.module.scss"
import AddFolderButton from "../newFolder"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import FolderItem from "../folderItem"
import FolderOptions from "../folderOptions"
import { FolderWithList } from "@/types/list"
import StorageService from "@/services/StorageService"
import { reorderFolders } from "@/app/actions/folder"
import DragAndDrop from "@/components/dragAndDrop"
import handleResponse from "@/utils/handleResponse"
import { useDashboardContext } from "@/context/DashboardContext"

interface FolderListProps{
    isAddingFolder:boolean
    folders: FolderWithList[]
    setIsAddingFolder: Dispatch<SetStateAction<boolean>>
}


export default function FolderList(props:FolderListProps){

    const {setSelectedFolderID} = useDashboardContext()
    const [selectedFolderOptions, setSelectedFolderOptions] = useState<null|FolderWithList>(null)
    const [orderedFolders, setOrderedFolders]               = useState<FolderWithList[]>(props.folders);

    useEffect(() => setOrderedFolders(props.folders), [props.folders]);

    useEffect(() => {
        const storedSelectedFolderID = StorageService.get("selectedFolderID")
        if(storedSelectedFolderID){
            setSelectedFolderID(storedSelectedFolderID)
        }
    }, [])

    const handleReorderFolders = async (newFolders: FolderWithList[]) => {
        handleResponse(() => {
            setOrderedFolders(newFolders);
            const orderedFolderIds = newFolders.map(folder => folder.id)
            reorderFolders(orderedFolderIds);
        })
    }

    return(
        <>
            <div className={s.container}>
                {props.isAddingFolder && <AddFolderButton setIsAddingFolder={props.setIsAddingFolder}/>}
                <DragAndDrop
                    items={orderedFolders}
                    getItemId={(folder) => folder.id}
                    onReorder={handleReorderFolders}
                    renderItem={({ item: folder }) => (
                        <FolderItem folder={folder} setSelectedFolderOptions={setSelectedFolderOptions} />
                    )}
                />
            </div>
            {selectedFolderOptions && <FolderOptions folder={selectedFolderOptions} setSelectedFolderOptions={setSelectedFolderOptions}/>}
        </>
    )
}