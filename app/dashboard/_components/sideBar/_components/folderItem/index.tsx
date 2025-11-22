"use client"
import FolderSolidIcon from "@/components/ui/icons/FolderSolid"
import s from "./styles.module.scss"
import FOLDER_COLORS from "@/constants/folderColor"
import { useCallback, useMemo, useState } from "react"
import ArrowLeftIcon from "@/components/ui/icons/ArrowLeft"
import withClass from "@/utils/class"
import OptionsIcon from "@/components/ui/icons/Options"
import FolderOptions from "../folderOptions"
import { Folder } from "@prisma/client"
import { useDispatch } from "react-redux"
import { setSelectedFolderID } from "@/store/slices/folderSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

interface FolderItemProps{
    folder: Folder
}


export default function FolderItem({folder}:FolderItemProps){

    const dispatch = useAppDispatch()
    const selectedFolderID = useAppSelector(store => store.folder.selectedFolderID)
    const [isHover, setIsHover] = useState(false)
    const [selectedFolderOptions, setSelectedFolderOptions] = useState<null|Folder>(null)

    const isSelected = useMemo(() => {
        return selectedFolderID === folder.id
    }, [selectedFolderID, folder])

    const handleClick = useCallback(() => {
        dispatch(setSelectedFolderID(isSelected ? null : folder?.id))
    }, [isSelected])

    return(
        <>
            <button onClick={handleClick} onMouseLeave={() => setIsHover(false)} onMouseEnter={() => setIsHover(true)} title="Accéder au contenu d'un dossier" className={withClass(s.container, isSelected && s.active)}>
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