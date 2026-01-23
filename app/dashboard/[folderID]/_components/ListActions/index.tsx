import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react"
import s from "./styles.module.scss"
import withClass from "@/utils/class"
import Overlay from "@/components/overlay"
import handleResponse from "@/utils/handleResponse"
import { addList } from "@/app/actions/list"
import { toast } from "react-toastify"
import { useQueryClient } from "@tanstack/react-query"
import AddListIcon from "@/components/ui/icons/addList"
import useCallbackOnClickOutside from "@/hooks/useCallbackOnClickOutside"
import { useDashboardContext } from "@/context/DashboardContext"
import { addTask } from "@/app/actions/task"
import { Task } from "@prisma/client"
import { Qahiri } from "next/font/google"
import { TaskAbortError } from "@reduxjs/toolkit"

interface ListsActionsProps{
    standaloneID?: undefined|string
    setOrderedTasks?: Dispatch<SetStateAction<Task[]>>
}


export default function ListsActions(props:ListsActionsProps){

    const {selectedFolderID} = useDashboardContext()
    const queryClient   = useQueryClient()
    const formRef       = useRef<null|HTMLFormElement>(null)
    const inputRef      = useRef<null|HTMLInputElement>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [newTitle, setNewTitle] = useState("")

    const addLabel = useMemo(() => props.standaloneID ? "Ajouter un élément" : "Ajouter une liste", [props.standaloneID])

    const isEnter = (e: React.KeyboardEvent) => e.key === "Enter";

    const resetNewList = () => {
        setNewTitle("")
        setIsAdding(false)
    }
    
    const handleClickAddList = () => {
        setIsAdding(true)
    }


    
    const handleAdd = useCallback((title:string, KeyboardEvent?:React.KeyboardEvent) => {
        if(KeyboardEvent) KeyboardEvent.preventDefault()
        if(title.trim()){
            handleResponse(async() => {
                if(selectedFolderID){
                    if(props.standaloneID && props.setOrderedTasks){
                        const result = await addTask({title: title, listID: props.standaloneID})
                        const task: Task = result.task
                        props.setOrderedTasks(current => current ? [task, ...current] : [task])
                    }else{
                        await addList({title:title, folderID:selectedFolderID})
                    }

                    setNewTitle("")
                    queryClient.invalidateQueries({ queryKey: ['lists', selectedFolderID] })
                    queryClient.invalidateQueries({queryKey:["historic"]})

                }
            })
        }
        if(KeyboardEvent){
            setIsAdding(true)
            setNewTitle("")
        }else{
            setIsAdding(false)
        }
    }, [props.standaloneID])

    useEffect(() => {
        if(inputRef.current){
            if(isAdding) inputRef.current.focus()
            else inputRef.current.blur()
        }
    }, [isAdding, inputRef])

    useCallbackOnClickOutside(formRef, resetNewList)

    return(
        <div className={s.container}>
            <div className={s.buttonContainer}>
                <button title={`Ouvrir le formulaire pour ajouter ${props.standaloneID ? "un nouvel élément à la liste" : "une nouvelle liste au dossier"}`} onClick={handleClickAddList} className={withClass(s.add, isAdding && s.active)}>
                    {addLabel}
                </button>
                {isAdding && (
                    <Overlay onClose={() => setIsAdding(false)}>
                        {(isClosing) => (
                            <form ref={formRef} className={withClass(s.addListForm, isClosing && s.closing)}>
                                <input ref={inputRef} onKeyDown={(e) => isEnter(e) && handleAdd(newTitle, e)} onChange={(e) => setNewTitle(e.currentTarget.value)} type="text" value={newTitle} />
                                <button title={`Ajouter ${props.standaloneID ? "un nouvel élément à la liste" : "une nouvelle liste au dossier"}`} onClick={() => handleAdd(newTitle)}>
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