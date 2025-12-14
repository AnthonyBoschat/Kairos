"use client"
import { Task } from "@prisma/client"
import s from "./styles.module.scss"
import Overlay from "@/components/overlay"
import { Dispatch, SetStateAction, useState } from "react"
import Divider from "@/components/divider"
import withClass from "@/utils/class"

interface TaskDetailProps{
    listColor:string
    task:Task
    setTaskDetail:Dispatch<SetStateAction<null|Task>>
}


export default function TaskDetail(props:TaskDetailProps){

    const hasContent = props.task.content !== null
    const [content, setContent] = useState(props.task.content || "")

    return(
        <Overlay onClose={() => props.setTaskDetail(null)}>
            {(isClosing) => (
                <div className={withClass(s.container, isClosing && s.closing)}>
                    <div className={s.card}>
                        <div className={s.cardBefore} style={{ backgroundColor: props.listColor }} />
                        <div className={s.header}>
                            <span>
                                {props.task.title}
                            </span>
                        </div>
                        <div className={s.content}>
                            <textarea placeholder="Commencer à rédiger du contenu" onChange={(e) => setContent(e.target.value)} value={content} className={s.textarea} />
                        </div>
                    </div>
                </div>
            )}
        </Overlay>
        
    )
}