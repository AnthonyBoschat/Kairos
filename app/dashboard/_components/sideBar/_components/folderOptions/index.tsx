"use client"
import s from "./styles.module.scss"
import FOLDER_COLORS from "@/constants/folderColor"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
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
import { useAppDispatch } from "@/store/hooks"
import { setSelectedFolderID } from "@/store/slices/folderSlice"
import { FolderWithList } from "@/types/list"
import StorageService from "@/services/StorageService"

interface FolderOptionsProps{
    folder: FolderWithList,
    setSelectedFolderOptions: Dispatch<SetStateAction<null|FolderWithList>>
}


export default function FolderOptions(props:FolderOptionsProps){
    
    const dispatch = useAppDispatch()
    const [folderShowProgression, setFolderShowProgression] = useState(props.folder?.showProgression)
    const [folderTitle, setFolderTitle]         = useState(props.folder?.title)
    const [folderColor, setFolderColor]         = useState(FOLDER_COLORS[props.folder?.color ?? 0])
    const [folderFavorite, setFolderFavorite]   = useState(props.folder?.favorite)
    const [onEditTitle, setOnEditTitle]         = useState<Boolean>(false)
    const [isOpenColorOptions, setIsOpenColorOptions] = useState<Boolean>(false)
    const folderTitleInputRef = useRef<null|HTMLInputElement>(null)
    const canDeleteWithoutConfirmation = props.folder.lists.length === 0

    const handleDeleteFolder = async() => {
        if(props.folder?.id){
            const folderID = props.folder.id
            handleResponse(async () => {
                const response = await deleteFolder(folderID)
                toast.success(response.message)
                props.setSelectedFolderOptions(null)
                dispatch(setSelectedFolderID(null))
                StorageService.remove("selectedFolderID")
            })
        }
    }

    const handleToggleFavorite = async() => {
        if(props.folder?.id){
            const folderID = props.folder.id
            handleResponse(async () => {
                const response = await toggleFolderFavorite(folderID)
                setFolderFavorite(current => !current)
                toast.success(response.message)
            })
        }
    }

    const handleSave = async() => {
        handleResponse(async() => {
            const response = await updateFolder({
                folderID:props.folder?.id,
                title:folderTitle,
                showProgression:folderShowProgression
            })
            toast.success(response.message)
            setOnEditTitle(false)
        })
    }

    const handleUpdateDefaultColor = async(colorIndex:number) => {
        handleResponse(async() => {
            const response = await updateFolderColor(props.folder.id, colorIndex)
            toast.dismiss()
            toast.success(response.message)
            setFolderColor(FOLDER_COLORS[colorIndex])
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
        <Overlay onClose={() => props.setSelectedFolderOptions(null)}>
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
                                {isOpenColorOptions && (
                                    <div className={s.colorOptions}>
                                        <ul>
                                            {FOLDER_COLORS.map((color, index) => (
                                                <li key={index}>
                                                    <button
                                                        title={`Changer la couleur du dossier pour ${color}`} 
                                                        className={withClass(folderColor === color && s.active)} 
                                                        style={{backgroundColor:color}}
                                                        onClick={() => handleUpdateDefaultColor(index)}
                                                    />
                                                </li>
                                            ))}
                                            
                                        </ul>
                                    </div>
                                )}
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
                            <button onClick={handleSave} className={s.save}>Enregister</button>
                        </div>
                    </div>
                </div>
            )}
        </Overlay>
                        
    )
}