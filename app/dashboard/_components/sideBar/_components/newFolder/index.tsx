"use client"
import FolderSolidIcon from "@/components/ui/icons/FolderSolid"
import s from "./styles.module.scss"
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import { addFolder, getNextColorIndexForCurrentUser } from "@/app/actions/folder"
import FOLDER_COLORS from "@/constants/folderColor"
import handleResponse from "@/utils/handleResponse"
import { toast } from "react-toastify"

interface FolderProps{
    setIsAddingFolder: Dispatch<SetStateAction<boolean>>
}


export default function AddFolderButton(props:FolderProps){

    const titleRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLButtonElement>(null);

    const [folderColor, setFolderColor] = useState<number | null>(null);
    const [title, setTitle] = useState("")

    const fetchFolderColor = async() => {
        const color = await getNextColorIndexForCurrentUser()
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

    const handleClickOutside = async (event: MouseEvent) => {
        if(containerRef.current && !containerRef.current.contains(event.target as Node)){
            await handleAddFolder()
        }
    }
    const handleKeyPress = async (event:KeyboardEvent) => {
        if(event.key === "Enter"){
            await handleAddFolder()
        }
    }   

    useEffect(() => {
        fetchFolderColor()
        titleRef.current?.focus();
    }, [])

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleKeyPress)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleKeyPress)
        }
    }, [handleAddFolder])
    


    return(
        
        <button ref={containerRef} title="Création d'un nouveau dossier" className={s.container}>
            <FolderSolidIcon color={folderColor !== null ? FOLDER_COLORS[folderColor] : 'transparent'}  size={18} />

            <input ref={titleRef} value={title} onChange={(e) => setTitle(e.currentTarget.value)} type="text"/>
        </button>
    )
}