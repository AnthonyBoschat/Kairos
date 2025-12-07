"use client"
import { Task } from "@prisma/client"
import s from "./styles.module.scss"
import { useState } from "react"
import withClass from "@/utils/class"
import ArrowLeftIcon from "@/components/ui/icons/ArrowLeft"

interface TaskItemProps{
    listColor:string,
    task:Task
}


export default function TaskItem(props:TaskItemProps){

    const [isHover, setIsHover] = useState(false)

    return(
        <li onMouseLeave={() => setIsHover(false)} onMouseEnter={() => setIsHover(true)} style={{backgroundColor:props.listColor}} className={s.container} key={props.task.id}>
            <div className={s.content}>
                {props.task.title}
            </div>
            <div className={withClass(s.indicator, (isHover) && s.active)}>
                {isHover && <ArrowLeftIcon size={16}/>}
            </div>
        </li>
    )
}