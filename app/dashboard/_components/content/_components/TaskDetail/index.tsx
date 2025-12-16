"use client"
import { Task } from "@prisma/client"
import s from "./styles.module.scss"
import Overlay from "@/components/overlay"
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"
import withClass from "@/utils/class"
import handleResponse from "@/utils/handleResponse"
import { updateTaskContent } from "@/app/actions/task"
import useDebouncedValue from "@/hooks/useDebouncedValue"
import { useAppSelector } from "@/store/hooks"
import { useQueryClient } from "@tanstack/react-query"
import LoadingIcon from "@/components/ui/icons/Loading"
import SuccessIcon from "@/components/ui/icons/Success"

interface TaskDetailProps{
    listColor:string
    task:Task
    setTaskDetail:Dispatch<SetStateAction<null|Task>>
}


export default function TaskDetail(props:TaskDetailProps){

    const queryClient = useQueryClient()
    const selectedFolderID = useAppSelector(store => store.folder.selectedFolderID)
    const [content, setContent] = useState(props.task.content || "")
    const [isSyncContent, setIsSyncContent] = useState(true)
    const debouncedContent = useDebouncedValue(content)


    const handleChangeTaskContent = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value)
        if(isSyncContent) setIsSyncContent(false)
    }, [isSyncContent])

    const handleUpdateTaskContent = (currentContent:string) => {
        handleResponse(async () => {
            await updateTaskContent({taskID:props.task.id, content: currentContent})
            queryClient.invalidateQueries({queryKey:["lists", selectedFolderID]})
        })
    }

    useEffect(() => {
        handleUpdateTaskContent(debouncedContent)
        setIsSyncContent(true)
    }, [debouncedContent])

    return(
        <Overlay onClose={() => props.setTaskDetail(null)}>
            {(isClosing) => {

                if (isClosing && !isSyncContent) handleUpdateTaskContent(content)
                    
                return(
                    <div className={withClass(s.container, isClosing && s.closing)}>
                        <div className={s.card}>
                            <div className={s.cardBefore} style={{ backgroundColor: props.listColor }} />
                            <div className={s.header}>
                                <span>
                                    {props.task.title}
                                    
                                </span>
                            </div>
                            <div className={s.content}>
                                <textarea placeholder="Commencer à rédiger du contenu" onChange={handleChangeTaskContent} value={content} className={s.textarea} />
                            </div>


                            <div className={s.sync}>
                                {isSyncContent && <span title="Contenu enregistré"><SuccessIcon size={16} /></span>}
                                {!isSyncContent && <span title="Contenu en cours de sauvegarde"><LoadingIcon size={16}/></span>}
                            </div>
                        </div>

                    </div>
                )
            }}
        </Overlay>
        
    )
}