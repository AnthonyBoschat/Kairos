"use client"
import { Task } from "@prisma/client"
import s from "./styles.module.scss"
import Overlay from "@/components/overlay"
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import withClass from "@/utils/class"
import handleResponse from "@/utils/handleResponse"
import { toggleTaskFavorite, updateTaskContent, updateTaskTitle } from "@/app/actions/task"
import { useQueryClient } from "@tanstack/react-query"
import SyncIcon from "@/components/ui/icons/Sync"
import SuccessIcon from "@/components/ui/icons/Success"
import StarIcon from "@/components/ui/icons/Star"
import { useDashboardContext } from "@/context/DashboardContext"
import { ListWithTaskAndFolder } from "@/types/list"
import RichEditor from "@/components/richEditor"


interface TaskDetailProps{
    listColor:string
    task:Task
    setTaskDetail:Dispatch<SetStateAction<null|Task>>
}


export default function TaskDetail(props:TaskDetailProps){

    const titleRef          = useRef<HTMLTextAreaElement>(null)
    const contentTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
    const titleTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
    const contentValueRef   = useRef(props.task.content || "")
    const titleValueRef     = useRef(props.task.title   || "")

    const [titleMemory, setTitleMemory] = useState(props.task.title || "")
    const [title, setTitle]             = useState(props.task.title || "")
    const [isSyncData, setIsSyncData]   = useState(true)
    
    const queryClient           = useQueryClient()
    const {selectedFolderID}    = useDashboardContext()
    
    const handleChangeTaskContent = useCallback((html: string) => {
        contentValueRef.current = html
        setIsSyncData(false)

        if (contentTimerRef.current){
            clearTimeout(contentTimerRef.current)
        }
        contentTimerRef.current = setTimeout(() => {
            handleUpdateTaskContent(contentValueRef.current)
            setIsSyncData(true)
        }, 800)
    }, [])



    const handleChangeTaskTitle = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value
        setTitle(value)
        titleValueRef.current = value

        setIsSyncData(false)

        if (titleTimerRef.current){
            clearTimeout(titleTimerRef.current)
        }
        titleTimerRef.current = setTimeout(() => {
            handleUpdateTaskTitle(titleValueRef.current)
            setIsSyncData(true)
        }, 300)
    }, [])

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
                            task.id === props.task.id ? { ...task, content: currentContent.trim() === "" ? null : currentContent  } : task
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
        if (titleRef.current) {
            titleRef.current.style.height = "auto"
            titleRef.current.style.height = titleRef.current.scrollHeight + "px"
        }
    }, [titleValueRef.current])

    return(
        <Overlay root onClose={() => props.setTaskDetail(null)}>
            {(isClosing) => {

                if (isClosing && !isSyncData) handleUpdateTaskContent(contentValueRef.current)
                    
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
                                <RichEditor
                                    value={contentValueRef.current}
                                    color={props.listColor}
                                    placeholder="Commencer à rédiger du contenu"
                                    onChange={(html) => {
                                        handleChangeTaskContent(html)
                                    }}
                                />
                            </div>


                            <div className={s.sync}>
                                {isSyncData && <span title="Contenu enregistré"><SuccessIcon size={16} /></span>}
                                {!isSyncData && <span title="Contenu en cours de sauvegarde"><SyncIcon size={16}/></span>}
                            </div>
                        </div>

                    </div>
                )
            }}
        </Overlay>
        
    )
}