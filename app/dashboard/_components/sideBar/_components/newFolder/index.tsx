"use client"
import FolderSolidIcon from "@/components/ui/icons/FolderSolid"
import s from "./styles.module.scss"
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { addFolder, getNextFolderColorIndexForCurrentUser } from "@/app/actions/folder"
import FOLDER_COLORS from "@/constants/folderColor"
import handleResponse from "@/utils/handleResponse"
import useCallbackOnClickOutside from "@/hooks/useCallbackOnClickOutside"
import { useQueryClient } from "@tanstack/react-query"
import { useDashboardContext } from "@/context/DashboardContext"

interface FolderProps{
    setIsAddingFolder: Dispatch<SetStateAction<boolean>>
}


export default function AddFolderButton(props:FolderProps){

    const {user}        = useDashboardContext()
    const titleRef      = useRef<HTMLInputElement>(null);
    const containerRef  = useRef<HTMLButtonElement>(null);

    const queryClient = useQueryClient()

    const [folderColor, setFolderColor] = useState<number | null>(null);
    const [title, setTitle]             = useState("")



    const isEnter = (e: React.KeyboardEvent) => e.key === "Enter";
    
    const fetchFolderColor = async() => {
        const color = await getNextFolderColorIndexForCurrentUser()
        setFolderColor(color)
    }

    const handleAddFolder = (title:string, keyboardEvent?:React.KeyboardEvent) => {
        if(keyboardEvent) keyboardEvent.preventDefault()
        if(title.trim()){
            handleResponse(async () => {
                await addFolder({title:title})
                queryClient.invalidateQueries({queryKey:['folders', user.id]})
            })
            
        }
        if(keyboardEvent){
            setTitle("")
            props.setIsAddingFolder(true)
            fetchFolderColor()
        }else{
            props.setIsAddingFolder(false)
        }
    }
    
    useEffect(() => {
        fetchFolderColor()
        titleRef.current?.focus();
    }, [])
    
    
    
    useCallbackOnClickOutside(containerRef, () => handleAddFolder(title))

    return(
        
        <button ref={containerRef} title="Création d'un nouveau dossier" className={s.container}>
            <FolderSolidIcon color={folderColor !== null ? FOLDER_COLORS[folderColor] : 'transparent'}  size={18} />

            <input onKeyDown={(e) => isEnter(e) && handleAddFolder(title, e)} ref={titleRef} value={title} onChange={(e) => setTitle(e.currentTarget.value)} type="text"/>
        </button>
    )
}