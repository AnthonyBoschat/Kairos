"use client"
import FolderSolidIcon from "@/components/ui/icons/FolderSolid"
import s from "./styles.module.scss"
import FOLDER_COLORS from "@/constants/folderColor"
import { useState } from "react"
import ArrowLeftIcon from "@/components/ui/icons/ArrowLeft"
import withClass from "@/utils/class"
import OptionsIcon from "@/components/ui/icons/Options"
import FolderOptions from "../folderOptions"
import { Folder } from "@prisma/client"

interface FolderProps{
    folder: Folder
}


export default function FolderButton({folder}:FolderProps){


    const [isHover, setIsHover] = useState(false)
    const [selectedFolderOptions, setSelectedFolderOptions] = useState<null|Folder>(null)

    return(
        <>
            <button onMouseLeave={() => setIsHover(false)} onMouseEnter={() => setIsHover(true)} title="Accéder au contenu d'un dossier" className={s.container}>
                <FolderSolidIcon color={folder.customColor ? folder.customColor : FOLDER_COLORS[folder.defaultColor ?? 0]} size={18} />
                <span>
                    {folder.title}
                </span>
                <div className={withClass(s.indicator, isHover && s.active)}>
                    {isHover && <ArrowLeftIcon size={16}/>}
                </div>
                <div className={withClass(s.options, isHover && s.active)}>
                    {isHover && <div onClick={() => setSelectedFolderOptions(folder)}><OptionsIcon size={20}/></div>}
                </div>
            </button>
            {selectedFolderOptions && <FolderOptions setSelectedFolderOptions={setSelectedFolderOptions} folder={selectedFolderOptions}/>}
        </>
    )
}