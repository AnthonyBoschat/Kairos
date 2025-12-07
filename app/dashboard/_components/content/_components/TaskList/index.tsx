"use client"
import { Task } from "@prisma/client"
import s from "./styles.module.scss"
import TaskItem from "../TaskItem"

interface TaskListProps{
    listColor:string
    tasks: Task[]
}


export default function TaskList(props:TaskListProps){


    return(
        <ul className={s.container}>
            {props.tasks.map(task => (
                <TaskItem listColor={props.listColor} task={task}/>
            ))}
        </ul>
    )
}