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
import { setSelectedFolderID } from "@/store/slices/folderSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import StarIcon from "@/components/ui/icons/Star"

interface FolderItemProps{
    folder: Folder
}


export default function FolderItem({folder}:FolderItemProps){

    const dispatch = useAppDispatch()
    const selectedFolderID = useAppSelector(store => store.folder.selectedFolderID)
    const [isHover, setIsHover] = useState(false)
    const [selectedFolderOptions, setSelectedFolderOptions] = useState<null|Folder>(null)

    const isFavorite = useMemo(() => {
        return folder?.favorite
    }, [folder])

    const isSelected = useMemo(() => {
        return selectedFolderID === folder.id
    }, [selectedFolderID, folder])

    const handleClick = useCallback(() => {
        dispatch(setSelectedFolderID(isSelected ? null : folder?.id))
    }, [isSelected])

    const handleClickOptions = useCallback((event:React.MouseEvent) => {
        if(folder){
            event.stopPropagation()
            setSelectedFolderOptions(folder)
        }
    }, [folder])

    return(
        <>
            <button onClick={handleClick} onMouseLeave={() => setIsHover(false)} onMouseEnter={() => setIsHover(true)} title="Accéder au contenu d'un dossier" className={withClass(s.container, isSelected && s.active)}>
                <div className={s.icons}>
                    <FolderSolidIcon color={folder.customColor ? folder.customColor : FOLDER_COLORS[folder.defaultColor ?? 0]} size={18} />
                    {isFavorite && (
                        <div title="Ce dossier est en favori" className={s.favorite}>
                            <StarIcon animate active size={16}/>
                        </div>
                    )}
                </div>
                <span className={s.title}>
                    {folder.title}
                </span>
                <div className={withClass(s.indicator, (isHover || isSelected) && s.active)}>
                    {(isHover || isSelected) && <ArrowLeftIcon size={16}/>}
                </div>
                <div className={withClass(s.options, isHover && s.active)}>
                    {isHover && <div title="Accédez aux options du dossier" onClick={(event) => handleClickOptions(event)}><OptionsIcon size={20}/></div>}
                </div>
            </button>
            {selectedFolderOptions && <FolderOptions setSelectedFolderOptions={setSelectedFolderOptions} folder={selectedFolderOptions}/>}
        </>
    )
}