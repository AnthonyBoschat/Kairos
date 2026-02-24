"use client"
import { Task } from "@prisma/client"
import s from "./styles.module.scss"
import Overlay from "@/components/overlay"
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import withClass from "@/utils/class"
import handleResponse from "@/utils/handleResponse"
import { toggleTaskFavorite, updateTaskContent, updateTaskTitle } from "@/app/actions/task"
import useDebouncedValue from "@/hooks/useDebouncedValue"
import { useQueryClient } from "@tanstack/react-query"
import LoadingIcon from "@/components/ui/icons/Loading"
import SuccessIcon from "@/components/ui/icons/Success"
import StarIcon from "@/components/ui/icons/Star"
import { useDashboardContext } from "@/context/DashboardContext"
import { ListWithTaskAndFolder } from "@/types/list"

interface TaskDetailProps{
    listColor:string
    task:Task
    setTaskDetail:Dispatch<SetStateAction<null|Task>>
}


export default function TaskDetail(props:TaskDetailProps){

    const titleRef                          = useRef<HTMLTextAreaElement>(null)

    const [titleMemory, setTitleMemory]     = useState(props.task.content || "")
    const [isSyncData, setIsSyncData]       = useState(true)
    const [content, setContent]             = useState(props.task.content || "")
    const [title, setTitle]                 = useState(props.task.title || "")
    
    const queryClient           = useQueryClient()
    const {selectedFolderID}    = useDashboardContext()
    const debouncedContent      = useDebouncedValue(content)
    const debouncedTitle        = useDebouncedValue(title, 300)
    

    const handleChangeTaskContent = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value)
        if(isSyncData) setIsSyncData(false)
    }, [isSyncData])

    const handleChangeTaskTitle = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTitle(event.target.value)
        if(isSyncData) setIsSyncData(false)
    }, [isSyncData])

    const handleUpdateTaskTitle = (currentTitle: string) => {
        handleResponse({
            request: () => updateTaskTitle({ taskID: props.task.id, title: currentTitle }),
            onSuccess: () => {
                queryClient.setQueriesData<ListWithTaskAndFolder[]>({ queryKey: ['lists', selectedFolderID] }, (previousLists) =>
                    previousLists?.map(list => ({
                        ...list,
                        tasks: list.tasks.map(task =>
                            task.id === props.task.id ? { ...task, title: currentTitle } : task
                        )
                    }))
                )
            }
        })
    }

    const handleUpdateTaskContent = (currentContent: string) => {
        handleResponse({
            request: () => updateTaskContent({ taskID: props.task.id, content: currentContent }),
            onSuccess: () => {
                queryClient.setQueriesData<ListWithTaskAndFolder[]>({ queryKey: ['lists', selectedFolderID] }, (previousLists) =>
                    previousLists?.map(list => ({
                        ...list,
                        tasks: list.tasks.map(task =>
                            task.id === props.task.id ? { ...task, content: currentContent } : task
                        )
                    }))
                )
            }
        })
    }

    const handleToggleFavorite = () => {
        handleResponse({
            request: () => toggleTaskFavorite({ taskID: props.task.id }),
            onSuccess: () => {
                queryClient.setQueriesData<ListWithTaskAndFolder[]>({ queryKey: ['lists', selectedFolderID] }, (previousLists) =>
                    previousLists?.map(list => ({
                        ...list,
                        tasks: list.tasks.map(task =>
                            task.id === props.task.id ? { ...task, favorite: !task.favorite } : task
                        )
                    }))
                )
            }
        })
    }

    useEffect(() => {
        if(isSyncData) return
        handleUpdateTaskContent(debouncedContent)
        setIsSyncData(true)
    }, [debouncedContent])

    useEffect(() => {
        if(isSyncData) return
        handleUpdateTaskTitle(debouncedTitle)
        setIsSyncData(true)
    }, [debouncedTitle])

    useEffect(() => {
        if(props.task.title){
            setTitleMemory(props.task.title)
        }
    }, [props.task.title])

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.height = "auto"
            titleRef.current.style.height = titleRef.current.scrollHeight + "px"
        }
    }, [title])

    return(
        <Overlay root onClose={() => props.setTaskDetail(null)}>
            {(isClosing) => {

                if (isClosing && !isSyncData) handleUpdateTaskContent(content)
                    
                return(
                    <div className={withClass(s.container, isClosing && s.closing)}>
                        <div className={s.card}>
                            <div className={s.cardBefore} style={{ backgroundColor: props.listColor }} />
                            <div className={s.header}>
                                <textarea placeholder={titleMemory} rows={1} ref={titleRef} onChange={handleChangeTaskTitle} value={title} className={s.textarea} />

                                <button onClick={handleToggleFavorite} className={s.favorite}>
                                    <StarIcon animate active={props.task.favorite}/>
                                </button>
                            </div>
                            <div className={s.content}>
                                <textarea placeholder="Commencer à rédiger du contenu" onChange={handleChangeTaskContent} value={content} className={s.textarea} />
                            </div>


                            <div className={s.sync}>
                                {isSyncData && <span title="Contenu enregistré"><SuccessIcon size={16} /></span>}
                                {!isSyncData && <span title="Contenu en cours de sauvegarde"><LoadingIcon size={16}/></span>}
                            </div>
                        </div>

                    </div>
                )
            }}
        </Overlay>
        
    )
}