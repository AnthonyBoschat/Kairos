"use client"
import { addFolder } from "@/app/actions/folder"
import s from "./styles.module.scss"
import FolderStrokeIcon from "@/components/ui/icons/FolderStroke"
import { toast } from "react-toastify"




export default function AddFolder(){

    const handleAddFolder = async() => {
        const response = await addFolder({title:"aaa"})
        if(response.success){
            toast.success(`Le dossier ${response.folder.title} a été ajouter`)
        }
    }

    return(
        <button title="Ajouter un nouveau dossier" onClick={handleAddFolder} className={s.container}>
            <FolderStrokeIcon size={18} />
            <span>
                Ajouter un dossier
            </span>
        </button>
    )
}