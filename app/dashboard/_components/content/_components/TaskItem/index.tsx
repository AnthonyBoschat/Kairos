"use client"
import { Task } from "@prisma/client"
import s from "./styles.module.scss"

interface TaskItemProps{
    listColor:string,
    task:Task
}


export default function TaskItem(props:TaskItemProps){


    return(
        <li style={{backgroundColor:props.listColor}} className={s.container} key={props.task.id}>
            <div className={s.content}>
                {props.task.title}
            </div>
        </li>
    )
}