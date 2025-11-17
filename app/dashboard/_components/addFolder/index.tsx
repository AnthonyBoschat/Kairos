"use client"
import { addFolder } from "@/app/actions/folder"
import s from "./styles.module.scss"
import FolderStrokeIcon from "@/components/ui/icons/FolderStroke"
import { toast } from "react-toastify"
import handleResponse from "@/utils/handleResponse"




export default function AddFolder(){

    const handleAddFolder = async() => {
        handleResponse(async () => {
            const response = await addFolder({title:"Nouveau dossier"})
            toast.success(response.message)
        })
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