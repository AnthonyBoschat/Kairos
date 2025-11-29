"use client"
import FolderSolidIcon from "@/components/ui/icons/FolderSolid"
import s from "./styles.module.scss"
import FOLDER_COLORS from "@/constants/folderColor"
import { Dispatch, useCallback, useMemo, useState } from "react"
import ArrowLeftIcon from "@/components/ui/icons/ArrowLeft"
import withClass from "@/utils/class"
import OptionsIcon from "@/components/ui/icons/Options"
import { Folder } from "@prisma/client"
import { setSelectedFolderID } from "@/store/slices/folderSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import StarIcon from "@/components/ui/icons/Star"
import handleResponse from "@/utils/handleResponse"
import { toggleFolderFavorite } from "@/app/actions/folder"
import { toast } from "react-toastify"

interface FolderItemProps{
    folder: Folder
    setSelectedFolderOptions: Dispatch<null|Folder>
}


export default function FolderItem(props:FolderItemProps){

    const dispatch = useAppDispatch()
    const selectedFolderID = useAppSelector(store => store.folder.selectedFolderID)
    const [isHover, setIsHover] = useState(false)

    const isFavorite = useMemo(() => {
        return props.folder?.favorite
    }, [props.folder])

    const isSelected = useMemo(() => {
        return selectedFolderID === props.folder.id
    }, [selectedFolderID, props.folder])

    const handleToggleFavorite = (event:React.MouseEvent) => {
        if(props.folder?.id){
            event.stopPropagation()
            const folderID = props.folder.id
            handleResponse(async () => {
                const response = await toggleFolderFavorite(folderID)
                toast.success(response.message)
            })
        }
    }

    const handleClick = useCallback(() => {
        dispatch(setSelectedFolderID(isSelected ? null : props.folder?.id))
    }, [isSelected, props.folder])

    const handleClickOptions = useCallback((event:React.MouseEvent) => {
        if(props.folder){
            event.stopPropagation()
            props.setSelectedFolderOptions(props.folder)
        }
    }, [props.folder])

    return(
        <>
            <button onClick={handleClick} onMouseLeave={() => setIsHover(false)} onMouseEnter={() => setIsHover(true)} title="Accéder au contenu d'un dossier" className={withClass(s.container, isSelected && s.active)}>
                <div className={s.icons}>
                    <FolderSolidIcon color={props.folder.customColor ? props.folder.customColor : FOLDER_COLORS[props.folder.defaultColor ?? 0]} size={18} />
                    {isFavorite && (
                        <div onClick={handleToggleFavorite} title="Ce dossier est en favori" className={s.favorite}>
                            <StarIcon animate active size={16}/>
                        </div>
                    )}
                    {(!isFavorite && isHover) && (
                        <div onClick={handleToggleFavorite} title="Ajouter ce dossier aux favori ?" className={s.favorite}>
                            <StarIcon size={16}/>
                        </div>
                    )}
                </div>
                <span className={s.title}>
                    {props.folder.title}
                </span>
                <div className={withClass(s.indicator, (isHover || isSelected) && s.active)}>
                    {(isHover || isSelected) && <ArrowLeftIcon size={16}/>}
                </div>
                <div className={withClass(s.options, isHover && s.active)}>
                    {isHover && <div title="Accédez aux options du dossier" onClick={(event) => handleClickOptions(event)}><OptionsIcon size={20}/></div>}
                </div>
            </button>
        </>
    )
}