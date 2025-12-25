"use client"
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import s from "./styles.module.scss"
import handleResponse from "@/utils/handleResponse"
import { addTask } from "@/app/actions/task"
import { toast } from "react-toastify"
import { useQueryClient } from "@tanstack/react-query"
import { useAppSelector } from "@/store/hooks"
import useCallbackOnClickOutside from "@/hooks/useCallbackOnClickOutside"

interface NewTaskItemProps{
    listColor:string
    listID:string
    setIsAddingTask:Dispatch<SetStateAction<boolean>>
}


export default function NewTaskItem(props:NewTaskItemProps){

    const queryClient = useQueryClient()
    const selectedFolderID = useAppSelector(store => store.folder.selectedFolderID)
    const [taskTitle, setTaskTitle] = useState("")
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const containerRef = useRef<HTMLLIElement>(null);


    const isEnter = (e: React.KeyboardEvent) => e.key === "Enter";

    const handleChangeTaskTitle = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.currentTarget.value
        setTaskTitle(newValue)
    }

    const handleAddTask = (keyboardEvent?:React.KeyboardEvent) => {
        if(keyboardEvent) keyboardEvent.preventDefault()
        if(taskTitle.trim()){
            handleResponse(async() => {
                await addTask({title:taskTitle, listID:props.listID})
                queryClient.invalidateQueries({ queryKey: ['lists', selectedFolderID] })
            })
        }
        if(keyboardEvent){
            setTaskTitle("")
            props.setIsAddingTask(true)
            textareaRef.current!.value = ""
        }else{
            props.setIsAddingTask(false)
        }
    }


    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
        }
    }, [taskTitle])

    useCallbackOnClickOutside(containerRef, handleAddTask)

    return(
        <li ref={containerRef} style={{backgroundColor:props.listColor}} className={s.container}>
            <div className={s.content}>
                <textarea ref={textareaRef} rows={1} onKeyDown={(e) => isEnter(e) && handleAddTask(e)} value={taskTitle} onChange={handleChangeTaskTitle} autoFocus />
            </div>
        </li>
    )
}