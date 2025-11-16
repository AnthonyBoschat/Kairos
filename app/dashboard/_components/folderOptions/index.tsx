"use client"
import { Folder } from "@prisma/client"
import s from "./styles.module.scss"
import FOLDER_COLORS from "@/constants/folderColor"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import withClass from "@/utils/class"
import EditIcon from "@/components/ui/icons/Edit"
import FolderSolidIcon from "@/components/ui/icons/FolderSolid"

interface FolderOptionsProps{
    folder: null|Folder,
    setSelectedFolderOptions: Dispatch<SetStateAction<null|Folder>>
}


export default function FolderOptions(props:FolderOptionsProps){
    

    const [folderTitle, setFolderTitle] = useState(props.folder?.title)
    const [folderColor, setFolderColor] = useState(props.folder?.customColor ? props.folder.customColor : FOLDER_COLORS[props.folder?.defaultColor ?? 0])
    const [folderShowProgression, setFolderShowProgression] = useState(props.folder?.showProgression)
    const [isClosing, setIsClosing] = useState(false)

    const handleClose = () => {
            setIsClosing(true)
            setTimeout(() => {
                props.setSelectedFolderOptions(null)
            }, 100)
    }

    if(!props.folder) return null
    return(
        <div 
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                if(event.target === event.currentTarget){
                    handleClose()
                }
            }} 
            className={withClass(s.container, isClosing && s.closing)}
        >
            
            <div className={s.card}>
                <div className={s.header}>
                    Paramètres de dossier
                    
                </div>
                <ul className={s.options}>
                    <li className={s.title}>
                        <span className={s.key}>Nom</span>
                        <span className={s.value}>
                            {folderTitle}
                            <button>
                                <EditIcon/>
                            </button>
                        </span>
                    </li>
                    <li className={s.color}>
                        <span className={s.key}>Couleur</span>
                        <span className={s.value}>
                            <button>
                                <FolderSolidIcon color={folderColor}/> 
                            </button>
                        </span>
                    </li>
                    <li className={s.progression}>
                        <span className={s.key}>Afficher la progression</span>
                        <span className={s.value}>
                            <button onClick={() => setFolderShowProgression(true)} className={withClass(folderShowProgression && s.active)}>Oui</button>
                            <button onClick={() => setFolderShowProgression(false)} className={withClass(!folderShowProgression && s.active)}>Non</button>
                        </span>
                    </li>
                </ul>
                <div className={s.footer}>
                    <button className={s.delete}>Supprimer le dossier</button>
                    <button className={s.save}>Enregister</button>
                </div>
            </div>
        </div>
    )
}