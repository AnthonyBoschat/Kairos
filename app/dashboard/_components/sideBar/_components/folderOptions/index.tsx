"use client"
import s from "./styles.module.scss"
import FOLDER_COLORS from "@/constants/folderColor"
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react"
import withClass from "@/utils/class"
import EditIcon from "@/components/ui/icons/Edit"
import FolderSolidIcon from "@/components/ui/icons/FolderSolid"
import { deleteFolder, toggleFolderFavorite, updateFolder, updateFolderColor } from "@/app/actions/folder"
import { toast } from "react-toastify"
import handleResponse from "@/utils/handleResponse"
import Confirmation from "@/components/confirm"
import COLOR from "@/constants/color"
import StarIcon from "@/components/ui/icons/Star"
import Overlay from "@/components/overlay"
import { FolderWithList } from "@/types/list"
import StorageService from "@/services/StorageService"
import ColorOptions from "@/components/colorOptions"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

interface FolderOptionsProps{
    folder: FolderWithList,
    setSelectedFolderOptions: Dispatch<SetStateAction<null|FolderWithList>>
}


export default function FolderOptions(props:FolderOptionsProps){

    const queryClient = useQueryClient()
    const router = useRouter()
    const folderDetailURL = `/dashboard/${props.folder.id}`
    const [isOpenColorOptions, setIsOpenColorOptions]           = useState<Boolean>(false)
    const [folderTitle, setFolderTitle]         = useState(props.folder?.title)
    const [folderColor, setFolderColor]         = useState(FOLDER_COLORS[props.folder?.color ?? 0])
    const [folderFavorite, setFolderFavorite]   = useState(props.folder?.favorite)
    const [onEditTitle, setOnEditTitle]         = useState<Boolean>(false)
    const folderTitleInputRef = useRef<null|HTMLInputElement>(null)
    const canDeleteWithoutConfirmation = props.folder.lists.length === 0

    const serverState = useMemo(() => {
        return {
            title: props.folder.title,
            color: FOLDER_COLORS[props.folder?.color ?? 0],
            folderStandaloneListID: props.folder?.listStandaloneID,
        }
    }, [props])

    const formState = useMemo(() => {
        return {
            title: folderTitle,
            color: folderColor,
        }
    }, [folderTitle])

    const haveModificationUnsaved = useMemo(() => {
        return JSON.stringify(serverState) !== JSON.stringify(formState)
    }, [serverState, formState])

    const handleDeleteFolder = async() => {
        if(props.folder?.id){
            const folderID = props.folder.id
            handleResponse(async () => {
                await deleteFolder(folderID)
                router.push("/dashboard")
                props.setSelectedFolderOptions(null)
                StorageService.remove("selectedFolderID")
                queryClient.invalidateQueries({queryKey:["historic"]})
            })
        }
    }

    const handleToggleFavorite = async() => {
        if(props.folder?.id){
            const folderID = props.folder.id
            handleResponse(async () => {
                await toggleFolderFavorite(folderID)
                setFolderFavorite(current => !current)
            })
        }
    }

    const handleSave = async() => {
        handleResponse(async() => {
            await updateFolder({
                folderID:props.folder?.id,
                title:folderTitle,
            })
            setOnEditTitle(false)
            queryClient.invalidateQueries({queryKey:["historic"]})
            queryClient.invalidateQueries({queryKey:["lists", props.folder.id]})
            props.setSelectedFolderOptions(prev => prev ? {
                ...prev,
                title: folderTitle
            } : null)
        })
    }

    const handleUpdateColor = async(colorIndex:number) => {
        handleResponse(async() => {
            await updateFolderColor(props.folder.id, colorIndex)
            toast.dismiss()
            setFolderColor(FOLDER_COLORS[colorIndex])
            props.setSelectedFolderOptions(prev => prev ? {
                ...prev,
                color: colorIndex
            } : null)
        })
    }

    useEffect(() => {
        if(folderTitleInputRef.current){
            if(onEditTitle) folderTitleInputRef.current.focus()
            else folderTitleInputRef.current.blur()
        }
    }, [onEditTitle, folderTitleInputRef])


    if(!props.folder) return null
    return(
        <Overlay root onClose={() => props.setSelectedFolderOptions(null)}>
            {(isClosing) => (
                <div
                    className={withClass(s.container, isClosing && s.closing)}
                >
                    <div className={s.card}>
                        <div className={s.header}>
                            <span>
                                Paramètres de dossier
                            </span>
                            <button onClick={handleToggleFavorite}>
                                <StarIcon animate active={folderFavorite} size={24}/>
                            </button>
                        </div>


                        <ul className={s.options}>


                            <li className={s.title}>
                                <span className={s.key}>Nom</span>
                                <span className={s.value}>
                                    <input ref={folderTitleInputRef} onChange={(e) => setFolderTitle(e.target.value)} className={withClass(onEditTitle && s.active)} type="text" value={folderTitle} />
                                    <button className={withClass(onEditTitle && s.active)} onClick={() => setOnEditTitle(current => !current)}>
                                        <EditIcon/>
                                    </button>
                                </span>
                            </li>


                            <li className={s.color}>
                                <span className={s.key}>Couleur</span>
                                <span className={s.value}>
                                    <button className={withClass(isOpenColorOptions && s.active)} onClick={() => setIsOpenColorOptions(current => !current)}>
                                        <FolderSolidIcon color={folderColor}/> 
                                    </button>
                                </span>
                                {isOpenColorOptions && <ColorOptions setOpen={setIsOpenColorOptions} columns={11} currentColor={folderColor}  colorCollection={FOLDER_COLORS} onClick={handleUpdateColor}/>}
                            </li>
                        </ul>



                        <div className={s.footer}>
                            <Confirmation 
                                disabled={canDeleteWithoutConfirmation}
                                onClick={handleDeleteFolder} 
                                content={
                                    <div>
                                        <span style={{fontWeight:700}}>Êtes vous sûres de vouloir <span style={{color:COLOR.state.error_dark}}>supprimer</span> ce dossier ?</span>
                                        <div>Tout ce que contient ce dossier sera définitivement perdu.</div>
                                    </div>
                                }
                            >
                                <button className={s.delete}>Supprimer le dossier</button>
                            </Confirmation>
                            <button disabled={!haveModificationUnsaved} onClick={handleSave} className={withClass(s.save, haveModificationUnsaved && s.active)}>Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </Overlay>
                        
    )
}