import React, { useCallback, useEffect, useRef, useState } from "react"
import s from "./styles.module.scss"
import withClass from "@/utils/class"
import Overlay from "@/components/overlay"
import handleResponse from "@/utils/handleResponse"
import { addList } from "@/app/actions/list"
import { toast } from "react-toastify"
import { useQueryClient } from "@tanstack/react-query"
import AddListIcon from "@/components/ui/icons/addList"
import useCallbackOnClickOutside from "@/hooks/useCallbackOnClickOutside"


interface ListsActionsProps{
    selectedFolderID?:string
}

export default function ListsActions(props:ListsActionsProps){

    const queryClient = useQueryClient()
    const newListInputRef = useRef<null|HTMLInputElement>(null)
    const [isAddingList, setIsAddingList] = useState(false)
    const [newListTitle, setNewListTitle] = useState("")

    const isEnter = (e: React.KeyboardEvent) => e.key === "Enter";

    const resetNewList = () => {
        setNewListTitle("")
        setIsAddingList(false)
    }
    
    const handleClickAddList = () => {
        setIsAddingList(true)
    }
    
    const handleAddList = useCallback(() => {
        if(newListTitle.trim()){
            handleResponse(async() => {
                if(props.selectedFolderID){
                    const response = await addList({title:newListTitle, folderID:props.selectedFolderID})
                    setNewListTitle("")
                    toast.success(response.message)
                    queryClient.invalidateQueries({ queryKey: ['lists', props.selectedFolderID] })
                }
            })
        }
        setIsAddingList(false)
    }, [newListTitle])

    useEffect(() => {
        if(newListInputRef.current){
            if(isAddingList) newListInputRef.current.focus()
            else newListInputRef.current.blur()
        }
    }, [isAddingList, newListInputRef])

    useCallbackOnClickOutside(newListInputRef, resetNewList)

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
                                <input ref={newListInputRef} onKeyDown={(e) => isEnter(e) && handleAddList()} onChange={(e) => setNewListTitle(e.currentTarget.value)} type="text" value={newListTitle} />
                                <button title="Ajouter une nouvelle liste au dossier" onClick={handleAddList}>
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