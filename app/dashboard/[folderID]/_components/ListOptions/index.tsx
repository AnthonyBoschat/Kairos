"use client"
import s from "./styles.module.scss"
import { Dispatch, useEffect, useRef, useState } from "react"
import withClass from "@/utils/class"
import EditIcon from "@/components/ui/icons/Edit"
import { toast } from "react-toastify"
import handleResponse from "@/utils/handleResponse"
import Confirmation from "@/components/confirm"
import COLOR from "@/constants/color"
import StarIcon from "@/components/ui/icons/Star"
import LIST_COLOR from "@/constants/listColor"
import { deleteList, toggleListFavorite, updateList, updateListColor } from "@/app/actions/list"
import { useQueryClient } from "@tanstack/react-query"
import Overlay from "@/components/overlay"
import { ListWithTaskAndFolder } from "@/types/list"
import ColorOptions from "@/components/colorOptions"

interface ListOptionsProps{
    list: ListWithTaskAndFolder
    setSelectedListOptions: Dispatch<null|ListWithTaskAndFolder>
}


export default function ListOptions(props:ListOptionsProps){
    
    const queryClient = useQueryClient()
    const [listTitle, setListTitle]         = useState(props.list?.title)
    const [listColor, setListColor]         = useState(LIST_COLOR[props.list.color ?? 0])
    const [listFavorite, setListFavorite]   = useState(props.list?.favorite)
    const [onEditTitle, setOnEditTitle]     = useState<Boolean>(false)
    const [listCountElement, setListCountElement]       = useState(props.list?.countElement)
    const [isOpenColorOptions, setIsOpenColorOptions]   = useState(false)
    const listTitleInputRef = useRef<null|HTMLInputElement>(null)
    const canDeleteWithoutConfirmation = props.list.tasks.length === 0

    const refetch = () => {
        queryClient.invalidateQueries({ queryKey: ['lists', props.list?.folderId] })
        queryClient.invalidateQueries({queryKey:["historic"]})
    }


    
    const handleDeleteList = async() => {
        if(props.list?.id){
            const listID = props.list.id
            handleResponse(async () => {
                await deleteList(listID)
                refetch()
                props.setSelectedListOptions(null)
            })
        }
    }

    const handleToggleFavorite = async() => {
        if(props.list?.id){
            const listID = props.list.id
            handleResponse(async () => {
                await toggleListFavorite(listID)
                setListFavorite(current => !current)
                refetch()
            })
        }
    }

    const handleSave = async() => {
        handleResponse(async() => {
            await updateList({
                listID:props.list?.id,
                title:listTitle,
                countElement:listCountElement
            })
            refetch()
            setOnEditTitle(false)
        })
    }

    const handleUpdateColor = async(colorIndex:number) => {
        handleResponse(async() => {
            await updateListColor(props.list.id, colorIndex)
            toast.dismiss()
            setListColor(LIST_COLOR[colorIndex])
            refetch()
        })
    }

    useEffect(() => {
        if(listTitleInputRef.current){
            if(onEditTitle) listTitleInputRef.current.focus()
            else listTitleInputRef.current.blur()
        }
    }, [onEditTitle, listTitleInputRef])


    if(!props.list) return null
    return(
        <>
            <Overlay root onClose={() => props.setSelectedListOptions(null)}>
                {(isClosing) => (
                    <div
                        className={withClass(s.container, isClosing && s.closing)}
                    >
                        
                        <div className={s.card}>
                            <div className={s.header}>
                                <span>
                                    Paramètres de liste
                                </span>
                                <button onClick={handleToggleFavorite}>
                                    <StarIcon animate active={listFavorite} size={24}/>
                                </button>
                            </div>
                            <ul className={s.options}>
                                <li className={s.title}>
                                    <span className={s.key}>Nom</span>
                                    <span className={s.value}>
                                        <input ref={listTitleInputRef} onChange={(e) => setListTitle(e.target.value)} className={withClass(onEditTitle && s.active)} type="text" value={listTitle} />
                                        <button className={withClass(onEditTitle && s.active)} onClick={() => setOnEditTitle(current => !current)}>
                                            <EditIcon/>
                                        </button>
                                    </span>
                                </li>
                                <li className={s.color}>
                                    <span className={s.key}>Couleur</span>
                                    <span className={s.value}>
                                        <button onClick={() => setIsOpenColorOptions(current => !current)} style={{backgroundColor:listColor, boxShadow:"inset 0 0 0 1px rgba(0, 0, 0, 0.15)"}}/>
                                    </span>
                                    {isOpenColorOptions && <ColorOptions columns={11} currentColor={listColor} colorCollection={LIST_COLOR} onClick={handleUpdateColor}/>}
                                </li>
                                <li className={s.countElement}>
                                    <span className={s.key}>Afficher le nombre d'éléments</span>
                                    <span className={s.value}>
                                        <button onClick={() => setListCountElement(true)} className={withClass(listCountElement && s.active)}>Oui</button>
                                        <button onClick={() => setListCountElement(false)} className={withClass(!listCountElement && s.active)}>Non</button>
                                    </span>
                                </li>
                            </ul>
                            <div className={s.footer}>
                                <Confirmation 
                                    disabled={canDeleteWithoutConfirmation}
                                    onClick={handleDeleteList} 
                                    content={
                                        <div>
                                            <span style={{fontWeight:700}}>Êtes vous sûres de vouloir <span style={{color:COLOR.state.error_dark}}>supprimer</span> cette liste ?</span>
                                            <div>Tout ce que contient la liste sera définitivement perdu.</div>
                                        </div>
                                    }
                                >
                                    <button className={s.delete}>Supprimer la liste</button>
                                </Confirmation>
                                <button onClick={handleSave} className={s.save}>Enregister</button>
                            </div>
                        </div>
                    </div>
                )}
            </Overlay>
        </>
        
    )
}