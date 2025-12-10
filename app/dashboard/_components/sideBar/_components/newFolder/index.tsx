"use client"
import FolderSolidIcon from "@/components/ui/icons/FolderSolid"
import s from "./styles.module.scss"
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import { addFolder, getNextFolderColorIndexForCurrentUser } from "@/app/actions/folder"
import FOLDER_COLORS from "@/constants/folderColor"
import handleResponse from "@/utils/handleResponse"
import { toast } from "react-toastify"
import useCallbackOnClickOutside from "@/hooks/useCallbackOnClickOutside"

interface FolderProps{
    setIsAddingFolder: Dispatch<SetStateAction<boolean>>
}


export default function AddFolderButton(props:FolderProps){

    const titleRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLButtonElement>(null);

    const [folderColor, setFolderColor] = useState<number | null>(null);
    const [title, setTitle] = useState("")

    const isEnter = (e: React.KeyboardEvent) => e.key === "Enter";
    

    const fetchFolderColor = async() => {
        const color = await getNextFolderColorIndexForCurrentUser()
        setFolderColor(color)
    }

    const handleAddFolder = useCallback(async() => {
        if(title.trim()){
            handleResponse(async () => {
                const response = await addFolder({title:title})
                toast.success(response.message)
            })
        }
        props.setIsAddingFolder(false)
    }, [title])
    
    useEffect(() => {
        fetchFolderColor()
        titleRef.current?.focus();
    }, [])
    
    
    
    useCallbackOnClickOutside(containerRef, handleAddFolder)

    return(
        
        <button ref={containerRef} title="Création d'un nouveau dossier" className={s.container}>
            <FolderSolidIcon color={folderColor !== null ? FOLDER_COLORS[folderColor] : 'transparent'}  size={18} />

            <input onKeyDown={(e) => isEnter(e) && handleAddFolder()} ref={titleRef} value={title} onChange={(e) => setTitle(e.currentTarget.value)} type="text"/>
        </button>
    )
}