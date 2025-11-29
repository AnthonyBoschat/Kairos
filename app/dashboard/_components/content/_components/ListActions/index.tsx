import React, { useCallback, useEffect, useRef, useState } from "react"
import s from "./styles.module.scss"
import withClass from "@/utils/class"
import Overlay from "@/components/overlay"
import handleResponse from "@/utils/handleResponse"
import { addList } from "@/app/actions/list"
import { toast } from "react-toastify"
import { useQueryClient } from "@tanstack/react-query"
import AddListIcon from "@/components/ui/icons/addList"


interface ListsActionsProps{
    selectedFolderID?:string
}

export default function ListsActions(props:ListsActionsProps){

    const queryClient = useQueryClient()
    const newListInputRef = useRef<null|HTMLInputElement>(null)
    const [isAddingList, setIsAddingList] = useState(false)
    const [newListTitle, setNewListTitle] = useState("")

    const isEnter = (e: React.KeyboardEvent) => e.key === "Enter";

    const handleSubmitAddList = useCallback((event:React.KeyboardEvent  | React.MouseEvent) => {
        if(newListTitle){
            event.preventDefault()
            handleAddList(newListTitle)
        }
    }, [newListTitle])
    
    
    const handleAddList = (newListTitle:string) => {
        handleResponse(async() => {
            if(props.selectedFolderID){
                const response = await addList({title:newListTitle, folderID:props.selectedFolderID})
                setIsAddingList(false)
                setNewListTitle("")
                toast.success(response.message)
                queryClient.invalidateQueries({ queryKey: ['lists', props.selectedFolderID] })
            }
        })
    }

    const handleClickAddList = () => {
        setIsAddingList(true)
    }

    useEffect(() => {
        if(newListInputRef.current){
            if(isAddingList) newListInputRef.current.focus()
            else newListInputRef.current.blur()
        }
    }, [isAddingList, newListInputRef])

    return(
        <div className={s.container}>
            <div className={s.buttonContainer}>
                <button title="Ouvrir le formulaire pour ajouter une nouvelle liste au dossier" onClick={handleClickAddList} className={withClass(s.add, isAddingList && s.active)}>
                    Ajouter une liste
                </button>
                {isAddingList && (
                    <Overlay onClose={() => setIsAddingList(false)}>
                        {(isClosing) => (
                            <form className={withClass(s.addListForm, isClosing && s.closing)}>
                                <input ref={newListInputRef} onKeyDown={(e) => isEnter(e) && handleSubmitAddList(e)} onChange={(e) => setNewListTitle(e.currentTarget.value)} type="text" value={newListTitle} />
                                <button title="Ajouter une nouvelle liste au dossier" onClick={handleSubmitAddList}>
                                    <AddListIcon/>
                                </button>
                            </form>
                        )}
                    </Overlay>
                )}
            </div>
        </div>
    )
}