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
    const formRef = useRef<null|HTMLFormElement>(null)
    const inputRef = useRef<null|HTMLInputElement>(null)
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
    
    const handleAddList = (title:string, KeyboardEvent?:React.KeyboardEvent) => {
        if(KeyboardEvent) KeyboardEvent.preventDefault()
        if(title.trim()){
            handleResponse(async() => {
                if(props.selectedFolderID){
                    await addList({title:title, folderID:props.selectedFolderID})
                    setNewListTitle("")
                    queryClient.invalidateQueries({ queryKey: ['lists', props.selectedFolderID] })
                }
            })
        }
        if(KeyboardEvent){
            setIsAddingList(true)
            setNewListTitle("")
        }else{
            setIsAddingList(false)
        }
    }

    useEffect(() => {
        if(inputRef.current){
            if(isAddingList) inputRef.current.focus()
            else inputRef.current.blur()
        }
    }, [isAddingList, inputRef])

    useCallbackOnClickOutside(formRef, resetNewList)

    return(
        <div className={s.container}>
            <div className={s.buttonContainer}>
                <button title="Ouvrir le formulaire pour ajouter une nouvelle liste au dossier" onClick={handleClickAddList} className={withClass(s.add, isAddingList && s.active)}>
                    Ajouter une liste
                </button>
                {isAddingList && (
                    <Overlay onClose={() => setIsAddingList(false)}>
                        {(isClosing) => (
                            <form ref={formRef} className={withClass(s.addListForm, isClosing && s.closing)}>
                                <input ref={inputRef} onKeyDown={(e) => isEnter(e) && handleAddList(newListTitle, e)} onChange={(e) => setNewListTitle(e.currentTarget.value)} type="text" value={newListTitle} />
                                <button title="Ajouter une nouvelle liste au dossier" onClick={() => handleAddList(newListTitle)}>
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