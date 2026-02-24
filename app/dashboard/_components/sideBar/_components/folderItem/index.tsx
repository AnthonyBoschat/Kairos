"use client"
import FolderSolidIcon from "@/components/ui/icons/FolderSolid"
import s from "./styles.module.scss"
import FOLDER_COLORS from "@/constants/folderColor"
import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react"
import ArrowLeftIcon from "@/components/ui/icons/ArrowLeft"
import withClass from "@/utils/class"
import OptionsIcon from "@/components/ui/icons/Options"
import StarIcon from "@/components/ui/icons/Star"
import handleResponse from "@/utils/handleResponse"
import { restoreFolder, restoreFolderResponse, toggleFolderFavorite, toggleFolderFavoriteResponse } from "@/app/actions/folder"
import { FolderWithList } from "@/types/list"
import Highlight from "@/components/highlight"
import { useDashboardContext } from "@/context/DashboardContext"
import { usePathname, useRouter } from "next/navigation"
import RestoreIcon from "@/components/ui/icons/restore"
import { useQueryClient } from "@tanstack/react-query"

interface FolderItemProps{
    folder: FolderWithList
    setSelectedFolderOptions: Dispatch<SetStateAction<FolderWithList | null>>
}


export default function FolderItem(props:FolderItemProps){

    const router        = useRouter()
    const pathname      = usePathname()
    const queryClient   = useQueryClient()

    const {selectedFolderID, searchContextValue, user}    = useDashboardContext()
    const [isHover, setIsHover] = useState(false)

    const URLoptions = props.folder.listStandaloneID ? `?standaloneID=${props.folder.listStandaloneID}` : ""
    const folderDetailURL = `/dashboard/${props.folder.id}`
    const isFolderDeleted = props.folder.deletedAt !== null

    const isFavorite = useMemo(() => {
        return props.folder?.favorite
    }, [props.folder])

    const isSelected = useMemo(() => {
        return folderDetailURL === pathname
    }, [selectedFolderID, props.folder, folderDetailURL, pathname])

    const syncQueryClientData = (response:any) => {
        if(response.success && response.updatedFolder){
            queryClient.setQueriesData<FolderWithList[]>({queryKey:['folders', user.id]}, (previousFolders) => {
                if(!previousFolders) return previousFolders
                return previousFolders.map(folder => folder.id === response.updatedFolder.id ? {...folder, ...response.updatedFolder} : folder)
            })
        }
    }

    const handleToggleFavorite = (event:React.MouseEvent) => {
        if(props.folder?.id){
            event.stopPropagation()
            const folderID = props.folder.id
            handleResponse({
                request: () => toggleFolderFavorite(folderID),
                onSuccess: (response:toggleFolderFavoriteResponse) => {
                    syncQueryClientData(response)
                },
            })
        }
    }

    const handleRestoreFolder = (event: React.MouseEvent) => {
        if(props.folder?.id){
            event.stopPropagation()
            const folderID = props.folder.id
            handleResponse({
                request: () => restoreFolder(folderID),
                onSuccess: (response:restoreFolderResponse) => {
                    syncQueryClientData(response)
                    queryClient.invalidateQueries({queryKey: ["lists", folderID]})

                },
            })
        }
    }

    const handleClick = useCallback(() => {
        if(pathname === folderDetailURL){
            router.push("/dashboard")
        }else{
            router.push(`${folderDetailURL}${URLoptions}`)
        }
    }, [isSelected, props.folder, pathname, folderDetailURL ])

    const handleClickOptions = useCallback((event:React.MouseEvent) => {
        if(props.folder){
            event.stopPropagation()
            props.setSelectedFolderOptions(props.folder)
        }
    }, [props.folder])

    return(
        <button 
            onClick={handleClick} 
            onMouseLeave={() => setIsHover(false)} 
            onMouseEnter={() => setIsHover(true)} title="Accéder au contenu d'un dossier" 
            className={withClass(
                s.container, 
                isSelected && s.active,
                isFolderDeleted && s.deleted
            )}
        >
            <div className={s.icons}>
                <FolderSolidIcon color={FOLDER_COLORS[props.folder.color ?? 0]} size={18} />
                {(isFavorite && !isFolderDeleted) && (
                    <div onClick={handleToggleFavorite} title="Ce dossier est en favori" className={s.favorite}>
                        <StarIcon animate active size={16}/>
                    </div>
                )}
                {(!isFavorite && isHover && !isFolderDeleted) && (
                    <div onClick={handleToggleFavorite} title="Ajouter ce dossier aux favori ?" className={s.favorite}>
                        <StarIcon size={16}/>
                    </div>
                )}
            </div>
            <span className={s.title}>
                {searchContextValue 
                    ? <Highlight text={props.folder.title} search={searchContextValue}/>
                    : props.folder.title
                
                }
            </span>
            <div className={withClass(s.indicator, (isHover || isSelected) && s.active)}>
                {(isHover || isSelected) && <ArrowLeftIcon size={16}/>}
            </div>

            <div className={withClass(s.options, isHover && s.active)}>
                {isFolderDeleted && (
                            <div 
                                className={s.restore}
                                title={`Restaurer le dossier "${props.folder.title}"` }
                                onClick={handleRestoreFolder}
                            >
                                <RestoreIcon size={18}/>
                            </div>
                        )}
                {(isHover && !isFolderDeleted) && (
                    <div 
                        className={s.option} 
                        title="Accédez aux options du dossier" 
                        onClick={handleClickOptions}
                    >
                        <OptionsIcon size={20}/>
                    </div>
                )}
            </div>

        </button>
    )
}